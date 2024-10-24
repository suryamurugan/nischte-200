import React, { useState, useRef, useEffect } from "react";
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
import { useUser } from "@clerk/clerk-react";
import { useCart } from "@/context/CartContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const userId = user?.id;

  const { state } = useCart();

  const [search, setSearch] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
    <div className="sticky top-0 z-50 bg-white ">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center pt-4 relative z-20 mb-5">
          {/* left section  */}
          <Link to="/">
            <h1 className="text-2xl font-bold `cursor-pointer">Nischte</h1>
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

            {/* Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                aria-label="Toggle Menu"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <GiHamburgerMenu size={24} />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 transform origin-top-right transition-all duration-200 ${
                  isDropdownOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  to="/shops"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Shops
                </Link>
                <Link
                  to={`/${userId}/order`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/about-us"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  About us
                </Link>
                <Link
                  to="/contact-us"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Contact us
                </Link>

                {/* Owner */}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-900">
                    Owners
                  </div>
                  <Link
                    to="/shop/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Register shop
                  </Link>
                  <Link
                    to="/shop/manage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Manage shops
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
