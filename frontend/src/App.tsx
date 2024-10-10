import { ClerkProvider } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { NotFound } from "./components/NotFound";
import { Shops } from "./pages/Shops";
import { AboutUs } from "./pages/AboutUs";
import { ContactUs } from "./pages/ContactUs";
import { ManageShops } from "./pages/ManageShops";

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
          <Route path="/shops" element={<Shops />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/manage-shops" element={<ManageShops />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClerkProvider>
    </>
  );
}

export default App;
