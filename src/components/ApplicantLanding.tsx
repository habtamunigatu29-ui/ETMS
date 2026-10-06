import React, { useState } from 'react';
import heroStudentImg from '../assets/images/hero_internship_student_1784803384022.jpg';
import labCollabImg from '../assets/images/students_lab_collaboration_1784803398446.jpg';
import certGraduationImg from '../assets/images/student_certificate_graduation_1784803411273.jpg';
import {
  Search,
  Send,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  Building,
  TrendingUp,
  Globe,
  CheckCircle,
  FileText,
  Clock,
  Shield,
  Phone,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info,
  MapPin,
  Building2,
  Award,
  CheckSquare,
  MessageSquare,
  ChevronRight,
  Zap,
  Users,
  Check,
  PhoneCall
} from 'lucide-react';

interface ApplicantLandingProps {
  onLogin: (identifier: string, password: string) => void;
  onOpenApplyModal: () => void;
  onOpenStatusChecker: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const ApplicantLanding: React.FC<ApplicantLandingProps> = ({
  onLogin,
  onOpenApplyModal,
  onOpenStatusChecker,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('APPLICATION');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setLoginError('Please enter your Email, Username, or Applicant ID (e.g. APP-2026-0101)');
      return;
    }
    if (!password) {
      setLoginError('Please enter your password');
      return;
    }
    
    setLoginError(null);
    setIsLoading(true);
    
    try {
      await onLogin(identifier, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: contactName, 
          email: contactEmail, 
          category: contactCategory, 
          message: contactMessage 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setContactSuccess(true);
        setTimeout(() => {
          setContactName('');
          setContactEmail('');
          setContactMessage('');
          setContactSuccess(false);
        }, 4000);
      } else {
        alert(data?.error || 'Failed to submit contact form');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const tracks = [
    {
      id: 'telecom-engineering',
      title: 'Telecommunications & Fiber Engineering',
      code: 'ENG-TEL',
      duration: '6 - 12 Months',
      seats: '120 Openings',
      focus: ['5G Network Operations', 'FTTH Splicing & Testing', 'Microwave Transmission', 'RAN Optimization'],
      eligible: 'B.Sc in Telecommunications, Electrical, or Electronics Engineering',
      bgGradient: 'from-emerald-900 to-emerald-950'
    },
    {
      id: 'software-dev',
      title: 'Software Engineering & Cloud AI',
      code: 'DEV-CLOUD',
      duration: '6 - 12 Months',
      seats: '85 Openings',
      focus: ['BSS/OSS Microservices', 'Telebirr API Integrations', 'DevOps & Kubernetes', 'React/Node Web Apps'],
      eligible: 'B.Sc in Software Engineering, Computer Science, or IT',
      bgGradient: 'from-[#005226] to-emerald-900'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & SOC Operations',
      code: 'SEC-SOC',
      duration: '6 - 12 Months',
      seats: '45 Openings',
      focus: ['SOC Threat Monitoring', 'Firewall Management', 'Vulnerability Assessment', 'Incident Response'],
      eligible: 'B.Sc in Cybersecurity, CS, or Network Engineering',
      bgGradient: 'from-[#003819] to-emerald-950'
    },
    {
      id: 'fintech-analytics',
      title: 'Business Analytics & Digital Finance (Telebirr)',
      code: 'BUS-FIN',
      duration: '6 Months',
      seats: '60 Openings',
      focus: ['Fintech Transaction Analytics', 'Customer Behavior Insights', 'BI Dashboards', 'Product Lifecycle'],
      eligible: 'B.Sc in Information Systems, Data Science, Business Administration, or Economics',
      bgGradient: 'from-emerald-800 to-emerald-950'
    },
    {
      id: 'power-systems',
      title: 'Power Systems & Green Energy Telecom',
      code: 'PWR-GRN',
      duration: '6 - 12 Months',
      seats: '40 Openings',
      focus: ['Solar Micro-grid Systems', 'Data Center Power Backups', 'UPS & Battery Tech', 'HVAC Cooling'],
      eligible: 'B.Sc in Power Engineering or Electrical Engineering',
      bgGradient: 'from-[#006D32] to-[#004d23]'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50/40 via-white to-gray-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-20">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* SECTION 1: HOME (HERO & LOGIN PORTAL) */}
        <section id="home" className="scroll-mt-24 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Welcome & Info (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Title & Hero Visual Banner */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-black text-[#006D32] uppercase tracking-wider mb-1">
                    Welcome to
                  </p>
                  <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                    ET-AMS
                  </h1>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#006D32] mt-1">
                    Apprenticeship Management System
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed font-normal">
                    Empowering the next generation of Ethiopian university students and young engineers through structured apprenticeship, hands-on 5G telecom lab experience, and digital skill development at Ethio Telecom.
                  </p>
                </div>

                {/* Hero Internship Student Representation Visual */}
                <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-xl group">
                  <img
                    src={heroStudentImg}
                    alt="Ethiopian University Internship Student at Ethio Telecom"
                    referrerPolicy="no-referrer"
                    className="w-full h-56 sm:h-72 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/20 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                    <p className="text-base sm:text-xl font-black tracking-tight drop-shadow-md">
                      Bridging Academic Excellence & Telecom Engineering
                    </p>
                    <p className="text-xs text-gray-200 font-medium tracking-wide">
                      Hands-on mentorship at Ethio Telecom Regional & HQ Laboratories.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: <GraduationCap className="w-6 h-6 text-[#006D32]" />,
                    title: 'Learn from Industry Experts'
                  },
                  {
                    icon: <Building className="w-6 h-6 text-[#006D32]" />,
                    title: 'Real World Experience'
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6 text-[#006D32]" />,
                    title: 'Career Development'
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-[#006D32]" />,
                    title: 'Nationwide Opportunities'
                  }
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      {feat.icon}
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">
                      {feat.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Action Navigation Bar */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
                <h3 className="text-sm font-extrabold text-gray-900 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006D32]"></span>
                  <span>Quick Access Portal Tools</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={onOpenApplyModal}
                    className="p-4 rounded-2xl bg-[#006D32] hover:bg-[#005527] text-white font-bold text-xs text-left shadow-md transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-extrabold">New Applicant Registration</p>
                      <p className="text-[11px] text-emerald-100/80 mt-0.5">Submit your details & documents</p>
                    </div>
                    <Send className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenStatusChecker}
                    className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-bold text-xs text-left shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-[#006D32]">Check Application Status</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">Lookup via APP ID or Email</p>
                    </div>
                    <Search className="w-5 h-5 text-[#006D32] group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Auth Portal (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
                
                {/* Top Welcome Header */}
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-[#006D32] mb-2 shadow-2xs">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back!</h3>
                  <p className="text-xs text-gray-500 font-medium">Login to access your ET-AMS account</p>
                </div>

                {/* Login / Create Account Toggle */}
                <div className="flex p-1 bg-gray-100 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('LOGIN')}
                    className={`flex-1 py-2.5 rounded-xl transition-all ${
                      activeTab === 'LOGIN'
                        ? 'bg-white text-[#006D32] shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('REGISTER');
                      onOpenApplyModal();
                    }}
                    className={`flex-1 py-2.5 rounded-xl transition-all ${
                      activeTab === 'REGISTER'
                        ? 'bg-white text-[#006D32] shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    First Time User? <span className="font-semibold block sm:inline">Apply Here</span>
                  </button>
                </div>

                {loginError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Email or App ID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email, Username, or Applicant ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. app.solomon@ethiotelecom.et or APP-2026-0101"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end text-xs font-semibold">
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo Notice: You can log in using any registered demo email (e.g. app.solomon@ethiotelecom.et, hr.manager@ethiotelecom.et, dept.it@ethiotelecom.et) or Application ID (e.g. APP-2026-0101).'); }} className="text-[#006D32] hover:underline">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Main Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-[#006D32] hover:bg-[#005527] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Login</span>
                      </>
                    )}
                  </button>

                </form>

                {/* Bottom Apply Card */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start space-x-3">
                  <div className="p-1.5 bg-emerald-100 rounded-xl text-[#006D32] flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-extrabold text-gray-900">New to ET-AMS?</p>
                      <p className="text-gray-600 leading-tight">If you are applying for apprenticeship for the first time, please submit your application form.</p>
                    </div>
                    <button
                      onClick={onOpenApplyModal}
                      className="w-full py-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-[#006D32] font-bold text-xs shadow-2xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Apply Now</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: ABOUT */}
        <section id="about" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
              About Ethio Telecom AMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Pioneering National Digital Excellence & Youth Talent
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              Ethio Telecom's Apprenticeship Management System (ET-AMS) is the flagship nationwide initiative bridging academia and industry. We provide structured training, hands-on exposure to cutting-edge 5G telecommunication networks, cloud data centers, and Telebirr fintech systems.
            </p>
          </div>

          {/* Key Impact Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#006D32]">10,000+</p>
              <p className="text-xs font-bold text-gray-900 uppercase">Graduated Apprentices</p>
              <p className="text-[11px] text-gray-500">Across 11 regional hubs</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#F2A900]">98%</p>
              <p className="text-xs font-bold text-gray-900 uppercase">Employment Rate</p>
              <p className="text-[11px] text-gray-500">Industry placement success</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#006D32]">12</p>
              <p className="text-xs font-bold text-gray-900 uppercase">Regional Training Hubs</p>
              <p className="text-[11px] text-gray-500">Nationwide presence</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-800">100%</p>
              <p className="text-xs font-bold text-gray-900 uppercase">Digital Verification</p>
              <p className="text-[11px] text-gray-500">QR & Blockchain ID</p>
            </div>
          </div>

          {/* Lab Collaboration Image & Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 bg-emerald-100 text-[#006D32] rounded-full text-[10px] font-black uppercase tracking-wider">
                Hands-on Telecom Lab Training
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
                Real-World Engineering & Collaborative Innovation
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Apprentices work directly with live fiber-optic splicing gear, 5G cellular base stations, enterprise cloud server clusters, and Telebirr API staging environments under senior engineer supervision.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold text-gray-800">
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#006D32]"></span>
                  <span>5G & Optical Labs</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#006D32]"></span>
                  <span>DevOps & Cloud AI</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg group">
                <img
                  src={labCollabImg}
                  alt="Ethiopian University Engineering Interns Collaborating in Telecom Lab"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-semibold">
                  ✓ Ethio Telecom Central Innovation Lab — Addis Ababa
                </div>
              </div>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#006D32]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Our Strategic Vision</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                To build an exceptionally skilled, digitally empowered workforce that leads Ethiopia's digital economy, driving innovation in telecommunications, cybersecurity, artificial intelligence, and financial technologies.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-3">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#F2A900]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">Our Core Mission</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                To connect ambitious university graduates with senior telecom mentors, state-of-the-art laboratory infrastructure, real-world project deployments, and verified digital certification.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROGRAMS */}
        <section id="programs" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
              Apprenticeship Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Explore Our Specialized Technical Programs
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Select your track of interest and gain direct mentorship from lead engineers and division heads at Ethio Telecom.
            </p>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Track Header Banner */}
                  <div className={`p-6 bg-gradient-to-r ${track.bgGradient} text-white space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                        {track.code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F2A900] text-gray-900 font-extrabold text-[10px]">
                        {track.seats}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-snug">{track.title}</h3>
                    <p className="text-xs text-emerald-200 font-semibold">Duration: {track.duration}</p>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 text-xs">
                    <div>
                      <p className="font-extrabold text-gray-900 mb-2 uppercase text-[10px] tracking-wider text-gray-500">
                        Key Skills & Learning Focus:
                      </p>
                      <ul className="space-y-1.5">
                        {track.focus.map((f, i) => (
                          <li key={i} className="flex items-center space-x-2 text-gray-700 font-medium">
                            <Check className="w-4 h-4 text-[#006D32] flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="font-bold text-gray-500 text-[10px] uppercase">Eligibility:</p>
                      <p className="text-gray-800 font-semibold">{track.eligible}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={onOpenApplyModal}
                    className="w-full py-2.5 rounded-xl bg-[#006D32] hover:bg-[#005527] text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Apply for {track.code}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: REQUIREMENTS */}
        <section id="requirements" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
              Eligibility & Guidelines
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Application Requirements & Checklist
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Review our eligibility criteria and ensure you have all required documents ready prior to submitting your online application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Eligibility Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-6">
              <div className="flex items-center space-x-3 text-[#006D32]">
                <CheckSquare className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-gray-900">Eligibility Criteria</h3>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#006D32] flex items-center justify-center font-bold text-xs mt-0.5">1</span>
                  <div>
                    <p className="font-extrabold text-gray-900">Academic Qualification</p>
                    <p className="text-gray-600">Must hold a B.Sc degree or Advanced Diploma from an accredited Ethiopian University or College in Engineering, CS, IT, or Business.</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#006D32] flex items-center justify-center font-bold text-xs mt-0.5">2</span>
                  <div>
                    <p className="font-extrabold text-gray-900">Minimum GPA Requirement</p>
                    <p className="text-gray-600">Minimum Cumulative GPA of <strong>2.75</strong> for male candidates and <strong>2.50</strong> for female candidates.</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#006D32] flex items-center justify-center font-bold text-xs mt-0.5">3</span>
                  <div>
                    <p className="font-extrabold text-gray-900">Graduation Year</p>
                    <p className="text-gray-600">Recent graduates from academic years 2024, 2025, or 2026.</p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#006D32] flex items-center justify-center font-bold text-xs mt-0.5">4</span>
                  <div>
                    <p className="font-extrabold text-gray-900">National Identification</p>
                    <p className="text-gray-600">Valid Ethiopian Resident ID, National Digital ID (Fayda), or Passport.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Required Documents Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md space-y-6">
              <div className="flex items-center space-x-3 text-[#006D32]">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-extrabold text-gray-900">Required Documents Checklist</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'University Degree / Temporary Cert', req: 'Required (PDF)' },
                  { name: 'Official Academic Transcript', req: 'Required (PDF)' },
                  { name: 'Cost Sharing / Student ID', req: 'Required (PDF/Image)' },
                  { name: 'National ID / Fayda Card', req: 'Required (Image)' },
                  { name: 'Updated CV / Resume', req: 'Required (PDF)' },
                  { name: 'Recommendation Letter', req: 'Optional (PDF)' }
                ].map((doc, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-gray-900">{doc.name}</p>
                      <p className="text-[10px] text-emerald-800 font-bold">{doc.req}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-[#006D32]" />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-extrabold">Important File Formatting Tip:</p>
                <p className="text-amber-800">Please ensure all uploaded PDF or image files are clear, legible, and do not exceed 10MB per document.</p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: HOW TO APPLY */}
        <section id="how-to-apply" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
              Step-by-Step Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              How the Application & Selection Process Works
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Follow these simple steps to complete your online application and track your progress in real time.
            </p>
          </div>

          {/* 5-step horizontal / grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: 'Step 1',
                title: 'Online Form Submission',
                desc: 'Fill out your personal details, academic university, GPA, and contact information.',
                icon: <FileText className="w-6 h-6 text-[#006D32]" />
              },
              {
                step: 'Step 2',
                title: 'Instant APP ID Issued',
                desc: 'Receive your unique official Application ID (e.g., APP-2026-0101) upon submission.',
                icon: <Shield className="w-6 h-6 text-[#006D32]" />
              },
              {
                step: 'Step 3',
                title: 'HR Screening & Scoring',
                desc: 'Ethio Telecom HR team validates your GPA, transcript, and eligibility rules.',
                icon: <Users className="w-6 h-6 text-[#006D32]" />
              },
              {
                step: 'Step 4',
                title: 'Department Placement',
                desc: 'Matched with department heads and assigned an industry expert mentor.',
                icon: <Building2 className="w-6 h-6 text-[#006D32]" />
              },
              {
                step: 'Step 5',
                title: 'Digital Certification',
                desc: 'Complete tasks, track daily attendance, and receive an official verified QR certificate.',
                icon: <Award className="w-6 h-6 text-[#006D32]" />
              }
            ].map((st, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006D32] text-[10px] font-black uppercase">
                  {st.step}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center my-2">
                  {st.icon}
                </div>
                <h4 className="font-extrabold text-sm text-gray-900">{st.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Student Success & Certification Showcase Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg group">
                <img
                  src={certGraduationImg}
                  alt="Ethiopian Apprentice Student Receiving Official Ethio Telecom Certificate"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-[#007A3D] text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5 text-[#F2A900]" />
                  <span>Verified QR Certificate</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-wider">
                Certified Career Milestones
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
                Earn National Recognition & Verified Credentials
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Upon completing your 6 to 12-month apprenticeship program, Ethio Telecom awards an officially signed digital certificate with a unique QR code for instant employer verification across Ethiopia and international partners.
              </p>
              <div className="flex items-center space-x-4 pt-1 text-xs font-bold text-gray-800">
                <div className="flex items-center space-x-1.5 text-[#006D32]">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% Digital Verification</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[#006D32]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Direct Priority Hiring</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-[#006D32] to-emerald-900 rounded-[2rem] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-black">Ready to Start Your Journey with Ethio Telecom?</h3>
              <p className="text-xs sm:text-sm text-emerald-100">Applications for the 2026 Apprenticeship Program are currently open nationwide.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onOpenApplyModal}
                className="px-6 py-3 rounded-xl bg-white text-[#006D32] font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition-all flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
              <button
                onClick={onOpenStatusChecker}
                className="px-6 py-3 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Track Existing Application</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: CONTACT US */}
        <section id="contact" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-green-100 text-[#006D32] rounded-full text-xs font-extrabold uppercase tracking-wider">
              Contact & Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Get in Touch with our AMS Support Team
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Have questions regarding your application, department placement, or technical verification? We are here to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Contact Info & Regional Hubs (5 cols) */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
                <h3 className="font-black text-base text-gray-900 flex items-center space-x-2">
                  <PhoneCall className="w-5 h-5 text-[#006D32]" />
                  <span>Ethio Telecom HQ Headquarters</span>
                </h3>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#006D32] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-gray-900">Headquarters Address</p>
                      <p>Churchill Road, Ethio Telecom Tower, P.O. Box 1047, Addis Ababa, Ethiopia</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-[#006D32] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-gray-900">AMS Toll-Free Hotline</p>
                      <p>+251 915 717 101 / Shortcode: 994</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-[#006D32] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-gray-900">Support Email</p>
                      <p>ams-support@ethiotelecom.et</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-[#006D32] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-extrabold text-gray-900">Working Hours</p>
                      <p>Monday – Friday: 8:00 AM – 5:00 PM (EAT)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Hubs List */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-3">
                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider text-gray-500">
                  Regional Training Centers:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 font-semibold">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Central AA Hub</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Adama Hub</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Hawassa Hub</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Dire Dawa Hub</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Bahir Dar Hub</div>
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-200/60">📍 Mekelle Hub</div>
                </div>
              </div>

            </div>

            {/* Right: Interactive Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Send an Online Inquiry</h3>
                <p className="text-xs text-gray-500">Our support desk responds within 24 business hours.</p>
              </div>

              {contactSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#006D32]" />
                  <span>Thank you! Your message has been sent to Ethio Telecom AMS support desk.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Your Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. abebe@gmail.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Inquiry Category</label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] font-semibold"
                  >
                    <option value="APPLICATION">Application & Registration Issue</option>
                    <option value="STATUS">Status Lookup Inquiry</option>
                    <option value="DEPARTMENT">Department Placement & Mentor Assignment</option>
                    <option value="CERTIFICATE">Digital Certificate Verification</option>
                    <option value="OTHER">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Message Detail</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry or request in detail..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006D32] font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#006D32] hover:bg-[#005527] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry Message</span>
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Bottom Trust & Support Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-8 border-t border-gray-200/80">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 shadow-2xs">
            <Shield className="w-6 h-6 text-[#006D32] flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Secure & Safe</p>
              <p className="text-gray-500">Your data is protected with industry-standard security.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 shadow-2xs">
            <Lock className="w-6 h-6 text-[#006D32] flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Privacy Focused</p>
              <p className="text-gray-500">We respect your privacy and data protection.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 shadow-2xs">
            <Phone className="w-6 h-6 text-[#006D32] flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Need Help?</p>
              <p className="text-gray-500">Contact our support team anytime (+251 915 717 101).</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-3 shadow-2xs">
            <Clock className="w-6 h-6 text-[#006D32] flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Office Hours</p>
              <p className="text-gray-500">Mon - Fri: 8:00 AM - 5:00 PM (EAT)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
