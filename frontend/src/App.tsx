import { ClerkProvider } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectRoute";
import { Home } from "./pages/Home";
import { NotFound } from "./components/NotFound";
import { Shops } from "./pages/Shops";
import { AboutUs } from "./pages/AboutUs";
import { ContactUs } from "./pages/ContactUs";
import { ManageShops } from "./pages/ManageShops";
import { RegisterShop } from "./pages/RegisterShop";
import { UpdateShop } from "./pages/UpdateShop";
import { ShopDetails } from "./pages/ShopDetails";
import { OwnerManageShop } from "./pages/OwnerManageShop";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/shops"
            element={
              <ProtectedRoute>
                <Shops />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/shop">
            <Route
              path="manage"
              element={
                <ProtectedRoute>
                  <ManageShops />
                </ProtectedRoute>
              }
            />
            <Route
              path="register"
              element={
                <ProtectedRoute>
                  <RegisterShop />
                </ProtectedRoute>
              }
            />
            <Route
              path="update"
              element={
                <ProtectedRoute>
                  <UpdateShop />
                </ProtectedRoute>
              }
            />
            <Route
              path=":shopId"
              element={
                <ProtectedRoute>
                  <ShopDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage/:shopId"
              element={
                <ProtectedRoute>
                  <OwnerManageShop />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClerkProvider>
    </>
  );
}

export default App;
