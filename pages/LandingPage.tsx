import React from 'react';
import { ICONS } from '../constants.tsx';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const scrollToMission = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('mission');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-32 pb-32 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative h-[750px] flex items-center justify-center overflow-hidden rounded-[3.5rem] shadow-2xl mx-4 sm:mx-0 group">
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.35] transition-transform duration-[10s] group-hover:scale-110"
          alt="Coastal Mangroves"
        />
        <div className="relative text-center text-white px-6 max-w-5xl z-10">
          <div className="inline-block px-6 py-2 mb-8 rounded-full bg-sky-500/20 backdrop-blur-xl border border-sky-400/30 text-sky-300 text-[11px] font-black uppercase tracking-[0.4em] shadow-lg">
            Future of MRV
          </div>
          <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-tight tracking-tight">
            The Digital <span className="text-sky-400">Blue Carbon</span> Ledger
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-200 font-light leading-relaxed max-w-3xl mx-auto opacity-90">
            A blockchain-powered verification engine connecting high-impact coastal restoration with global capital through AI-validated environmental truth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white px-14 py-5 rounded-full text-lg font-black uppercase tracking-widest transition-all shadow-2xl shadow-sky-500/40 active:scale-95 hover:-translate-y-1"
            >
              Enter Marketplace
            </button>
            <button 
              onClick={scrollToMission}
              className="text-white/80 hover:text-white font-bold uppercase tracking-widest text-xs transition-all px-8 py-5 border border-white/10 rounded-full backdrop-blur-md hover:bg-white/5"
            >
              Explore Protocol
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-5xl font-bold text-slate-900 leading-tight">
              Scaling the <span className="text-sky-500">Global Registry</span> for Blue Ecosystems
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed">
              Current carbon markets are broken by manual verification delays and transparency gaps. We solve the "MRV Bottleneck" by digitizing the entire lifecycle of a carbon credit.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-transform hover:scale-105">
                <div className="text-3xl font-black text-slate-900 mb-1">100x</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verification Speed</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 transition-transform hover:scale-105">
                <div className="text-3xl font-black text-sky-600 mb-1">85%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Funds to Communities</div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid gap-8">
            <div className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-6 transition-transform">💎</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">The Business Aspect</h3>
              <p className="text-slate-500 leading-relaxed font-light text-sm">
                Blue Carbon credits trade at a 3x premium compared to terrestrial credits due to their higher permanence and significant co-benefits. Our platform provides the institutional-grade data needed to unlock these high-value assets.
              </p>
            </div>
            <div className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-6 transition-transform">🏢</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Fund This Protocol?</h3>
              <p className="text-slate-500 leading-relaxed font-light text-sm">
                Investors gain exposure to a high-growth environmental commodity while supporting projects that protect $65B in coastal infrastructure. This is not just conservation; it is critical climate risk management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10x Comparison Section */}
      <section className="bg-slate-900 -mx-4 sm:-mx-6 lg:-mx-8 px-8 py-32 rounded-[5rem] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold mb-8">10x More Effective <br/><span className="text-emerald-400">Than Land Forests</span></h2>
              <p className="text-slate-400 font-light text-xl leading-relaxed">
                Blue Carbon biomes are the most efficient sequestration engines on the planet, burying carbon up to 40 times faster than tropical rainforests and holding it for thousands of years.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur px-8 py-6 rounded-[2rem] border border-white/10 hidden lg:block">
              <div className="text-sky-400 text-3xl font-black mb-1">~50%</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ocean's Carbon in 0.2% area</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="group bg-white/5 p-4 rounded-[3.5rem] border border-white/10 transition-all hover:bg-white/10">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8">
                <img src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Mangroves" />
              </div>
              <div className="px-6 pb-6">
                <h3 className="text-3xl font-bold text-emerald-400 mb-4">Mangrove Forests</h3>
                <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
                  Mangroves trap organic matter in waterlogged soils where it cannot oxidize. Their soil carbon can be 10 meters deep, storing carbon for millennia.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Soil Storage</p>
                    <p className="text-xl font-bold">~1,000 tC/ha</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Coastal Shield</p>
                    <p className="text-xl font-bold">Storm Buffering</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 p-4 rounded-[3.5rem] border border-white/10 transition-all hover:bg-white/10">
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Seagrass" />
              </div>
              <div className="px-6 pb-6">
                <h3 className="text-3xl font-bold text-sky-400 mb-4">Seagrass Meadows</h3>
                <p className="text-slate-300 text-lg font-light leading-relaxed mb-8">
                  Seagrasses cover just 0.1% of the seafloor but account for 18% of the ocean’s total carbon burial. They are the ultimate "Carbon Sink" of the subtidal world.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Burial Rate</p>
                    <p className="text-xl font-bold">35x vs Jungle</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Habitat Benefit</p>
                    <p className="text-xl font-bold">Fish Nurseries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MRV Pipeline */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-bold mb-6 text-slate-900">The MRV Pipeline</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-light text-lg">
            A frictionless, end-to-end verification protocol that ensures every credit is backed by immutable environmental evidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>
          
          {[
            { step: '01', role: 'Community Member', title: 'Field Capture', desc: 'Members upload geofenced, timestamped site data. AI analyzes biometrics for species density.', icon: '📸' },
            { step: '02', role: 'Scientific NGO', title: 'Verification', desc: 'Third-party auditors cross-reference field data with high-res satellite imagery.', icon: '🕵️' },
            { step: '03', role: 'Registry Admin', title: 'Registry Mint', desc: 'Administrators perform a final compliance check before minting a unique cryptographic asset.', icon: '🏛️' },
            { step: '04', role: 'Corporations', title: 'Market Purchase', desc: 'Buyers purchase and "retire" credits. Smart contracts distribute funds directly.', icon: '💎' }
          ].map((item, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center p-8 group">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-3xl shadow-lg mb-8 transition-all group-hover:shadow-sky-500/10 group-hover:-translate-y-2 group-hover:border-sky-500/30">
                {item.icon}
              </div>
              <div className="text-sky-500 font-black text-[10px] uppercase tracking-widest mb-2">Step {item.step} • {item.role}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;