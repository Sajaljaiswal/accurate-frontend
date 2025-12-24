import { Printer } from "lucide-react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllPanels } from "../api/panelApi";
import { Building, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

const Account = () => {
  const navigate = useNavigate();

  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const res = await getAllPanels();
        setPanels(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);
  return (
    <div>
      <Navigation />

      <div className="p-6 border-t flex justify-start gap-4">
        <button
          type="button"
          onClick={()=>{navigate("/allPanel")}}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Panel
        </button>
        <button
          type="button"
          onClick={() => navigate("/allDoctor")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} /> All Doctors
        </button>
        <button
          type="button"
          onClick={()=>{navigate("/doctorTestList")}}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} />  Doctor Test  List
        </button>
        <button
          type="button"
          onClick={() => navigate("/doctorTestAssign")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 transition active:scale-95"
        >
          <Printer size={18} />Doctor Test Assign
        </button>
      </div>

      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default Account;
