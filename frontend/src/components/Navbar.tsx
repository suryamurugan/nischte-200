import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCart } from "react-icons/io";
import { Button } from "./ui/button";
import { Search } from "./Search";
import { Sidebar } from "./Sidebar";

import { useUser } from "@clerk/clerk-react";

export const Navbar: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { isSignedIn, isLoaded } = useUser();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 relative z-20">
        {/* left section  */}

        <Link to="/">
          <h1 className="text-2xl font-bold cursor-pointer"> Nischte</h1>
        </Link>

        {/* middle section  */}

        <div className="flex rounded-md overflow-hidden max-w-md mx-auto mt-2">
          <Search
            type="text"
            placeholder="search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

          <div>
            <IoMdCart size={29} />
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
