import api from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Lock, User, Phone, Loader2, ShieldCheck, Microscope, Zap, MapPin, X, AlertCircle 
} from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  // NEW: Error Modal State
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });

  const submit = async (e) => {
    e?.preventDefault();
    
    if (!form.username || !form.password) {
      setErrorModal({ 
        show: true, 
        message: "Please enter both your username and password to continue." 
      });
      return;
    }

    setIsSubmitting(true);
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
      // Replaced alert with modal
      setErrorModal({ 
        show: true, 
        message: err.response?.data?.message || "Invalid credentials. Please try again or contact support." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Microscope className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-blue-900 tracking-tighter">ACCURATE<span className="text-teal-500">DIAGNOSTIC</span></span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Left Branding Section */}
          <div className="lg:col-span-7 relative hidden lg:block bg-blue-900">
            <img
              src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?q=80&w=870&auto=format&fit=crop"
              alt="Laboratory Equipment"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative h-full flex flex-col justify-between p-12 text-white">
              <div>
                <h2 className="text-4xl font-bold leading-tight mb-4">Advance Diagnostics <br /> For a Healthier You.</h2>
                <p className="text-blue-100 text-lg max-w-md">Login to access NABL accredited reports and manage your profile securely.</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                  <ShieldCheck className="text-teal-400 mb-2 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">100% Secure</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                  <Zap className="text-amber-400 mb-2 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">Fast Results</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
                  <Microscope className="text-blue-400 mb-2 mx-auto" />
                  <p className="text-xs font-bold uppercase tracking-wider">Precision</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Lock size={16} className="text-blue-600"/> Password
                </label>
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="animate-spin h-5 w-5" /> VERIFYING...</>
                ) : "SIGN IN"}
              </button>
            </form>
            
            <p className="text-center mt-8 text-sm text-slate-500">
              <button onClick={() => setShowForgotModal(true)} className="text-blue-600 font-bold hover:underline">
                Forget Password !
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 px-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="bg-teal-50 p-3 rounded-xl"><MapPin className="text-teal-600" /></div>
          <div>
            <h4 className="font-bold text-slate-900">Visit Us</h4>
            <p className="text-sm text-slate-500 leading-relaxed text-blue-900">Patel Nagar, Durgapuri, Naka, Faizabad, UP 224001</p>
          </div>
        </div>
        <div className="bg-blue-900 p-6 rounded-2xl shadow-xl flex items-start gap-4 text-white">
          <div className="bg-blue-50 p-3 rounded-xl"><Phone className="text-blue-600" /></div>
          <div>
            <h4 className="font-bold">Quick Support</h4>
            <p className="text-sm text-blue-100 leading-relaxed">9792292156 <br/> accuratediagnosticayodhya@gmail.com</p>
          </div>
        </div>
      </footer>

      {/* MODAL OVERLAYS */}
      
      {/* 1. Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowForgotModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <div className="text-center">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Account Access</h3>
              <p className="text-slate-600 mb-6">Password resets are handled manually by our team.</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 mb-6 font-bold text-blue-700 text-lg">Please contact Admin</div>
              <button onClick={() => setShowForgotModal(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Got it</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Error Message Modal */}
      {errorModal.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative border border-red-100">
            <button onClick={() => setErrorModal({ show: false, message: "" })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            <div className="text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Login Failed</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">{errorModal.message}</p>
              <button 
                onClick={() => setErrorModal({ show: false, message: "" })} 
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;