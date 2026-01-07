import React, { useState } from 'react';
import { User, CreditRecord } from '../types.ts';
import { ICONS } from '../constants.tsx';

interface CorporateDashboardProps {
  user: User;
  credits: CreditRecord[];
  onPurchase: (id: string) => void;
}

const CorporateDashboard: React.FC<CorporateDashboardProps> = ({ user, credits, onPurchase }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const availableCredits = credits.filter(c => c.status === 'AVAILABLE');
  const myCredits = credits.filter(c => c.ownerId === user.id);
  const totalTons = myCredits.reduce((acc, c) => acc + c.amount, 0);

  const handleBuy = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      onPurchase(id);
      setIsProcessing(null);
    }, 1500);
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto py-10 px-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span className="text-[10px] font-black text-sky-700 uppercase tracking-[0.2em]">Institutional Access</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">Capital <span className="text-sky-600">Marketplace</span></h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed">
            Acquire verified Blue Carbon assets. Every credit is cryptographically backed by on-site ecological field data.
          </p>
        </div>
        
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group min-w-[350px]">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <ICONS.Credit />
          </div>
          <div className="relative z-10 space-y-6">
            <div>
              <div className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-2">Portfolio Offset</div>
              <div className="text-5xl font-bold flex items-baseline">
                {totalTons.toFixed(1)} <span className="ml-2 text-xl font-normal opacity-40">tCO2e</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Compliance Status</div>
                <div className="text-sm font-bold">Verified Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center">
            <span className="w-10 h-1 h-1 bg-sky-600 rounded-full mr-4"></span>
            Available Assets
          </h2>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Listings: {availableCredits.length}</div>
        </div>
        
        {availableCredits.length === 0 ? (
          <div className="bg-white p-24 text-center rounded-[3rem] border border-slate-100 shadow-sm premium-shadow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-8 animate-pulse">🌿</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Inventory Syncing</h3>
            <p className="text-slate-500 font-light text-lg">New verification dossiers are currently being audited by scientific nodes.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {availableCredits.map((credit) => (
              <div key={credit.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col premium-shadow">
                <div className="h-2 bg-gradient-to-r from-sky-500 to-emerald-500"></div>
                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-sky-600 uppercase tracking-[0.3em]">Asset Class</div>
                      <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">Verified Blue Carbon</h4>
                    </div>
                    <div className="bg-slate-50 text-slate-400 font-mono px-3 py-1.5 rounded-xl text-[10px] border border-slate-100">
                      ID-{credit.id.split('-')[1].substring(0, 4)}
                    </div>
                  </div>
                  
                  <div className="space-y-5 flex-1">
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Volume</span>
                      <span className="font-black text-slate-900 text-lg">{credit.amount} tCO2e</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Vintage</span>
                      <span className="font-black text-slate-900">{credit.vintage} Collection</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Type</span>
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="font-black text-slate-900 text-[11px] uppercase">Coastal Restoration</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Market Price</div>
                      <div className="text-3xl font-extrabold text-slate-900 tracking-tighter">${(credit.amount * 45).toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => handleBuy(credit.id)}
                      disabled={!!isProcessing}
                      className={`px-10 py-4 rounded-[1.2rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl ${
                        isProcessing === credit.id 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-slate-900 text-white hover:bg-sky-600 hover:shadow-sky-500/30 active:scale-95'
                      }`}
                    >
                      {isProcessing === credit.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Settling...</span>
                        </div>
                      ) : 'Settle Asset'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {myCredits.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center">
              <span className="w-10 h-1 h-1 bg-emerald-500 rounded-full mr-4"></span>
              ESG Portfolio
            </h2>
          </div>
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-2xl premium-shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Certificate</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vintage</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Settlement</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ledger Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myCredits.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-sky-600 font-bold tracking-tight">#CERT-{c.id.slice(-8).toUpperCase()}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase mt-1">Immutable Hash Verified</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-extrabold text-slate-900 text-lg">{c.amount} tCO2e</td>
                    <td className="px-10 py-6 text-slate-600 font-bold uppercase text-[11px]">{c.vintage} Registry</td>
                    <td className="px-10 py-6 text-slate-500 font-medium">
                      {c.purchaseDate ? new Date(c.purchaseDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="inline-flex items-center px-5 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        Retired Asset
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default CorporateDashboard;