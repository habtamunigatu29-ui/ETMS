import React from 'react';
import { Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
  onOpenApplyModal?: () => void;
  onOpenStatusChecker?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenApplyModal,
  onOpenStatusChecker
}) => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#006D32] rounded-xl flex items-center justify-center font-black text-white text-lg shadow-sm">
                et
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">ethio telecom</span>
                <p className="text-[11px] text-gray-400">Apprenticeship Management System</p>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Empowering Ethiopian youth through structured apprenticeship, hands-on telecom engineering, and digital skill development.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Portal Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={onOpenApplyModal} className="hover:text-emerald-400 transition-colors text-left">
                  Applicant Registration
                </button>
              </li>
              <li>
                <button onClick={onOpenStatusChecker} className="hover:text-emerald-400 transition-colors text-left">
                  Application Status Lookup
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('programs')} className="hover:text-emerald-400 transition-colors text-left">
                  Apprenticeship Programs & Tracks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('requirements')} className="hover:text-emerald-400 transition-colors text-left">
                  Requirements & Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('how-to-apply')} className="hover:text-emerald-400 transition-colors text-left">
                  How to Apply Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('contact')} className="hover:text-emerald-400 transition-colors text-left">
                  Support & Regional Hubs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Hours */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Help & Support</h4>
            <div className="space-y-2.5 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#006D32]" />
                <span>+251 915 717 101 / Shortcode: 994</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#006D32]" />
                <span>ams-support@ethiotelecom.et</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#006D32]" />
                <span>Mon - Fri: 8:00 AM - 5:00 PM (EAT)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#006D32]" />
                <span>Churchill Road, HQ Building, Addis Ababa</span>
              </div>
            </div>
          </div>

          {/* Col 4: Security & Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Security & Compliance</h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              All applicant data is protected under Ethio Telecom security protocols with digital signatures and QR code verification.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>ISO 27001 Certified System</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Ethio telecom. All rights reserved. ET-AMS Enterprise Blueprint.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => onNavigate?.('about')} className="hover:text-gray-300 transition-colors">About AMS</button>
            <button onClick={() => onNavigate?.('contact')} className="hover:text-gray-300 transition-colors">Help Center</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
