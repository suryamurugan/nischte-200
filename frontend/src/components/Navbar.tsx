import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import { Search } from "./Search";
import { SearchButton } from "./Button";
import { useState } from "react";

export const Navbar = () => {
  const [search, setSearch] = useState<string>("");

  const handleSeachFn = () => {
    console.log("seacrh here", search);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold cursor-pointer">Nischte</h1>
        <div className="flex border rounded-md overflow-hidden md:mx-3">
          <Search
            type="text"
            placeholder="search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchButton onClick={handleSeachFn} text="search" />
        </div>
        <div className="flex items-center cursor-pointer">
          <div className="mt-3">
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
          <div className="mt-3">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </>
  );
};
