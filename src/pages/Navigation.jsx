import React from 'react'
import { Database} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";


const Navigation = () => {
      const { user, logout } = useAuth(); 
      const navigate = useNavigate();

       const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
       <header className="bg-[#1e3a8a] text-white px-6 py-3 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
               ACCURATE DIAGNOSTIC CENTER, AYODHYA
            </h1>
            
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-sm font-bold transition" 
            onClick={() => navigate('/register')}>
              New Registration
            </button>
            <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-mono">
             {user?.username || "Admin"}
            </span>
            <span className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-mono" onClick={()=>{handleLogout()}}>
             {"Logout"}
            </span>
          </div>
        </header>
        <div className="bg-white border-b px-6 py-2 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-blue-900 font-bold border-b-2 border-blue-600 pb-1"
            onClick={() => navigate('/admin')}>
              <Database size={18} /> Home
            </button>
             <button className="flex items-center gap-2 text-blue-900 font-bold border-b-2 border-blue-600 pb-1">
              <Database size={18} /> Laboratory
            </button> <button className="flex items-center gap-2 text-blue-900 font-bold border-b-2 border-blue-600 pb-1" onClick={()=> navigate('/allPatient')}>
              <Database size={18} /> All Patient
            </button> <button className="flex items-center gap-2 text-blue-900 font-bold border-b-2 border-blue-600 pb-1" onClick={()=>navigate('/account')}>
              <Database size={18}  /> Accounts
            </button> <button className="flex items-center gap-2 text-blue-900 font-bold border-b-2 border-blue-600 pb-1">
              <Database size={18} /> Search
            </button>
          </div>
        </div>
    </div>
  )
}

export default Navigation
