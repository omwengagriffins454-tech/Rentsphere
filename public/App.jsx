import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentsDashboard from "./components/PaymentDashboard";
import Navbar from "./components/Navbar";
import PaymentHistory from "./pages/PaymentHistory";
import SplashScreen from "./components/SplashScreen";
import ListingDetails from "../src/pages/ListingDetails";
import Payment from "../src/pages/payment";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
    <Navbar />
    {loading ? (
      <SplashScreen onflash={() => setLoading(false)} />
    ) : (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-history" element={
         <ProtectedRoute>
           <PaymentHistory />
         </ProtectedRoute>  
        }
      />  
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        }
      />  
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
        <Route path="/dashboard/payments" element={<PaymentsDashboard />} />
        <Route path="/owner-dashboard" element={
          <ProtectedRoute>
            <OwnerDashboard />
        </ProtectedRoute>
        }
      />
        <Route path="/tenant-dashboard" element={
          <ProtectedRoute>
            <TenantDashboard />
          </ProtectedRoute>
        }
      />  
      </Routes>
    </BrowserRouter>
    )}
    </>
  );
}

export default App;