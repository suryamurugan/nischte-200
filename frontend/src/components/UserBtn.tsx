import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { FC } from "react";

export const UserBtn: FC = () => {
  return (
    <>
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
    </>
  );
};
