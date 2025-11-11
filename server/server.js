import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { initFirebaseAdmin, db } from "./firebaseAdmin.js";
import { getMpesaToken, initiateStkPush } from "./mpesaServer.js";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";

dotenv.config();
initFirebaseAdmin();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health
app.get("/", (req, res) => res.send("Rentsphere payments API running"));

// Create PayPal order (server)
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount, currency = "USD", listingId, userId } = req.body;
    if (!amount || !listingId) return res.status(400).json({ error: "missing fields" });

    const order = await createPayPalOrder({ amount, currency });
    // optional: save a "pending" payment doc
    await addDoc(collection(db, "payments"), {
      userId: userId || null,
      listingId,
      method: "PayPal",
      amount: Number(amount),
      status: "Created",
      createdAt: new Date(),
    });

    res.json({ orderId: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Capture PayPal order (server)
app.post("/api/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, listingId, userId } = req.body;
    if (!orderId || !listingId) return res.status(400).json({ error: "missing fields" });

    const capture = await capturePayPalOrder(orderId);
    // capture.result.status usually "COMPLETED"
    const status = capture.result.status;

    // Save payment, mark listing booked
    await addDoc(collection(db, "payments"), {
      userId: userId || null,
      listingId,
      method: "PayPal",
      amount: Number(capture.result.purchase_units[0].payments.captures[0].amount.value),
      status,
      raw: capture.result,
      timestamp: new Date(),
    });

    // Update listing in Firestore (booked true)
    await updateDoc(doc(db, "listings", listingId), { booked: true });

    res.json({ success: true, capture: capture.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// Initiate M-Pesa STK Push
app.post("/api/mpesa/stkpush", async (req, res) => {
  try {
    const { phone, amount, listingId, userId } = req.body;
    if (!phone || !amount || !listingId) return res.status(400).json({ error: "missing fields" });

    const token = await getMpesaToken();
    const resp = await initiateStkPush({ token, phone, amount, listingId, userId });

// resp should contain CheckoutRequestID
await addDoc(collection(db, "payments"), {
  userId: userId || null,
  listingId,
  method: "M-Pesa",
  amount: Number(amount),
  status: "Initiated",
  checkoutRequestId: resp.CheckoutRequestID || resp.Response?.CheckoutRequestID || null,
  createdAt: new Date(),
});
    // Save initiated payment doc
    await addDoc(collection(db, "payments"), {
      userId: userId || null,
      listingId,
      method: "M-Pesa",
      amount: Number(amount),
      status: "Initiated",
      stkResponse: resp,
      createdAt: new Date(),
    });

    res.json({ success: true, resp });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

// M-Pesa callback (Safaricom posts results here)
app.post("/api/mpesa/callback", async (req, res) => {
    const checkoutReqId = stkCallback.CheckoutRequestID;
const q = query(collection(db, "payments"), where("checkoutRequestId", "==", checkoutReqId));
const snapshot = await getDocs(q);
snapshot.forEach(async docSnap => {
  const data = docSnap.data();
  // update payments doc status, mpesaReceiptNumber etc.
  await updateDoc(doc(db, "payments", docSnap.id), { status: ResultCode === 0 ? "Success" : "Failed", mpesaReceiptNumber, timestamp: new Date() });
  // update listing
  if (data.listingId && ResultCode === 0) {
    await updateDoc(doc(db, "listings", data.listingId), { booked: true });
  }
});
  // Safaricom will post JSON. We capture and validate.
  try {
    // Optionally verify a secret header to ensure legitimacy (if set)
    const secret = process.env.MPESA_CALLBACK_SECRET;
    if (secret) {
      const incoming = req.headers["x-callback-signature"] || ""; // depends on setup
      // TODO: verify signature if you implement it
    }

    const body = req.body;
    // Safaricom wraps callback in "Body" -> "stkCallback"
    const stkCallback = body?.Body?.stkCallback || body?.stkCallback || null;
    if (!stkCallback) {
      console.log("No stkCallback found:", body);
      return res.status(200).send({ result: "no-op" });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;
    // If ResultCode === 0 => success. The callback contains CallbackMetadata with MpesaReceiptNumber, Amount, etc.
    let amount = null;
    let mpesaReceiptNumber = null;
    let phone = null;

    if (stkCallback.CallbackMetadata && stkCallback.CallbackMetadata.Item) {
      const items = stkCallback.CallbackMetadata.Item;
      items.forEach((it) => {
        if (it.Name === "Amount") amount = it.Value;
        if (it.Name === "MpesaReceiptNumber") mpesaReceiptNumber = it.Value;
        if (it.Name === "PhoneNumber") phone = it.Value;
      });
    }

    // You may find a mapping between CheckoutRequestID and listingId/userId in your DB (if you saved it)
    // For simplicity: mark any listing that was "Initiated" and matches amount and user phone? Better: save CheckoutRequestID when initiating STK push.
    // Let's assume we saved CheckoutRequestID as part of payments earlier (extend initiateStkPush to return CheckoutRequestID).
    // For general case, here we will update the payments doc where stkResponse contains CheckoutRequestID.

    // Find payments doc matching CheckoutRequestID
    // (This is server-side Firestore query; we'll do a basic search)
    const paymentsRef = collection(db, "payments");
    // Note: Firestore JS v9 server queries require getDocs(query(...)) — for brevity do a scan (not optimal).
    // We'll search for a payments doc where stkResponse.CheckoutRequestID matches
    // (Assuming initiateStkPush saved that response)
    // Implementation detail depends on how you store that reply. For now, update all payments with matching CheckoutRequestID

    // Simplify: write a new payments record for callback and mark listing booked if success:
    await addDoc(collection(db, "payments"), {
      method: "M-Pesa",
      amount,
      status: ResultCode === 0 ? "Success" : `Failed (${ResultCode})`,
      mpesaReceiptNumber,
      checkoutRequestId: CheckoutRequestID,
      merchantRequestId: MerchantRequestID,
      raw: stkCallback,
      timestamp: new Date(),
    });

    // Ideally update listing booked based on checkout data you previously saved with listingId.
    // If you saved listingId with the STK push request (recommended) then you can update listing here:
    // Example: if you saved checkoutRequestId -> listingId mapping in a field, query and update listing.
    // For now respond 200 to Safaricom:
    res.status(200).json({ message: "Callback processed" });
  } catch (err) {
    console.error("Callback processing error:", err);
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Payments API running on ${port}`));