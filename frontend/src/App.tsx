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
import { Toaster } from "sonner";
import { AddMenuItem } from "./pages/AddMenuItems";
import { MenuDetails } from "./pages/MenuDetails";
import { Offer } from "./pages/Offer";
import { UpdateMenu } from "./pages/UpdateMenu";
import { UpdateOffer } from "./pages/UpdateOffer";
import { Cart } from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import { Order } from "./pages/Order";
import { UserOrder } from "./pages/UserOrder";
import { ShopOrders } from "./pages/ShopOrders";
import { Items } from "./pages/Items";
import { Support } from "./pages/Support";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/items" element={<Items />} />
            <Route
              path="/support/:userId"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/:userId/order" element={<UserOrder />} />
            <Route path="/order" element={<Order />} />
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
              <Route path="orders/:shopId" element={<ShopOrders />} />
              <Route
                path="manage/:shopId"
                element={
                  <ProtectedRoute>
                    <ShopDetails />
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
                path=":shopId/menu/:menuId/offer/:offerId/update"
                element={
                  <ProtectedRoute>
                    <UpdateOffer />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":shopId/menu/:menuId/offer"
                element={
                  <ProtectedRoute>
                    <Offer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="update/:shopId"
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
                path=":shopId/menu/:menuId/update"
                element={
                  <ProtectedRoute>
                    <UpdateMenu />
                  </ProtectedRoute>
                }
              />

              <Route
                path=":shopId/add-menu"
                element={
                  <ProtectedRoute>
                    <AddMenuItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":shopId/menu/:menuId"
                element={
                  <ProtectedRoute>
                    <MenuDetails />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </ClerkProvider>
      <Toaster />
    </>
  );
}

export default App;
