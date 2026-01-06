
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FISHERMAN);

  const roles = [
    { type: UserRole.FISHERMAN, title: 'Community Member', icon: '🚣', desc: 'Monitor ecosystems and earn rewards.' },
    { type: UserRole.NGO, title: 'NGO Verifier', icon: '🕵️', desc: 'Review and validate field data.' },
    { type: UserRole.ADMIN, title: 'Registry Admin', icon: '🏛️', desc: 'Manage the whole marketplace.' },
    { type: UserRole.CORPORATE, title: 'Corporate Buyer', icon: '🏢', desc: 'Purchase verified ESG credits.' },
  ];

  const handleQuickLogin = () => {
    const mock = MOCK_USERS.find(u => u.role === selectedRole);
    if (mock) onLogin(mock as User);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Portal Access</h2>
            <p className="text-slate-500 font-light">Choose your protocol role to continue</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">✕</button>
        </div>
        
        <div className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.type}
                onClick={() => setSelectedRole(role.type)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === role.type 
                  ? 'border-sky-500 bg-sky-50 shadow-md' 
                  : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div className="font-bold text-slate-900">{role.title}</div>
                <div className="text-xs text-slate-500 mt-1 font-light">{role.desc}</div>
              </button>
            ))}
          </div>

          <button 
            onClick={handleQuickLogin}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-sky-500/20 transition-all mt-6 active:scale-95"
          >
            Sign In as {selectedRole.toLowerCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
