const CustomInput = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border-0 border-b border-black rounded-none font-poppins text-gray-600 focus:border-b focus:border-black focus:ring-0 focus:outline-none ${className}`}
    />
  );
};

export default CustomInput;
