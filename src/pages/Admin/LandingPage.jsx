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
  Cpu,
  Database,
  Dna,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    date: "",
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
              href="#process"
              className="hover:text-indigo-600 transition-colors"
            >
              Our Process
            </a>
            <a
              href="#departments"
              className="hover:text-indigo-600 transition-colors"
            >
              Departments
            </a>
          </div>
          <a
            href="tel:9792292156"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
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
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border border-indigo-100">
              <ShieldCheck size={16} /> NABL Tracked Quality Standards
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]">
              Advanced Lab <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Scientific Mastery.
              </span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              Combining world-class automation with expert clinical oversight to
              provide diagnostics you can trust for life-critical decisions.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#tests"
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2 group"
              >
                Explore All Tests{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>

          <div className="relative">
            <img
               src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Advanced Laboratory"
              className="rounded-[2.5rem] shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
        </div>
      </section>

      {/* --- THE DIAGNOSTIC PROCESS (New) --- */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black mb-4 text-slate-900">
              The Journey of a Sample
            </h2>
            <p className="text-slate-500 text-lg">
              We use a multi-layer verification process to ensure 100%
              error-free reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <MapPin />,
                title: "Barcoded Collection",
                desc: "Every sample is uniquely barcoded at source to eliminate manual mixing.",
              },
              {
                icon: <Cpu />,
                title: "Automated Analysis",
                desc: "Processed through high-end robotic analyzers for rapid, precise results.",
              },
              {
                icon: <Microscope />,
                title: "Expert Validation",
                desc: "Reports are cross-verified by senior MD Pathologists for clinical correlation.",
              },
              {
                icon: <Database />,
                title: "Digital Delivery",
                desc: "AI-integrated reports delivered instantly to your phone and email.",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-slate-50 rounded-3xl p-8 h-full border border-slate-100 hover:border-indigo-200 transition-all">
                  <div className="bg-indigo-600 text-white p-3 rounded-2xl w-fit mb-6 shadow-lg shadow-indigo-100">
                    {step.icon}
                  </div>
                  <h4 className="font-bold text-xl mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {idx !== 3 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEPARTMENTS (New) --- */}
      <section id="departments" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8">
                Specialized Clinical Departments
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Activity className="text-emerald-400" />,
                    title: "Biochemistry",
                    desc: "Hormone assays and metabolic profiling.",
                  },
                  {
                    icon: <Dna className="text-blue-400" />,
                    title: "Molecular Biology",
                    desc: "Advanced DNA/RNA testing and PCR.",
                  },
                  {
                    icon: <ShieldAlert className="text-red-400" />,
                    title: "Immunology",
                    desc: "In-depth allergy and autoimmune studies.",
                  },
                  {
                    icon: <Stethoscope className="text-purple-400" />,
                    title: "Cytology",
                    desc: "Microscopic cellular examinations.",
                  },
                ].map((dept, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
                  >
                    <div className="mb-4">{dept.icon}</div>
                    <h4 className="font-bold mb-2">{dept.title}</h4>
                    <p className="text-slate-400 text-sm">{dept.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 md:p-12">
                <h3 className="text-3xl font-bold mb-6">
                  Why Doctors Trust Us?
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <CheckCircle className="shrink-0 text-emerald-400" />
                    <p className="text-indigo-100 font-medium">
                      Inter-lab comparison programs to maintain global accuracy
                      levels.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle className="shrink-0 text-emerald-400" />
                    <p className="text-indigo-100 font-medium">
                      Daily multi-level Quality Control (QC) checks on all
                      machines.
                    </p>
                  </li>
                  <li className="flex gap-4">
                    <CheckCircle className="shrink-0 text-emerald-400" />
                    <p className="text-indigo-100 font-medium">
                      Temperature-controlled sample logistics to prevent
                      degradation.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TEST SECTION --- */}
      <section id="tests" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            Precision Health Packages
          </h2>
          <p className="text-slate-500">
            Comprehensive testing tailored for preventive and diagnostic care.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
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
              expertise with high-end automation.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/919792292156"
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
              >
                <MessageCircle />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Info</h4>
            <div className="space-y-4 text-slate-600 text-sm font-medium">
              <div className="flex gap-3">
                <MapPin size={18} className="text-indigo-600" /> Ayodhya, UP,
                224001
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="text-indigo-600" /> +91 9792292156
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3 text-slate-600 font-medium text-sm">
              <a href="#tests" className="hover:text-indigo-600">
                Health Packages
              </a>
              <a href="#process" className="hover:text-indigo-600">
                Our Technology
              </a>
              <Link to="/login" className="hover:text-indigo-600">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// const TestCard = ({ icon, title, items, price, popular }) => (
//   <div className={`group bg-white p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${popular ? "border-indigo-200 ring-4 ring-indigo-50 relative" : "border-slate-100"}`}>
//     {popular && <div className="absolute top-4 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Best Seller</div>}
//     <div className="bg-slate-50 p-4 rounded-2xl w-fit mb-6">{icon}</div>
//     <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
//     <div className="text-2xl font-black text-indigo-600 mb-6">{price}</div>
//     <ul className="space-y-3 mb-8">
//       {items.map((i) => (
//         <li key={i} className="text-sm text-slate-500 flex items-center gap-2 italic">
//           <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> {i}
//         </li>
//       ))}
//     </ul>
//     <button className="w-full py-3 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-all">Select Test</button>
//   </div>
//   );
// };

// // --- SUB-COMPONENTS ---

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
