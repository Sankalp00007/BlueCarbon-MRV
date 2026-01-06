
import React, { useState } from 'react';
import { User, CreditRecord } from '../types';
import { ICONS } from '../constants';

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
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">ESG Marketplace</h1>
          <p className="text-slate-500">Directly fund verified coastal restoration projects.</p>
        </div>
        <div className="bg-sky-500 text-white px-8 py-4 rounded-3xl shadow-xl shadow-sky-500/20 flex items-center">
          <div className="mr-6 border-r border-sky-400 pr-6">
            <div className="text-xs font-bold opacity-70 uppercase tracking-widest">Total Offset</div>
            <div className="text-2xl font-bold">{totalTons.toFixed(1)} <span className="text-sm font-medium">tCO2e</span></div>
          </div>
          <div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-widest">ESG Score Impact</div>
            <div className="text-2xl font-bold">+{(totalTons * 0.4).toFixed(1)}%</div>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-3"><ICONS.Credit /></span>
          Available Blue Carbon Credits
        </h2>
        
        {availableCredits.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-slate-300 mb-4 scale-150">🌿</div>
            <h3 className="text-xl font-bold text-slate-800">Market is cooling down</h3>
            <p className="text-slate-500">New verified credits are being audited. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCredits.map((credit) => (
              <div key={credit.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
                <div className="h-3 bg-sky-500"></div>
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">Verified Blue Carbon</h4>
                      <p className="text-sm text-slate-500">Vintage {credit.vintage}</p>
                    </div>
                    <div className="bg-sky-50 text-sky-600 font-bold px-3 py-1 rounded text-sm">
                      #{credit.id.split('-')[1].substring(0, 4)}
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-bold text-slate-900">{credit.amount} tCO2e</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Registry</span>
                      <span className="font-bold text-slate-900">BlueCarbon Ledger</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Project Type</span>
                      <span className="font-bold text-slate-900">Coastal Restoration</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Price</div>
                      <div className="text-2xl font-bold text-slate-900">${(credit.amount * 45).toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => handleBuy(credit.id)}
                      disabled={!!isProcessing}
                      className={`px-6 py-3 rounded-xl font-bold transition-all ${
                        isProcessing === credit.id 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10'
                      }`}
                    >
                      {isProcessing === credit.id ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {myCredits.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">My ESG Portfolio</h2>
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Certificate ID</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Vintage</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Purchase Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myCredits.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-sky-600 font-medium">{c.id}</td>
                    <td className="px-8 py-5 font-bold text-slate-900">{c.amount} tCO2e</td>
                    <td className="px-8 py-5 text-slate-600">{c.vintage}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm">
                      {c.purchaseDate ? new Date(c.purchaseDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded tracking-wider">RETIRED</span>
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
