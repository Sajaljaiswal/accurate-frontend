import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Save, ArrowUpCircle } from 'lucide-react';
import Navigation from "../Navigation";
import Sidebar from "../Sidebar";

const DocumentEntry = () => {
  const [reportData, setReportData] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-y-auto">
          
          {/* 1. Patient Info Header */}
          <div className="bg-[#e8f0fe] border border-blue-200 rounded-t-md p-2 flex flex-wrap gap-4 text-[13px] font-bold text-red-800 mb-1">
            <div className="flex gap-1">Reg. No.: <span className="text-black">158041</span></div>
            <div className="flex gap-1">LAB No.: <span className="text-black">0062601010019</span></div>
            <div className="flex gap-1">Name: <span className="text-blue-900 uppercase">Mrs. Anjali Singh</span></div>
            <div className="flex gap-1">Age: <span className="text-black">23 Y 0 M 0 D</span></div>
            <div className="flex gap-1">Panel: <span className="text-red-800">DR PREETI PANDEY</span></div>
          </div>

          {/* 2. Sub-Navigation Tabs */}
          <div className="flex gap-1 bg-[#d0e0f8] p-1 border border-blue-200 mb-2">
            <button className="bg-white px-4 py-1 text-xs font-bold border border-blue-300 shadow-sm hover:bg-blue-50">Result Entry</button>
            <button className="bg-[#e8f0fe] px-4 py-1 text-xs font-bold border border-blue-200 hover:bg-white">View Result</button>
            <button className="bg-[#e8f0fe] px-4 py-1 text-xs font-bold border border-blue-200 hover:bg-white">Result Summary</button>
            <div className="flex-1 flex justify-center"><ArrowUpCircle size={20} className="text-green-600 cursor-pointer" /></div>
          </div>

          {/* 3. Investigation Selection */}
          <div className="bg-white border border-slate-300 p-4 rounded-b-md shadow-sm mb-4">
            <div className="flex items-center gap-4 mb-4 border-b pb-4">
               <div className="bg-blue-600 text-white px-3 py-1 text-xs font-black rounded italic">USG FOR OBS</div>
               <div className="flex items-center gap-2 text-xs font-bold">
                 <span>Template:</span>
                 <select className="border border-slate-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500">
                   <option>Obstetric Ultrasonography (Single Fetus)</option>
                   <option>Upper Abdomen</option>
                 </select>
               </div>
               <input type="file" className="text-xs font-medium" />
            </div>

            {/* 4. Rich Text Editor (Report Area) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden ck-editor-custom">
              <CKEditor
                editor={ClassicEditor}
                data="<h2>OBSTETRIC ULTRASONOGRAPHY REPORT</h2><p>LMP: ---? | E.D.D: 27.03.2026</p><p>Single intra-uterine live fetus seen in breech presentation.</p>"
                onChange={(event, editor) => setReportData(editor.getData())}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button className="bg-slate-500 text-white px-6 py-2 rounded text-sm font-bold hover:bg-slate-600 transition-all">Cancel</button>
              <button className="bg-blue-700 text-white px-8 py-2 rounded text-sm font-bold hover:bg-blue-800 transition-all flex items-center gap-2">
                <Save size={16} /> Save & Approve
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentEntry;