import React, { useState, useEffect } from 'react';
import Navigation from '../Navigation';
import Sidebar from '../Sidebar';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Eye 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import { getAllCategories } from '../../api/categoryApi'; // Ensure this path is correct

const TestCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch data from Backend on component load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        // Accessing the 'data' key from your backend response
        setCategories(response.data.data); 
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. This function is called after the Modal successfully saves to DB
  const handleSaveCategory = (newCategoryObject) => {
    // Add the new object returned from the backend directly to the list
    setCategories((prev) => [...prev, newCategoryObject]);
    setIsModalOpen(false);
  };

  return (
   <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Test Categories</h1>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-[#3366FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95" 
                  onClick={() => navigate('/addTest')}
                >
                  <Plus size={20} />
                  Add Test
                </button>
                <button 
                  className="bg-[#3366FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95" 
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={20} />
                  Add Category
                </button>
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest w-24">Order</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-64">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-10 text-slate-400">Loading Categories...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-10 text-slate-400">No categories found.</td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <tr key={category._id || category.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-slate-600">
                          <div className="flex items-center gap-3">
                            <GripVertical size={16} className="text-slate-300 cursor-grab active:cursor-grabbing" />
                            <span className="font-medium">{category.order || index + 1}</span>
                          </div>
                        </td>

                        {/* Rendering category.name directly (String) */}
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {category.name}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-6">
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                              <Edit2 size={16} />
                              <span>Edit</span>
                            </button>
                            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                              <Eye size={18} />
                              <span>View tests</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <CategoryModal
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveCategory} 
        />
      </div>
    </div>
  );
};

export default TestCategories;