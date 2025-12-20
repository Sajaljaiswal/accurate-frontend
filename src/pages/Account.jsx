import { Printer } from "lucide-react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";

const Account = () => {
   const navigate = useNavigate();
  return (
    <div>
      <Navigation />

      <div className="p-6 border-t flex justify-start gap-4">
        <button
          type="button"
          onClick={() => navigate('/newPanel')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Panel
        </button>
        <button
          type="button"
          onClick={() => navigate('/newDoctor')}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Doctors
        </button>
      </div>
      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default Account;
