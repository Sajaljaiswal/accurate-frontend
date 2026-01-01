import { useState } from "react";

const SearchableTestSelect = ({ tests, handleAddTest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter tests based on the input text
  const filteredTests = tests.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSelect = (testId, testName) => {
    handleAddTest(testId);
    setSearchTerm(""); // Clear search after adding
    setIsOpen(false);  // Close dropdown
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-xs font-bold text-gray-500 uppercase">
        Select Test
      </label>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Type to search (e.g. MRI, Glucose, KFT)..."
        value={searchTerm}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-teal-500 outline-none bg-white"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg max-h-60 overflow-y-auto z-50">
          {filteredTests.length > 0 ? (
            filteredTests.map((t) => (
              <div
                key={t._id}
                onClick={() => onSelect(t._id, t.name)}
                className="p-3 text-sm hover:bg-teal-50 cursor-pointer border-b last:border-0 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{t.name}</span>
                <span className="text-teal-600 font-bold">₹{t.defaultPrice || 0}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 italic text-center">
              No tests found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};