document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Your message has been received!');
  e.target.reset();

const userType = localStorage.getItem("userType");
const email = localStorage.getItem("email");
const dashboard = document.getElementById("dashboardContent");

if (!userType) {
  window.location.href = "login.html";
}

// Keep listings in localStorage
let listings = JSON.parse(localStorage.getItem("listings") || "[]");

function saveListings() {
  localStorage.setItem("listings", JSON.stringify(listings));
}

if (userType === "owner") {
  dashboard.innerHTML = `
    <h2>Welcome, ${email}</h2>
    <p>Pay Ksh 1000 to post your listing:</p>
    <div id="owner-pay"></div>
    <hr />
    <form id="listingForm" style="display:none;">
      <input type="text" id="title" placeholder="Apartment title" required />
      <input type="text" id="price" placeholder="Monthly rent (Ksh)" required />
      <input type="text" id="location" placeholder="Location" required />
      <button type="submit" class="btn">Add Listing</button>
    </form>
    <div id="ownerListings"></div>
  `;

  // PayPal for owner
  paypal.Buttons({
    createOrder: (data, actions) =>
      actions.order.create({
        purchase_units: [{ amount: { value: "7.00" } }], // roughly Ksh 1000
      }),
    onApprove: (data, actions) =>
      actions.order.capture().then(() => {
        alert("✅ Payment successful! You can now post listings.");
        document.getElementById("listingForm").style.display = "block";
      }),
  }).render("#owner-pay");

  // Handle listing form
  document
    .getElementById("listingForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const newListing = {
        id: Date.now(),
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        location: document.getElementById("location").value,
        booked: false,
      };
      listings.push(newListing);
      saveListings();
      renderOwnerListings();
    });

  renderOwnerListings();
}

function renderOwnerListings() {
  const div = document.getElementById("ownerListings");
  div.innerHTML = listings
    .map(
      (l) => `
      <div class="listing ${l.booked ? "booked" : ""}">
        <h3>${l.title}</h3>
        <p>Ksh ${l.price} / month</p>
        <p>${l.location}</p>
        <p>Status: ${l.booked ? "Booked" : "Available"}</p>
      </div>`
    )
    .join("");
}

// ===== TENANT DASHBOARD =====
if (userType === "tenant") {
  dashboard.innerHTML = `
    <h2>Welcome, ${email}</h2>
    <p>Available Listings:</p>
    <div id="tenantListings"></div>
  `;
  renderTenantListings(dashboard.innerHTML = `
  <h2>Welcome, ${email}</h2>
  <p>Available Listings:</P>
  <div id="tenantListings"></div>
  <hr />
  <h3 id="mapTitle">🗺️ Map</h3>
  <div id="map" style="width: 100%; height: 400px; border-radius: 8px;"></div>
  <p>${l.location}</p>
<p>Status: ${l.booked ? "Booked" : "Available"}</p>
${
  !l.booked
    ? `<div id="paypal-${l.id}"></div>
       <button onclick="mpesaBook(${l.id})" class="mpesa-button">📱 Pay Ksh 50 with M-Pesa</button>`
    : `<button onclick="showMap(${l.id})" class="btn">📍 View on Map</button>`
}
`)
}

function renderTenantListings() {
  const div = document.getElementById("tenantListings");
  if (!div) return;

  div.innerHTML = listings
    .map(
      (l) => `
      <div class="listing ${l.booked ? "booked" : ""}">
        <h3>${l.title}</h3>
        <p>Ksh ${l.price} / month</p>
        <p>${l.location}</p>
        <p>Status: ${l.booked ? "Booked" : "Available"}</p>
        ${
          !l.booked
            ? `<div id="paypal-${l.id}"></div>
               <button onclick="mpesaBook(${l.id})" class="mpesa-button">📱 Pay Ksh 50 with M-Pesa</button>`
            : ""
        }
      </div>`
    )
    .join("");

  listings.forEach((l) => {
    if (!l.booked)
      paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [{ amount: { value: "0.35" } }], // ≈ Ksh 50
            }),
          onApprove: (data, actions) =>
            actions.order.capture().then(() => {
              alert(`✅ You booked ${l.title}!`);
              l.booked = true;
              saveListings();
              renderTenantListings();
            }),
        })
        .render(`#paypal-${l.id}`);
  });
}

window.mpesaBook = (id) => {
  alert("Simulating M-Pesa payment...");
  setTimeout(() => {
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      listing.booked = true;
      saveListings();
      alert(`✅ You booked ${listing.title} via M-Pesa`);
      renderTenantListings();
    }
  }, 2000);
};
});

// ===== GOOGLE MAPS SETUP =====
let map;
let mapMarker;

// Initialize empty map
function initMap() {
  const defaultLocation = { lat: -1.286389, lng: 36.817223 }; // Nairobi center
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 10,
  });
}

// Show map for a listing
function showMap(listing) {
  if (!listing.location) return alert("No location available for this listing.");

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: listing.location }, (results, status) => {
    if (status === "OK") {
      const position = results[0].geometry.location;
      map.setCenter(position);
      map.setZoom(14);

      if (mapMarker) mapMarker.setMap(null);
      mapMarker = new google.maps.Marker({
        map,
        position,
        title: listing.title,
      });

      document.getElementById("mapTitle").innerText = `📍 ${listing.title} Location`;
    } else {
      alert("Map error: " + status);
    }
  });
}