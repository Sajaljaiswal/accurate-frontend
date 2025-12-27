import Navigation from "../Navigation";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllTests } from "../../api/testApi";
import Sidebar from "../Sidebar";

const AllTest = () => {
  // const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  console.log(tests, "???????????????????");
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
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-700">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Navigation />

        {/* TEST LIST */}
        <div className="p-6">
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
      <td colSpan="6" className="p-6 text-center">Loading tests...</td>
    </tr>
  ) : tests.length === 0 ? (
    <tr>
      <td colSpan="6" className="p-6 text-center text-gray-500">No tests found</td>
    </tr>
  ) : (
    tests.map((test) => (
      <tr key={test._id} className="border-b hover:bg-gray-50">
        {/* FIX 1: Access the name property instead of the whole object */}
        <td className="p-3 font-semibold text-blue-900">{test.name}</td>

        {/* FIX 2: Access the category name (using optional chaining for safety) */}
        <td className="p-3 text-center text-slate-600">
          {test.category?.name || "Uncategorized"}
        </td>

        <td className="p-3 text-center">{test.sampleType}</td>

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

        <td className="p-3 text-center text-xs text-slate-400">
          {new Date(test.createdAt).toLocaleString("en-IN", {
             day: '2-digit', month: 'short', year: 'numeric'
          })}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTest;
