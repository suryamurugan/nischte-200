import { FC } from "react";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
  return (
    <>
      <div className="border border-gray-100 my-9"></div>
      <div className="bg-black h-24">
        <Link to="/">
          <h1 className="pt-5 pl-5 text-xl font-bold cursor-pointer text-white">
            Nischte
          </h1>
          <p className="pl-5 text-white"> &#169; CIA Labs</p>
        </Link>
      </div>
    </>
  );
};
