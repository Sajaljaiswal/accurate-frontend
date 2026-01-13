import React, { useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  FlaskConical,
  Home,
  Star,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Users,
  Send,
  Calendar,
  User,
  Microscope,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    date: ""
  });
  const [formStatus, setFormStatus] = useState(null);
const [loading, setLoading] = useState(false);
  // 3. Handle Form Submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/home-collections", formData);
      setFormStatus("Request submitted successfully! ✅");
      
      // Clear form
      setFormData({ fullName: "", phone: "", address: "", date: "" });
      
      
      // Clear status message after 3 seconds
      setTimeout(() => setFormStatus(""), 3000);
    } catch (err) {
      setFormStatus("Failed to submit request. ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-white scroll-smooth">
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <span className="font-black text-xl tracking-tight text-indigo-950">
              ACCURATE
              <span className="text-indigo-500 text-sm font-medium ml-1">
                DIAGNOSTICS
              </span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-slate-600">
            <a
              href="#tests"
              className="hover:text-indigo-600 transition-colors"
            >
              Tests
            </a>
            <a
              href="#home-collection"
              className="hover:text-indigo-600 transition-colors"
            >
              Home Collection
            </a>
            <a
              href="#testimonials"
              className="hover:text-indigo-600 transition-colors"
            >
              Reviews
            </a>
          </div>
          <a
            href="tel:9792292156"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <Phone size={18} />{" "}
            <span className="hidden sm:inline">9792292156</span>
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border border-indigo-100">
              <ShieldCheck size={16} /> NABL Tracked Quality Standards
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Precision That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Empowers Health.
              </span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              Get clinical grade diagnostic reports within hours. Experience the
              future of pathology with AI-enhanced accuracy and doorstep
              convenience.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#home-collection"
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 group"
              >
                Book Home Sample{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                  >
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  </div>
                ))}
                <div className="pl-6 text-sm font-medium">
                  <div className="flex text-yellow-400">
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-slate-500">10k+ Happy Patients</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-blue-100 rounded-[3rem] -z-10 rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Lab Technicians"
              className="rounded-[2.5rem] shadow-2xl object-cover h-[500px] w-full"
            />
            <div className="absolute bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl max-w-[240px] border border-slate-100 animate-bounce-slow">
              <div className="flex gap-4 items-center">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Turnaround
                  </p>
                  <p className="font-bold text-slate-900">Same Day Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8">
          {[
            ["500+", "Tests Available"],
            ["1hr", "Fastest Collection"],
            ["99.9%", "Accuracy Rate"],
            ["24/7", "Digital Reports"],
          ].map(([stat, label]) => (
            <div
              key={label}
              className="flex flex-col items-center flex-1 min-w-[150px]"
            >
              <span className="text-4xl font-black">{stat}</span>
              <span className="text-indigo-100 text-sm font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* --- TEST SECTION --- */}
      <section id="tests" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black mb-4">
                Popular Health Packages
              </h2>
              <p className="text-slate-500">
                Scientifically designed profiles for your complete well-being.
              </p>
            </div>
            <button className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Tests <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestCard
              icon={<Microscope className="text-indigo-600" />}
              title="Full Body Checkup"
              price="₹1,999"
              items={[
                "84 Parameters",
                "Complete Hemogram",
                "Liver & Kidney Profile",
                "Lipid Profile",
              ]}
              popular={true}
            />
            <TestCard
              icon={<Activity className="text-blue-600" />}
              title="Diabetes Care"
              price="₹799"
              items={[
                "HbA1c",
                "Average Blood Glucose",
                "Urinary Albumin",
                "Creatinine",
              ]}
            />
            <TestCard
              icon={<FlaskConical className="text-purple-600" />}
              title="Vital Vitamin"
              price="₹1,299"
              items={["Vitamin D", "Vitamin B12", "Calcium", "Iron Studies"]}
            />
          </div>
        </div>
      </section>

      {/* --- HOME COLLECTION FORM SECTION --- */}
      <section id="home-collection" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">
              Skip the Queue. <br />
              <span className="text-indigo-600">We'll Come to You.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8">
              Our certified phlebotomists follow 100% sterile protocols to
              collect samples from your home or office.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Smart Scheduling",
                  desc: "Choose your preferred time slot between 7AM to 8PM.",
                },
                {
                  title: "Hygienic Process",
                  desc: "Single-use barcoded vacuum tubes and sterile kits.",
                },
                {
                  title: "E-Reports",
                  desc: "Receive reports on WhatsApp and Email automatically.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="bg-white shadow-md border border-slate-100 p-3 rounded-xl h-fit text-indigo-600">
                    <CheckCircle />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-8 border border-slate-100 relative">
            <div className="absolute -top-6 right-8 bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              Flash Service: 60 min
            </div>
            <h3 className="text-2xl font-black mb-6">
              Request Home Collection
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      required
                      value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      placeholder="98765 43210"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="Flat, Street, Landmark"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="date"
                    value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>
             <button 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} Submit Request
        </button>
              {formStatus && (
                <p className="text-emerald-600 font-bold text-center mt-4 animate-pulse">
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section
        id="testimonials"
        className="py-24 bg-slate-900 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black mb-4">Loved by our Patients</h2>
            <p className="text-slate-400 italic">
              "The quality of a lab is seen in the clarity of its reports."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Rahul Sharma"
              text="The home collection was seamless. The phlebotomist was very professional and I got my report on WhatsApp by evening."
            />
            <TestimonialCard
              name="Dr. Anita Desai"
              text="As a physician, I trust Accurate Diagnostics for my patients because their biochemistry results match clinical correlations perfectly."
              role="MD (Internal Medicine)"
            />
            <TestimonialCard
              name="Priya Singh"
              text="Excellent service! The price for the Full Body Checkup is much lower than other big labs without compromising on quality."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Activity size={24} />
              </div>
              <span className="font-black text-2xl tracking-tight text-indigo-950">
                ACCURATE
              </span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              Leading the way in diagnostic excellence. We combine human
              expertise with high-end automation to provide accurate health
              insights.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/919792292156"
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
              >
                <MessageCircle />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
              >
                <Users size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Info</h4>
            <div className="space-y-4 text-slate-600 text-sm">
              <div className="flex gap-3 items-start font-medium">
                <MapPin className="text-indigo-600 shrink-0" size={18} />{" "}
                Ayodhya, Uttar Pradesh, 224001
              </div>
              <div className="flex gap-3 items-center font-medium">
                <Phone className="text-indigo-600 shrink-0" size={18} /> +91
                9792292156
              </div>
              <div className="flex gap-3 items-center font-medium">
                <Clock className="text-indigo-600 shrink-0" size={18} /> 7:00 AM
                - 8:00 PM
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3 text-slate-600 font-medium text-sm">
              <a href="#tests" className="hover:text-indigo-600">
                Health Packages
              </a>
              <a href="#home-collection" className="hover:text-indigo-600">
                Book Collection
              </a>
              <a href="#" className="hover:text-indigo-600">
                Download Reports
              </a>
              <Link to="/login" className="hover:text-indigo-600">
                Admin
              </Link>
              <a href="#" className="hover:text-indigo-600">
                About Our Lab
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-50 text-center text-slate-400 text-sm font-medium">
          © 2024 Accurate Diagnostic Center. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TestCard = ({ icon, title, items, price, popular }) => (
  <div
    className={`group bg-white p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100 ${
      popular
        ? "border-indigo-200 ring-4 ring-indigo-50 relative"
        : "border-slate-100"
    }`}
  >
    {popular && (
      <div className="absolute top-4 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
        Best Seller
      </div>
    )}
    <div className="bg-slate-50 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <div className="text-2xl font-black text-indigo-600 mb-6">{price}</div>
    <ul className="space-y-3 mb-8">
      {items.map((i) => (
        <li
          key={i}
          className="text-sm text-slate-500 flex items-center gap-2 italic"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> {i}
        </li>
      ))}
    </ul>
    <button className="w-full py-3 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all">
      Select Test
    </button>
  </div>
);

const TestimonialCard = ({ name, text, role = "Patient" }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-700 hover:border-indigo-500 transition-colors">
    <div className="flex text-yellow-400 mb-6">
      <Star size={16} fill="currentColor" />{" "}
      <Star size={16} fill="currentColor" />{" "}
      <Star size={16} fill="currentColor" />{" "}
      <Star size={16} fill="currentColor" />{" "}
      <Star size={16} fill="currentColor" />
    </div>
    <p className="text-slate-300 mb-8 leading-relaxed italic">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white">
        {name[0]}
      </div>
      <div>
        <h4 className="font-bold">{name}</h4>
        <p className="text-xs text-indigo-400 font-medium">{role}</p>
      </div>
    </div>
  </div>
);

export default LandingPage;
