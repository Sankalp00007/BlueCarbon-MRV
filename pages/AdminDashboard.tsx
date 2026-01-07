import React, { useState, useMemo } from 'react';
import { Submission, CreditRecord, SubmissionStatus, User, UserRole, AuditLog } from '../types.ts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  submissions: Submission[];
  credits: CreditRecord[];
  users: User[];
  onUpdateStatus?: (id: string, updates: Partial<Submission>) => void;
  onUpdateUser?: (userId: string, updates: Partial<User>) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ submissions, credits, users, onUpdateStatus, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'confirmation' | 'governance' | 'risk' | 'users'>('overview');
  const [isRegistryPaused, setIsRegistryPaused] = useState(false);
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [showAccessLogs, setShowAccessLogs] = useState(false);
  
  const totalCredits = credits.reduce((acc, c) => acc + c.amount, 0);
  const soldCredits = credits.filter(c => c.status === 'SOLD').length;
  
  // Confirmation Queue: NGO Approved but not yet final
  const confirmationQueue = useMemo(() => 
    submissions.filter(s => s.status === SubmissionStatus.NGO_APPROVED),
    [submissions]
  );

  // Advanced Metrics
  const aiAgreementRate = useMemo(() => {
    const verified = submissions.filter(s => s.status === SubmissionStatus.APPROVED || s.status === SubmissionStatus.REJECTED);
    if (verified.length === 0) return 100;
    const matched = verified.filter(s => {
       const aiPassed = s.aiScore > 0.7;
       const humanPassed = s.status === SubmissionStatus.APPROVED;
       return aiPassed === humanPassed;
    });
    return (matched.length / verified.length) * 100;
  }, [submissions]);

  // Mock security events for the Audit Access Logs
  const securityEvents = useMemo(() => [
    { id: 'ev-1', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Admin-01', action: 'KYC_OVERRIDE', target: 'u12', severity: 'Low' },
    { id: 'ev-2', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'System', action: 'REGISTRY_SYNC_COMPLETE', target: 'Global', severity: 'Info' },
    { id: 'ev-3', timestamp: new Date(Date.now() - 86400000).toISOString(), user: 'Admin-02', action: 'ACCOUNT_FREEZE', target: 'u45', severity: 'High' },
    { id: 'ev-4', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'NGO-Verifier', action: 'BULK_VERIFICATION', target: 'sub-group-A', severity: 'Medium' },
    { id: 'ev-5', timestamp: new Date(Date.now() - 259200000).toISOString(), user: 'System', action: 'THREAT_SCAN_COMPLETED', target: 'Site-E', severity: 'Low' },
  ], []);

  const riskData = useMemo(() => {
    return [
      { name: 'Duplicate GPS', count: submissions.filter(s => s.aiReasoning.toLowerCase().includes('duplicate')).length || 1, severity: 'High' },
      { name: 'Pixel Mismatch', count: 3, severity: 'Critical' },
      { name: 'Low Confidence', count: submissions.filter(s => s.aiScore < 0.3).length, severity: 'Medium' },
      { name: 'Override Rate', count: submissions.filter(s => s.aiOverridden).length, severity: 'Low' },
    ];
  }, [submissions]);

  const chartData = [
    { name: 'Jan', credits: 400 },
    { name: 'Feb', credits: 300 },
    { name: 'Mar', credits: 500 },
    { name: 'Apr', credits: 700 },
    { name: 'May', credits: 900 },
    { name: 'Jun', credits: Math.max(totalCredits, 1200) },
  ];

  const handleConfirmIssuance = async (id: string) => {
    if (!onUpdateStatus || isRegistryPaused) return;
    setIsConfirming(id);
    try {
      const sub = submissions.find(s => s.id === id);
      if (!sub) return;

      const newLog: AuditLog = {
        timestamp: new Date().toISOString(),
        action: 'Final Admin Confirmation',
        user: 'Registry Admin',
        note: 'Verified NGO scientific audit. Minting credits to blockchain ledger.'
      };

      await onUpdateStatus(id, {
        status: SubmissionStatus.APPROVED,
        auditTrail: [...sub.auditTrail, newLog]
      });
    } catch (e) {
      console.error("Confirmation failed:", e);
    } finally {
      setIsConfirming(null);
    }
  };

  const handleUserStatusToggle = (userId: string, currentStatus: string) => {
    if (!onUpdateUser) return;
    const nextStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    onUpdateUser(userId, { status: nextStatus as any });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-2 md:px-0">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-6 md:p-8 rounded-[2.5rem] text-white">
        <div className="flex items-center space-x-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-sky-500 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-sky-500/20">🏛️</div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white uppercase leading-none">Governance</h1>
            <p className="text-slate-400 text-[8px] md:text-[10px] font-black tracking-widest uppercase opacity-70 mt-1">Registry Oversight • v4.2.0-Live</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <div className={`w-2 h-2 rounded-full ${isRegistryPaused ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{isRegistryPaused ? 'Registry Frozen' : 'System Secure'}</span>
          </div>
          <button 
            onClick={() => setIsRegistryPaused(!isRegistryPaused)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isRegistryPaused ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-red-500 hover:bg-red-600'} text-white shadow-lg`}
          >
            {isRegistryPaused ? 'Resume Network' : 'Emergency Shutdown'}
          </button>
        </div>
      </header>

      {/* Primary Navigation Tabs */}
      <nav className="flex space-x-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Registry Health', icon: '📊' },
          { id: 'confirmation', label: 'Issuance Queue', icon: '✅', count: confirmationQueue.length },
          { id: 'risk', label: 'Risk Monitor', icon: '🛡️' },
          { id: 'users', label: 'Entities', icon: '👥' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full ml-1 font-bold">{tab.count}</span>
            )}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-600 rounded-full"></div>}
          </button>
        ))}
      </nav>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Carbon</div>
                  <div className="text-2xl md:text-3xl font-black text-slate-900">{totalCredits.toFixed(1)} <span className="text-xs font-normal text-slate-400">tCO2e</span></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Market Liquidity</div>
                  <div className="text-2xl md:text-3xl font-black text-sky-600">{((soldCredits / (credits.length || 1)) * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">AI Agreement</div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-600">{aiAgreementRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Issuance Velocity Monitoring</h3>
                  <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">Live Mainnet</div>
                </div>
                <div className="h-[300px] md:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="credits" stroke="#0ea5e9" fillOpacity={1} fill="url(#areaGrad)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'confirmation' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black uppercase text-slate-900">Issuance Queue</h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Authorization required before settlement</p>
                </div>
                {isRegistryPaused && <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border border-red-100">LOCKED</div>}
              </div>
              <div className="divide-y divide-slate-100">
                {confirmationQueue.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 uppercase text-[10px] font-black">Registry Synced</div>
                ) : (
                  confirmationQueue.map(s => (
                    <div key={s.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center space-x-6 w-full md:w-auto">
                        <img src={s.imageUrl} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                        <div>
                          <p className="text-[10px] font-black text-sky-600 uppercase mb-1">{s.type} • {s.region}</p>
                          <h4 className="text-lg font-black text-slate-900">{s.userName}</h4>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Peer Reviewed</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                           <p className="text-xl font-black text-slate-900">{s.creditsGenerated.toFixed(1)} tCO2e</p>
                        </div>
                        <button 
                          onClick={() => handleConfirmIssuance(s.id)}
                          disabled={isConfirming === s.id || isRegistryPaused}
                          className={`px-8 py-2.5 text-white rounded-xl text-[10px] font-black uppercase shadow-lg transition-all ${isRegistryPaused ? 'bg-slate-200 cursor-not-allowed shadow-none' : 'bg-sky-600 hover:bg-sky-700 active:scale-95'}`}
                        >
                          {isConfirming === s.id ? 'Minting...' : 'Authorize'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {riskData.map((risk, i) => (
                   <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                          risk.severity === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                          risk.severity === 'High' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-sky-50 text-sky-600 border-sky-100'
                        }`}>
                          {risk.severity}
                        </div>
                        <span className="text-lg font-black text-slate-900">{risk.count}</span>
                      </div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{risk.name}</h4>
                   </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8">
                 <h3 className="text-sm font-black uppercase mb-6">Threat Intelligence Feed</h3>
                 <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                       <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">🛰️</div>
                       <div>
                          <p className="text-[10px] font-black text-red-600 uppercase mb-1">Geospatial Anomaly</p>
                          <p className="text-[11px] text-red-900/70 font-bold leading-relaxed">Submission #SUB-4921 shares identical GPS with an approved site in 'East Basin'. Possible double-counting attempt.</p>
                       </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">🤖</div>
                       <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Low Confidence AI Scans</p>
                          <p className="text-[11px] text-slate-500 font-bold leading-relaxed">System noted 45% AI confidence on a pixel-distorted image. Visual audit suggested for Community Member 'Alfonso Silva'.</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-lg font-black uppercase text-slate-900">Entity Management</h3>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4">Identity</th>
                      <th className="px-8 py-4">Role / Status</th>
                      <th className="px-8 py-4">Trust Score</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-black text-slate-900 text-xs uppercase">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono italic">{u.email}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black w-fit uppercase bg-slate-100 text-slate-600">{u.role}</span>
                            <span className={`text-[8px] font-black uppercase ${u.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>● {u.status || 'ACTIVE'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center space-x-3">
                              <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full bg-sky-500`} style={{ width: `${u.trustScore || 0}%` }} />
                              </div>
                              <span className="text-[10px] font-black text-slate-700">{u.trustScore || 0}%</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => handleUserStatusToggle(u.id, u.status || 'ACTIVE')}
                            className={`p-2 rounded-lg transition-colors ${u.status === 'FROZEN' ? 'text-emerald-500' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                          >
                            {u.status === 'FROZEN' ? '🔓' : '❄️'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Security Module */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Infrastructure</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-sky-50">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Active Members</p>
                  <p className="text-xl font-black text-slate-900">{users.filter(u => u.role === UserRole.FISHERMAN).length}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-sky-50">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Sync Latency</p>
                  <p className="text-xl font-black text-slate-900">0.8s</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
            <h3 className="text-sm font-black uppercase mb-4">Security Protocol</h3>
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed mb-6 uppercase tracking-tight">
              Registry actions are cryptographically signed and stored on the immutable audit ledger.
            </p>
            <div className="space-y-3">
               <button 
                  onClick={() => setShowAccessLogs(true)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Audit Access Logs
                </button>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black uppercase text-slate-500">Threat Level</span>
                      <span className="text-[8px] font-black uppercase text-emerald-400">Nominal</span>
                   </div>
                   <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-1/5 shadow-[0_0_8px_#10b981]"></div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACCESS LOGS OVERLAY */}
      {showAccessLogs && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Security Ledger</h2>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Immutable Administrative History</p>
                 </div>
                 <button onClick={() => setShowAccessLogs(false)} className="text-slate-400 hover:text-red-500 font-bold p-2">✕</button>
              </header>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                 {securityEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-50 hover:bg-sky-50/30 transition-all">
                       <div className="shrink-0 font-mono text-[9px] text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          {new Date(ev.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-black text-slate-900 uppercase">{ev.action}</span>
                             <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${ev.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'}`}>{ev.severity}</span>
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">By: {ev.user}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;