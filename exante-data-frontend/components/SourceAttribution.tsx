export const SourceAttrubution = ({
  label,
  link,
  setLink,
  setLabel,
}: {
  label: string;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter your source label here..."
      />
      <input
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="appearance-none border rounded w-full py-3 px-4 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter your source link..."
      />
    </>
  );
};
