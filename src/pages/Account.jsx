import { Printer } from "lucide-react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllPanels } from "../api/panelApi";
import { Building, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

const Account = () => {

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

     
      <footer className="bg-blue-900 text-white text-xs py-3 text-center">
        © 2026 Accurate Diagnostic Center. All rights reserved.
      </footer>
    </div>
  );
};

export default Account;
