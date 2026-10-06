import React, { useState } from 'react';
import { User } from '../types';
import { Search, Send, LogOut, Menu, X, Home, Info, GraduationCap, CheckSquare, HelpCircle, PhoneCall } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onOpenStatusChecker: () => void;
  onOpenApplyModal: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  onNavigate: (sectionId: string) => void;
  activeRoleView?: string;
  onRoleChange?: (role: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenStatusChecker,
  onOpenApplyModal,
  onLogout,
  onGoHome,
  onNavigate,
  activeRoleView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', id: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'About', id: 'about', icon: <Info className="w-4 h-4" /> },
    { label: 'Programs', id: 'programs', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Requirements', id: 'requirements', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'How to Apply', id: 'how-to-apply', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Contact Us', id: 'contact', icon: <PhoneCall className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top Ethio Telecom Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-[#006D32] to-emerald-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              {/* Ethio Telecom Symbol Styling */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className="text-white font-extrabold text-xl tracking-tighter">et</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F2A900] rounded-full border-2 border-white"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-[#006D32]">ethio telecom</span>
              </div>
              <p className="text-[11px] font-medium text-gray-500 tracking-wide">ኢትዮ ቴሌኮም | Enterprise AMS Portal</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs sm:text-sm font-bold text-gray-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="hover:text-[#006D32] transition-colors py-1 relative group cursor-pointer"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#006D32] transition-all group-hover:w-full rounded-full"></span>
              </button>
            ))}
          </nav>

          {/* Action Buttons & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onOpenStatusChecker();
                setMobileMenuOpen(false);
              }}
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 font-bold text-xs transition-all shadow-2xs"
            >
              <Search className="w-4 h-4 text-[#006D32]" />
              <span>Check Application Status</span>
            </button>

            {!currentUser ? (
              <button
                onClick={() => {
                  onOpenApplyModal();
                  setMobileMenuOpen(false);
                }}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#006D32] hover:bg-[#005527] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-white p-1.5 pl-3 rounded-2xl border border-gray-200 shadow-2xs">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{currentUser.full_name}</p>
                  <p className="text-[10px] font-bold text-[#006D32] uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-700 hover:text-[#006D32] hover:bg-emerald-50/80 lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center space-x-2 p-3 rounded-xl hover:bg-emerald-50 text-gray-800 font-bold text-xs transition-colors text-left"
              >
                <span className="text-[#006D32]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenStatusChecker();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-emerald-200 text-emerald-900 bg-emerald-50 font-bold text-xs"
            >
              <Search className="w-4 h-4 text-[#006D32]" />
              <span>Check Application Status</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
