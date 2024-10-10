interface inputProps {
  type: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export const Search = ({ type, placeholder, onChange, value }: inputProps) => {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        className=" outline-none border border-gray-300 px-2 text-md w-32 md:w-[350px]"
      />
    </>
  );
};
