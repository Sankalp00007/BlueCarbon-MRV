
import React, { useState, useMemo } from 'react';
import { User, Submission, SubmissionStatus } from '../types';
import { verifyRestorationImage } from '../services/geminiService';

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
    setUploadStatus('Encoding & Analyzing Site Data...');

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
          note: `Field data uploaded via mobile app.`
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Field Portal</h1>
          <p className="text-slate-500 font-light">Community Member tools for ecosystem monitoring and verification.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-200 p-1 rounded-full items-center mr-2">
             <button 
              onClick={() => setSelectedType('MANGROVE')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${selectedType === 'MANGROVE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
             >Mangrove</button>
             <button 
              onClick={() => setSelectedType('SEAGRASS')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${selectedType === 'SEAGRASS' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
             >Seagrass</button>
          </div>
          <label className={`relative flex items-center px-8 py-3 bg-sky-500 text-white rounded-full font-bold cursor-pointer transition-all hover:bg-sky-600 shadow-lg shadow-sky-500/20 active:scale-95 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {isUploading ? 'Analyzing...' : 'Upload Site Data'}
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </header>

      {uploadStatus && (
        <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl flex items-center justify-between animate-pulse shadow-sm">
           <span className="text-sky-700 font-semibold">{uploadStatus}</span>
        </div>
      )}

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col group transition-all hover:shadow-xl">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center text-sm uppercase tracking-widest">
              <span className="w-2 h-2 bg-sky-500 rounded-full mr-2 animate-pulse"></span>
              Project Impact Map
            </h3>
            {focusedSub && (
              <span className="text-[10px] font-mono text-slate-400">
                GPS: {focusedSub.location?.lat?.toFixed(6) || '0.000000'}, {focusedSub.location?.lng?.toFixed(6) || '0.000000'}
              </span>
            )}
          </div>
          <div className="flex-1 relative">
            {submissions.length > 0 && focusedSub ? (
              <iframe 
                key={focusedSub.id}
                title="Project Map Overview"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, minHeight: '350px' }}
                src={`https://www.google.com/maps/embed/v1/view?key=${process.env.GOOGLE_MAPS_API_KEY}&center=${focusedSub.location.lat},${focusedSub.location.lng}&zoom=14&maptype=satellite`}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 space-y-4">
                <p className="font-medium text-center px-8 font-light">No restoration sites uploaded. Click 'Upload Site Data' to begin mapping.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.5rem] shadow-lg shadow-emerald-500/20 text-white transition-transform hover:scale-[1.02]">
            <div className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-1">Carbon Sequestered</div>
            <div className="text-4xl font-bold mb-4">{(submissions.filter(s => s.status === SubmissionStatus.APPROVED).reduce((acc, s) => acc + s.creditsGenerated, 0)).toFixed(1)} <span className="text-lg font-normal opacity-80">tCO2e</span></div>
            <div className="h-1 bg-white/20 rounded-full mb-4">
              <div className="h-full bg-white rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-widest">Environmental Leadership Score</p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:shadow-md">
             <div className="flex justify-between items-center mb-6">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Sites</div>
                <div className="text-xl font-bold">{submissions.length}</div>
             </div>
             <div className="flex justify-between items-center">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Community Impact</div>
                <div className="text-xl font-bold text-emerald-600">${(submissions.filter(s => s.status === SubmissionStatus.APPROVED).length * 45).toFixed(2)}</div>
             </div>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900 uppercase tracking-tight">Submission History</h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total: {submissions.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-4">Site</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">AI Verification</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-light italic">No data yet. Upload your first site photo to start verifying.</td>
                </tr>
              ) : (
                submissions.map((s) => (
                  <tr 
                    key={s.id} 
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${focusedSubmissionId === s.id ? 'bg-sky-50' : ''}`}
                    onClick={() => setFocusedSubmissionId(s.id)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <ImageWithFallback src={s.imageUrl} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="Site" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs uppercase">{s.type}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate w-20">{s.blockchainHash}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                        s.status === SubmissionStatus.APPROVED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        s.status === SubmissionStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500" style={{ width: `${s.aiScore * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600">{(s.aiScore * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedSub(s);
                        }}
                        className="p-2 hover:bg-sky-100 rounded-xl text-sky-600 transition-all active:scale-90"
                       >
                         🔍 Inspect
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {inspectedSub && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="w-full md:w-1/2 bg-slate-900 relative">
              <ImageWithFallback src={inspectedSub.imageUrl} className="w-full h-full object-cover brightness-75" alt="Evidence" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-sky-400">Site Evidence Data</div>
                <h3 className="text-2xl font-bold mb-4">{inspectedSub.userName}</h3>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Latitude</p>
                    <p className="text-xs font-mono">{inspectedSub.location.lat.toFixed(6)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Longitude</p>
                    <p className="text-xs font-mono">{inspectedSub.location.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setInspectedSub(null)}
                className="absolute top-6 left-6 w-10 h-10 bg-black/50 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                ✕
              </button>
            </div>

            <div className="w-full md:w-1/2 p-8 lg:p-12 overflow-y-auto bg-white custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">Audit Report</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{inspectedSub.type} • {inspectedSub.region}</p>
                </div>
                <div className="text-right">
                  <div className="text-[32px] font-black text-sky-600 leading-none">{(inspectedSub.aiScore * 100).toFixed(0)}%</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Confidence</div>
                </div>
              </div>

              <div className="space-y-8">
                <section className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Reasoning</h4>
                  <p className="text-sm text-slate-600 font-light leading-relaxed italic bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                    "{inspectedSub.aiReasoning}"
                  </p>
                </section>

                <section className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detected Ecosystem Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {inspectedSub.detectedFeatures.map((feat, i) => (
                      <span key={i} className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-100">
                        {feat}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Metadata</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs py-2 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">BLOCK HASH</span>
                      <span className="font-mono text-slate-900">{inspectedSub.blockchainHash}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">VINTAGE</span>
                      <span className="text-slate-900 font-bold">{new Date(inspectedSub.timestamp).getFullYear()}</span>
                    </div>
                    <div className="flex justify-between text-xs py-2">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">STATUS</span>
                      <span className="text-emerald-600 font-black uppercase tracking-widest">{inspectedSub.status}</span>
                    </div>
                  </div>
                </section>
                
                <button 
                  onClick={() => setInspectedSub(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default FishermanDashboard;
