
import React from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onGoHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLoginClick, onGoHome }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              onGoHome();
            }}
          >
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
              <ICONS.Logo />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors leading-none">
                BlueCarbon
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-sky-400 transition-colors">
                Ledger
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 lg:space-x-8">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <span className="text-[10px] text-slate-500 font-black px-2 py-0.5 bg-slate-100 rounded-full w-fit ml-auto uppercase tracking-tighter">
                    {user.role}
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>
                <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-red-500 font-black transition-colors text-[10px] uppercase tracking-widest px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-slate-900 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
