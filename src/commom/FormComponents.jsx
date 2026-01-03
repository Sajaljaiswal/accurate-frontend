export const InputField = ({ label, maxLenght, type, ...props }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
    <input
      {...props}
      type={type ? type : "text"}
      maxLength={maxLenght}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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