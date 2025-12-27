import { Printer } from "lucide-react";
import Navigation from "../Navigation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTests } from "../../api/testApi";

const AllTest = () => {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await getAllTests();
        setTests(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div>
      <Navigation />

      {/* Action Buttons */}
      <div className="p-6 border-t flex gap-4">
        <button
          onClick={() => navigate("/addTest")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
        >
          <Printer size={18} /> Add Test
        </button>
      </div>

      {/* TEST LIST */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Diagnostic Test List
        </h1>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3 text-left">Test Name</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Sample Type</th>
                <th className="p-3 text-center">Price (₹)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Created</th>
              </tr>
            </thead>

            <tbody>
              {loadingTests ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading tests...
                  </td>
                </tr>
              ) : tests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No tests found
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr
                    key={test._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3 font-semibold">
                      {test.name}
                    </td>

                    <td className="p-3 text-center">
                      {test.category}
                    </td>

                    <td className="p-3 text-center">
                      {test.sampleType}
                    </td>

                    <td className="p-3 text-center font-bold">
                      ₹{test.defaultPrice}
                    </td>

                    <td className="p-3 text-center">
                      {test.isActive ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-bold">
                          INACTIVE
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center text-xs">
                      {new Date(test.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default AllTest;
