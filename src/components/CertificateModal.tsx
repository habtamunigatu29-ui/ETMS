import React from 'react';
import { Certificate } from '../types';
import { X, Award, CheckCircle2, QrCode, Download, Printer, ShieldCheck, Share2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-10 relative border-8 border-emerald-800/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Actions bar at top */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center space-x-2 text-[#007A3D]">
            <Award className="w-6 h-6" />
            <span className="font-extrabold text-sm tracking-wide uppercase">Verified Digital Certificate</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div id="printable-certificate" className="border-4 border-[#007A3D] p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-emerald-50/30 via-white to-emerald-50/20 relative overflow-hidden text-center shadow-inner">
          
          {/* Background Watermark Pattern */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
            <div className="text-9xl font-black text-[#007A3D] transform -rotate-12">ETHIO TELECOM</div>
          </div>

          {/* Top Brand Seal */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#007A3D] rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-emerald-900/20 border-2 border-[#F2A900]">
              et
            </div>
          </div>

          <p className="text-xs font-extrabold text-[#007A3D] uppercase tracking-widest mb-1">
            ETHIO TELECOM • ኢትዮ ቴሌኮም
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            CERTIFICATE OF APPRENTICESHIP
          </h2>
          <p className="text-xs text-gray-500 font-serif italic mb-8">
            This is to certify that
          </p>

          {/* Apprentice Name */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#007A3D] tracking-tight underline decoration-[#F2A900] decoration-4 underline-offset-8 mb-6">
            {certificate.apprentice_name}
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-gray-700 leading-relaxed mb-6 font-medium">
            has successfully completed the intensive 6-month Professional Telecom Apprenticeship Program in
            the <span className="font-extrabold text-gray-900">{certificate.department_name}</span> at Ethio Telecom Headquarters with an overall performance evaluation grade of <span className="font-extrabold text-[#007A3D]">{certificate.overall_score} / 10.0</span> and attendance rate of <span className="font-extrabold text-[#007A3D]">{certificate.attendance_rate}%</span>.
          </p>

          {/* Verification Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100 text-[#007A3D] text-xs font-bold mb-8">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Ethio Telecom Verification Record: {certificate.cert_number}</span>
          </div>

          {/* Signatures & QR Code Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-emerald-200/60 items-center">
            
            {/* Signature 1 */}
            <div className="text-center sm:text-left">
              <div className="h-10 border-b border-gray-400 max-w-[160px] mx-auto sm:mx-0 flex items-end justify-center sm:justify-start font-serif italic text-xs text-gray-600">
                {certificate.issued_by_name}
              </div>
              <p className="text-[11px] font-bold text-gray-900 mt-1">HR Director / Executive</p>
              <p className="text-[10px] text-gray-500">Ethio Telecom HR Department</p>
            </div>

            {/* QR Code in center */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-2 bg-white rounded-xl border border-gray-300 shadow-xs mb-1">
                <QrCode className="w-16 h-16 text-[#007A3D]" />
              </div>
              <p className="text-[10px] font-mono font-bold text-gray-600">Scan to Verify Authenticity</p>
            </div>

            {/* Signature 2 */}
            <div className="text-center sm:text-right">
              <div className="h-10 border-b border-gray-400 max-w-[160px] mx-auto sm:ms-auto flex items-end justify-center sm:justify-end font-serif italic text-xs text-gray-600">
                Issued: {certificate.issue_date}
              </div>
              <p className="text-[11px] font-bold text-gray-900 mt-1">Chief Technology Officer</p>
              <p className="text-[10px] text-gray-500">Ethio Telecom Engineering</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
