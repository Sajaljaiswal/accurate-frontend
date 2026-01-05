export const InputField = ({ label, maxLength, type, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      type={type ? type : "text"}
      maxLength={maxLength}
    />
  </div>
);

export const SelectField = ({ label, options = [], placeholder = "-- Select --", ...props }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <select {...props} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white">
      <option value="">{placeholder}</option>
      {options.map((opt, i) => (
        <option key={opt.value || i} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);


export const PhoneInput = ({
  label = "Mobile No.",
  value = "",
  onChange,
  placeholder = "Enter mobile number",
  maxLength = 10,
  required = false,
  disabled = false,
}) => {
  const handleChange = (e) => {
    let input = e.target.value;

    // Remove non-numeric characters
    input = input.replace(/\D/g, "");

    // Enforce max length
    if (input.length > maxLength) {
      input = input.slice(0, maxLength);
    }

    onChange(input);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          {label}
        </label>
      )}

      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

