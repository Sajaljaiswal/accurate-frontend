import api from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Lock, User, Phone, Loader2, ShieldCheck, Microscope, Zap, MapPin 
} from "lucide-react";

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
    // setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      if (res.data.user.role === "SUPERADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/"); 
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Dynamic Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Microscope className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-blue-900 tracking-tighter">ACCURATE<span className="text-teal-500">DIAGNOSTIC</span></span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-bold text-slate-600">
          <a href="/landingPage" className="hover:text-blue-600 transition">Home</a>
          <a href="#" className="hover:text-blue-600 transition">Test Menu</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          
          <div className="lg:col-span-7 relative hidden lg:block bg-blue-900">
            <img
              src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Laboratory Equipment"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative h-full flex flex-col justify-between p-12 text-white">
              <div>
                <h2 className="text-4xl font-bold leading-tight mb-4">
                  Advance Diagnostics <br /> For a Healthier You.
                </h2>
                <p className="text-blue-100 text-lg max-w-md">
                  Login to access NABL accredited reports, track history, and manage your health profile securely.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <ShieldCheck className="text-teal-400 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">100% Secure</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <Zap className="text-amber-400 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Fast Results</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <Microscope className="text-blue-400 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Precision</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 mt-2 font-medium">Please enter your credentials to login.</p>
            </div>

            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-blue-600"/> Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. johndoe_01"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Lock size={16} className="text-blue-600"/> Password
                  </label>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin" /> VERIFYING...</>
                ) : "SIGN IN"}
              </button>
            </form>
            <p className="text-center mt-8 text-sm text-slate-500">
              New patient? <a href="#" className="text-blue-600 font-bold hover:underline">Create an account</a>
            </p>
          </div>
        </div>
      </main>
      <footer className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 px-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-teal-50 p-3 rounded-xl"><MapPin className="text-teal-600" /></div>
          <div>
            <h4 className="font-bold text-slate-900">Visit Us</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Patel Nagar, Durgapuri, Naka, Faizabad, UP 224001</p>
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-2xl hadow-xl flex items-start gap-4 text-white">
          <div className="bg-blue-50 p-3 rounded-xl"><Phone className="text-blue-600" /></div>
          <div>
            <h4 className="font-bold text-white text-slate-900">Quick Support</h4>
            <p className="text-sm text-slate-500 text-white leading-relaxed"> 9792292156 <br/> accuratediagnosticayodhya@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;