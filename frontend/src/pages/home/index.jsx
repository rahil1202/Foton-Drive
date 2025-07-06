import Lottie from 'lottie-react';
import {
  BarChart,
  CheckCircle,
  Cloud,
  Eye,
  FileText,
  FolderOpen,
  HardDrive,
  History,
  Lock,
  Menu,
  Search,
  Share2,
  Shield,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
import React from 'react';

import heroAnimation from '../../assets/animations/hero_animation.json';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <Cloud className="w-6 h-6 text-yellow-500" />,
      title: 'Cloud Storage',
      description:
        'Secure cloud storage with unlimited space and automatic backups across all devices.',
    },
    {
      icon: <Share2 className="w-6 h-6 text-yellow-500" />,
      title: 'Smart Sharing',
      description: 'Share files and folders with customizable permissions and expiration dates.',
    },
    {
      icon: <Search className="w-6 h-6 text-yellow-500" />,
      title: 'Advanced Search',
      description:
        'Find files instantly with AI-powered search across content, metadata, and tags.',
    },
    {
      icon: <Shield className="w-6 h-6 text-yellow-500" />,
      title: 'Enterprise Security',
      description:
        'End-to-end encryption, compliance certifications, and advanced access controls.',
    },
    {
      icon: <Users className="w-6 h-6 text-yellow-500" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with version control and conflict resolution.',
    },
    {
      icon: <History className="w-6 h-6 text-yellow-500" />,
      title: 'Version History',
      description: 'Track all changes with detailed version history and one-click restore.',
    },
    {
      icon: <BarChart className="w-6 h-6 text-yellow-500" />,
      title: 'Usage Analytics',
      description: 'Monitor storage usage, file activity, and team productivity metrics.',
    },
    {
      icon: <Lock className="w-6 h-6 text-yellow-500" />,
      title: 'Access Control',
      description: 'Granular permissions with role-based access and audit trails.',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Fast Sync',
      description: 'Lightning-fast synchronization across all devices with delta sync technology.',
    },
  ];

  const stats = [
    { number: '10TB+', label: 'Storage Capacity', icon: <HardDrive className="w-5 h-5" /> },
    { number: '500K+', label: 'Files Managed', icon: <FileText className="w-5 h-5" /> },
    { number: '99.9%', label: 'Uptime', icon: <CheckCircle className="w-5 h-5" /> },
    { number: '24/7', label: 'Support', icon: <Eye className="w-5 h-5" /> },
  ];

  const fileTypes = [
    { type: 'Documents', count: '2.5K+', color: 'bg-blue-500' },
    { type: 'Images', count: '1.8K+', color: 'bg-green-500' },
    { type: 'Videos', count: '450+', color: 'bg-purple-500' },
    { type: 'Audio', count: '320+', color: 'bg-orange-500' },
    { type: 'Archives', count: '180+', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                FMS  | File Management System
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-yellow-500 transition">
                Features
              </a>
              <a href="#stats" className="text-gray-300 hover:text-yellow-500 transition">
                Analytics
              </a>
              
              <a
                href="/login"
                className="px-4 py-2 text-white hover:bg-yellow-500 rounded-lg transition"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition shadow-sm"
              >
                Get Started
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-yellow-500 transition">
                  Features
                </a>
                <a href="#stats" className="text-gray-300 hover:text-yellow-500 transition">
                  Analytics
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-yellow-500 transition">
                  Pricing
                </a>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <a
                    href="/login"
                    className="px-4 py-2 text-yellow-500 border border-yellow-500 rounded-lg text-center hover:bg-yellow-500 hover:text-black transition"
                  >
                    Log In
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 bg-yellow-500 text-black rounded-lg text-center hover:bg-yellow-600 transition"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white overflow-hidden">
          {/* Animated Background */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-600 opacity-15 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-yellow-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>

          <div className="container mx-auto px-4 py-20 relative">
            <div className="grid lg:grid-cols-2 items-center gap-12">
              {/* Left Column */}
              <div className="animate-fade-in">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium mb-6">
                  <Zap className="w-4 h-4 mr-2" />
                  Advanced File Management
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                  Organize, Share &{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Secure Your Files
                  </span>{' '}
                  Like Never Before
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed">
                  FMS revolutionizes how you manage documents with AI-powered
                  organization, enterprise-grade security, and seamless collaboration tools.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 mt-8">
                  <div className="flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <Cloud className="w-4 h-4 mr-2 text-yellow-500" />
                    Unlimited Storage
                  </div>
                  <div className="flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <Shield className="w-4 h-4 mr-2 text-yellow-500" />
                    End-to-End Encryption
                  </div>
                  <div className="flex items-center px-3 py-1 bg-white/10 rounded-full text-sm">
                    <Users className="w-4 h-4 mr-2 text-yellow-500" />
                    Team Collaboration
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <a
                    href="/signup"
                    className="group px-8 py-4 bg-yellow-500 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                  >
                    <Upload className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Start Free Trial
                  </a>
                  <a
                    href="/signup"
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Watch Demo
                  </a>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative">
                <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[550px]">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-2xl blur-3xl"></div>

                  {/* Animation Container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                    <Lottie animationData={heroAnimation} loop={true} className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                    {React.cloneElement(stat.icon, { className: 'w-5 h-5 text-yellow-600' })}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Powerful Features for Modern File Management
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to store, organize, and collaborate on your files with
                enterprise-grade security and performance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="mb-4 flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* File Types Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Support for All File Types
              </h2>
              <p className="text-lg text-gray-600">
                Manage any file format with intelligent organization and preview capabilities
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {fileTypes.map((type, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-16 h-16 ${type.color} rounded-2xl mx-auto mb-4 flex items-center justify-center`}
                  >
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{type.type}</h3>
                  <p className="text-2xl font-bold text-gray-800">{type.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your File Management?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using FMS to streamline their workflows
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Free Trial
              </a>
              <a
                href="/contact"
                className="px-8 py-4 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FolderOpen className="w-6 h-6 text-yellow-500" />
                <span className="text-xl font-bold text-white">FMS</span>
              </div>
              <p className="text-sm">
                Professional file management solution for modern teams and businesses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-yellow-500 transition">
                  Features
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  Pricing
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  Security
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  Integrations
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-yellow-500 transition">
                  Help Center
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  Contact
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  API Docs
                </a>
                <a href="#" className="block hover:text-yellow-500 transition">
                  Status
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Rahil Vahora</h4>
              <div className="space-y-2 text-sm">
                <a href="https://github.com/rahil1202" target="_blank" className="block hover:text-yellow-500 transition">
                  Github
                </a>
                <a href="https://www.linkedin.com/in/rahil-vahora/"  target="_blank" className="block hover:text-yellow-500 transition">
                  LinkedIn
                </a>
                <a href="https://x.com/@Rahil_Vahora12" target="_blank" className="block hover:text-yellow-500 transition">
                  Twitter
                </a>
                
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Made with ❤️ by 
              <a
                href="https://github.com/rahil1202"
                className="text-yellow-500 hover:underline"
              >
                {" "}Rahil Vahora
              </a>.
              <br />
             This Product is a fictional product created for demonstration purposes.
              <br />
              All rights reserved.
            </p>           
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
