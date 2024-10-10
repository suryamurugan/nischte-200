import { FC } from "react";

interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}
export const SearchButton: FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="bg-black text-white px-4 py-2">
      {text}
    </button>
  );
};
