import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Search } from "./Search";
import { SearchButton } from "./Button";
import { Sidebar } from "./Sidebar";

export const Navbar: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearchFn = () => {
    console.log("search here", search);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 relative z-20">
        <h1 className="text-2xl font-bold cursor-pointer">Nischte</h1>
        <div className="flex-grow">
          <div className="flex rounded-md overflow-hidden max-w-md mx-auto mt-2">
            <Search
              type="text"
              placeholder="search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchButton onClick={handleSearchFn} text="search" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <button onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <GiHamburgerMenu size={24} />
          </button>
        </div>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};
