import React, { useState } from "react";
import { 
  MessageCircle, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  PhoneCall, 
  Send,
  ExternalLink 
} from "lucide-react";
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const Help = () => {
  const WHATSAPP_NUMBER = "7007885258"; 
  const [chatMessage, setChatMessage] = useState("");

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Encode the message for a WhatsApp URL
    const encodedMessage = encodeURIComponent(chatMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
    
    // Clear the box after sending
    setChatMessage("");
  };

  const faqs = [
    {
      q: "How can I check my report status?",
      a: "Once your samples are collected, you can view the live status in the 'Lab Reports' section of your dashboard."
    },
    {
      q: "How do I update a patient's address?",
      a: "Go to the patient profile, click the 'Edit' icon next to their name, update the details, and hit 'Save'."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto pb-20">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-slate-800 mb-4">Support Center</h1>
              <p className="text-slate-500 text-lg">Send us a message or browse the FAQs below.</p>
            </div>

            {/* NEW: Chatbot Style Support Box */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">Quick WhatsApp Chat</h2>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Online Support</p>
                </div>
              </div>

              <form onSubmit={handleChatSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    required
                    rows="3"
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Type your question or request here..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 font-bold"
                  >
                    <Send size={18} />
                    <span>Send to WhatsApp</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Clicking send will open your WhatsApp application to deliver the message.
                </p>
              </form>
            </div>

            {/* Other Support Channels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <PhoneCall size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">24/7 Helpline</h3>
                  <p className="text-indigo-600 font-bold text-sm">7007885258</p>
                </div>
              </div>
              {/* ... other channel cards ... */}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="text-indigo-500" />
                <h2 className="text-2xl font-black text-slate-800">Common Questions</h2>
              </div>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-50 pb-6 last:border-0">
                    <h4 className="text-lg font-bold text-slate-700 mb-2 flex items-start gap-2">
                      <HelpCircle size={18} className="mt-1 text-slate-400" />
                      {faq.q}
                    </h4>
                    <p className="text-slate-500 ml-7">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;