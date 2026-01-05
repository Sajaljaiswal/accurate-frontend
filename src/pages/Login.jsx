import api from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, User, Phone, Globe, Mail, Landmark, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.username || !form.password) {
      alert("Please enter username and password");
      return;
    }
    try {
      const res = await api.post("/auth/login", form);

      // save user + token
      login(res.data);

      // ✅ redirect based on role
      if (res.data.user.role === "SUPERADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid username or password");
    }
    finally {
      setIsSubmitting(false); // 3. Stop loading regardless of success/fail
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-4 shadow-sm">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center tracking-tight">
          ACCURATE DIAGNOSTIC CENTER
        </h1>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left Side: Brand Image/Visual */}
          <div className="hidden lg:block relative h-full min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Laboratory Equipment"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px] flex items-end p-10">
              <p className="text-white text-xl font-medium leading-relaxed">
                Precision in Diagnostics. <br />
                Care in Every Result.
              </p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">User Login</h2>
              <p className="text-slate-500 mt-2">
                Access your diagnostic reports and account details.
              </p>
            </div>

            <form className="space-y-5" onSubmit={submit}>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>


              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform active:scale-[0.98] transition-all duration-150"
              >
               {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Office Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
              Registered Office
            </h3>
            <p className="text-slate-600 mb-4 italic">
              Patel Nagar, Durgapuri, Naka, Faizabad, UP 224001
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-teal-600" />
                <span className="text-sm">0522-4341100, 9792292156</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Globe className="w-4 h-4 text-teal-600" />
                <a
                  href="https://www.accuratediagnostic.com"
                  className="text-sm hover:underline"
                >
                  www.accuratediagnostic.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-4 h-4 text-teal-600" />
                <span className="text-sm">info@accuratediagnostic.com</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2 flex items-center gap-2">
              <Landmark className="w-5 h-5" /> Remittance Instructions
            </h3>
            <p className="text-xs font-bold text-red-600 mb-4 uppercase tracking-wider">
              Note: Remit Cash/Cheque only in Favor of "ACCURATE DIAGNOSTIC
              CENTER"
            </p>
            <div className="grid grid-cols-2 gap-y-2">
              <span className="text-sm font-semibold text-slate-500">
                Account No:
              </span>
              <span className="text-sm font-mono font-bold text-blue-900">
                201004379103
              </span>

              <span className="text-sm font-semibold text-slate-500">
                IFSC Code:
              </span>
              <span className="text-sm font-mono font-bold text-blue-900">
                INDB0000758
              </span>

              <span className="text-sm font-semibold text-slate-500">
                Bank Name:
              </span>
              <span className="text-sm font-bold text-blue-900">
                INDUSIND BANK
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
