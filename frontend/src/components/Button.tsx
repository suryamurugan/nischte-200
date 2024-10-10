interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
}
export const SearchButton = ({ onClick, text }: ButtonProps) => {
  return (
    <button onClick={onClick} className="bg-black text-white px-4 py-2">
      {text}
    </button>
  );
};
