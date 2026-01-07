
import React, { useState, useMemo } from 'react';
import { User, Submission, SubmissionStatus } from '../types.ts';
import { verifyRestorationImage } from '../services/geminiService.ts';
// Add missing import for ICONS
import { ICONS } from '../constants.tsx';

interface FishermanDashboardProps {
  user: User;
  submissions: Submission[];
  onAddSubmission: (sub: Submission) => void;
}

const FishermanDashboard: React.FC<FishermanDashboardProps> = ({ user, submissions, onAddSubmission }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'MANGROVE' | 'SEAGRASS'>('MANGROVE');
  const [focusedSubmissionId, setFocusedSubmissionId] = useState<string | null>(null);
  const [inspectedSub, setInspectedSub] = useState<Submission | null>(null);

  const focusedSub = useMemo(() => 
    submissions.find(s => s.id === focusedSubmissionId) || submissions[0] || null, 
    [submissions, focusedSubmissionId]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Biometric Pattern Analysis...');

    const mockLocation = {
      lat: -8.4095 + (Math.random() - 0.5) * 0.05,
      lng: 115.1889 + (Math.random() - 0.5) * 0.05
    };

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Content = event.target?.result?.toString() || '';
      const base64Data = base64Content.split(',')[1];
      
      if (!base64Data) {
        setIsUploading(false);
        return;
      }

      const aiResult = await verifyRestorationImage(base64Data, selectedType, mockLocation.lat, mockLocation.lng);
      
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString(),
        location: mockLocation,
        region: Math.random() > 0.5 ? 'North Coast Basin' : 'Eastern Mangrove Delta',
        imageUrl: base64Content,
        type: selectedType,
        status: aiResult.confidence > 0.7 ? SubmissionStatus.AI_VERIFIED : SubmissionStatus.PENDING,
        aiScore: aiResult.confidence,
        aiReasoning: aiResult.reasoning,
        detectedFeatures: aiResult.detectedFeatures || [],
        environmentalContext: aiResult.environmentalContext || "Coastal",
        googleMapsUrl: aiResult.googleMapsUrl,
        creditsGenerated: selectedType === 'MANGROVE' ? 1.5 : 0.8,
        blockchainHash: Math.random().toString(36).substring(2, 15),
        auditTrail: [{
          timestamp: new Date().toISOString(),
          action: 'Submission Created',
          user: user.name,
          note: `Field data uploaded via mobile terminal.`
        }]
      };

      onAddSubmission(newSubmission);
      setIsUploading(false);
      setUploadStatus('');
      setFocusedSubmissionId(newSubmission.id);
    };
    reader.readAsDataURL(file);
  };

  const ImageWithFallback = ({ src, className, alt }: { src: string, className?: string, alt?: string }) => (
    <img 
      src={src} 
      className={className} 
      alt={alt}
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400';
      }}
    />
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-10 px-6 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em]">Live Field Monitoring</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">Member <span className="text-sky-600">Portal</span></h1>
          <p className="text-slate-500 font-light text-xl leading-relaxed max-w-2xl">
            Community-driven ecosystem verification tools. Capture site evidence to mint high-integrity Blue Carbon credits.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl items-center shadow-inner border border-slate-200">
             <button 
              onClick={() => setSelectedType('MANGROVE')}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${selectedType === 'MANGROVE' ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
             >Mangrove</button>
             <button 
              onClick={() => setSelectedType('SEAGRASS')}
              className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${selectedType === 'SEAGRASS' ? 'bg-white text-sky-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
             >Seagrass</button>
          </div>
          <label className={`relative flex items-center px-12 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-sky-600 hover:-translate-y-1 shadow-2xl shadow-slate-900/10 active:scale-95 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? (
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Evidence...</span>
              </div>
            ) : 'Upload Site Data'}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </header>

      {uploadStatus && (
        <div className="bg-sky-900 text-white p-8 rounded-[2rem] flex items-center justify-between animate-pulse shadow-2xl border border-sky-800">
           <div className="flex items-center space-x-6">
             <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🧬</div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-1">AI Verification Engine</p>
               <h4 className="text-xl font-bold tracking-tight">{uploadStatus}</h4>
             </div>
           </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 group">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[500px] flex flex-col premium-shadow transition-all hover:shadow-2xl">
            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 flex items-center text-[11px] uppercase tracking-[0.2em]">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full mr-3 animate-pulse"></span>
                Site Geolocation Layer
              </h3>
              {focusedSub && (
                <div className="text-[10px] font-mono text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-100">
                  REF: {focusedSub.location?.lat?.toFixed(6)}, {focusedSub.location?.lng?.toFixed(6)}
                </div>
              )}
            </div>
            <div className="flex-1 relative bg-slate-50">
              {submissions.length > 0 && focusedSub ? (
                <iframe 
                  key={focusedSub.id}
                  title="Project Map Overview"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0, minHeight: '400px' }}
                  src={`https://www.google.com/maps/embed/v1/view?key=${process.env.GOOGLE_MAPS_API_KEY}&center=${focusedSub.location.lat},${focusedSub.location.lng}&zoom=16&maptype=satellite`}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl">🛰️</div>
                  <p className="font-bold text-center px-12 text-sm uppercase tracking-widest opacity-40">No coordinates established. Establish a node by uploading site data.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[3rem] shadow-2xl shadow-emerald-600/20 text-white transition-all hover:-translate-y-1 hover:rotate-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12">
               <ICONS.Mangrove />
            </div>
            <div className="relative z-10 space-y-10">
              <div>
                <div className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Aggregate Impact</div>
                <div className="text-6xl font-extrabold tracking-tighter mb-2">{(submissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.creditsGenerated, 0)).toFixed(1)}</div>
                <div className="text-emerald-200 text-sm font-bold uppercase tracking-widest opacity-80">Tonnes CO2e</div>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '70%' }}></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🌱</div>
                <p className="text-[10px] text-emerald-100 font-black uppercase tracking-[0.2em] leading-relaxed">Top Tier <br/>Ecosystem Guardian</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8 premium-shadow">
             <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Active Nodes</div>
                <div className="text-3xl font-black text-slate-900">{submissions.length}</div>
             </div>
             <div className="flex justify-between items-center">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Rewards Earned</div>
                <div className="text-3xl font-black text-emerald-600">${(submissions.filter(s => s.status === SubmissionStatus.APPROVED).length * 45).toFixed(2)}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden premium-shadow">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-black text-xl text-slate-900 uppercase tracking-tight">Node History Log</h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Sync Count: {submissions.length}</div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Biometric Data</th>
                <th className="px-10 py-6">Verification Stage</th>
                <th className="px-10 py-6">AI Confidence</th>
                <th className="px-10 py-6 text-right">Protocol Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center text-slate-400 font-light text-lg">No telemetry data available. Initialize first node sync.</td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr 
                    key={s.id} 
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${focusedSubmissionId === s.id ? 'bg-sky-50/50' : ''}`}
                    onClick={() => setFocusedSubmissionId(s.id)}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <ImageWithFallback src={s.imageUrl} className="w-16 h-16 rounded-[1.5rem] object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" alt="Site" />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center text-[8px] ${s.type === 'MANGROVE' ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xs uppercase tracking-widest">{s.type} Collection</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1 opacity-60">Hash: {s.blockchainHash.slice(0, 10)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border-2 ${
                        s.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-500/10' :
                        s.status === SubmissionStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" style={{ width: `${s.aiScore * 100}%` }}></div>
                        </div>
                        <span className="text-[11px] font-black text-slate-700">{(s.aiScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedSub(s);
                        }}
                        className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-sky-600 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-500/10 transition-all active:scale-95"
                       >
                         Scientific Inspect
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FishermanDashboard;
