import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCart } from "react-icons/io";
import { Button } from "./ui/button";
import { Search } from "./Search";
import { Sidebar } from "./Sidebar";

import { useUser } from "@clerk/clerk-react";
import { useCart } from "@/context/CartContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = useCart();

  const [search, setSearch] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { isSignedIn, isLoaded } = useUser();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const displaySearchButtonOnlyFor = [
    "/",
    "/shops",
    "/shop/:shopId/menu/:menuId",
  ];

  const shouldDisplaySearchButton = () => {
    if (displaySearchButtonOnlyFor.includes(location.pathname)) {
      return true;
    }
    const regex = /^\/shop\/[^/]+\/menu\/[^/]+$/;
    return regex.test(location.pathname);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="flex justify-between items-center pt-4 relative z-20 mb-5">
        {/* left section  */}
        <Link to="/">
          <h1 className="text-2xl font-bold cursor-pointer"> Nischte</h1>
        </Link>

        {/* middle section  */}
        {shouldDisplaySearchButton() && (
          <div className="hidden sm:flex rounded-md overflow-hidden max-w-md mx-auto mt-2">
            <Search
              type="text"
              placeholder="search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Right section  */}
        <div className="flex items-center space-x-3 md:space-x-6 lg:space-x-7">
          <div>
            {!isSignedIn && (
              <Button className="ghost">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </Button>
            )}
            {isLoaded ? (
              <SignedIn>
                <UserButton />
              </SignedIn>
            ) : null}
          </div>

          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <IoMdCart size={29} />
            {state.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {state.items.length}
              </span>
            )}
          </div>

          <div>
            <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
