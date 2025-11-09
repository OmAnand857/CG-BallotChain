"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Vote, Shield, Users, TrendingUp, Menu, X, ChevronRight, Check, Lock, Key, Fingerprint, Eye, Target, Heart, Rocket, Globe, Award, Zap } from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CG-Ballotchain</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
              <a href="#security" className="text-gray-300 hover:text-white transition">Security</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
              <Link href="/contact" className="text-gray-300 hover:text-white transition">
                Contact
              </Link>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition">
                Launch App
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-blue-500/20">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white">How It Works</a>
              <a href="#security" className="block text-gray-300 hover:text-white">Security</a>
              <a href="#about" className="block text-gray-300 hover:text-white">About</a>
              <Link href="/contact" className="block text-gray-300 hover:text-white">
                Contact
              </Link>
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg">
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <span className="text-blue-400 text-sm font-medium">Powered by Blockchain Technology</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Secure, Transparent
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Digital Voting</span>
              </h1>
              
              <p className="text-xl text-gray-300">
                Revolutionary blockchain-based voting platform ensuring tamper-proof elections with complete transparency and verifiability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50">
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition border border-slate-700">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-gray-400 text-sm">Active Voters</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-gray-400 text-sm">Votes Cast</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-gray-400 text-sm">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Immutable Records</div>
                      <div className="text-gray-400 text-sm">Every vote permanently secured</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">End-to-End Encryption</div>
                      <div className="text-gray-400 text-sm">Military-grade security</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl">
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Anonymous Voting</div>
                      <div className="text-gray-400 text-sm">Privacy guaranteed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose CG-Ballotchain?</h2>
            <p className="text-xl text-gray-400">Built on cutting-edge blockchain technology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Unhackable Security</h3>
              <p className="text-gray-400">Leveraging blockchain's distributed ledger technology to ensure votes cannot be altered or tampered with.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Complete Transparency</h3>
              <p className="text-gray-400">Every transaction is recorded on the blockchain, allowing independent verification while maintaining voter privacy.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Results</h3>
              <p className="text-gray-400">Instant vote tallying and result reporting with full audit trail for complete accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, secure, and transparent voting process</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Connect Wallet", desc: "Connect your Web3 wallet to authenticate your identity" },
              { step: "02", title: "Verify Identity", desc: "Complete secure identity verification process" },
              { step: "03", title: "Cast Your Vote", desc: "Select your candidate and submit your encrypted vote" },
              { step: "04", title: "Track & Verify", desc: "Monitor your vote on the blockchain in real-time" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-gray-400">Your votes are protected by multiple layers of advanced security</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Cryptographic Security</h3>
              <p className="text-gray-400">Advanced encryption algorithms ensure your vote remains secure and unreadable during transmission and storage.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Key className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Private Key Protection</h3>
              <p className="text-gray-400">Your private keys are stored securely and never exposed. Only you have access to cast your vote.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Fingerprint className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Identity Verification</h3>
              <p className="text-gray-400">Multi-factor authentication and biometric verification prevent unauthorized access and voting fraud.</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-green-500 to-teal-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Zero-Knowledge Proofs</h3>
              <p className="text-gray-400">Verify your vote was counted without revealing your choice, ensuring both privacy and transparency.</p>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Immutable Blockchain</h3>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Every vote is recorded on an immutable blockchain ledger. Once a vote is cast, it cannot be altered, deleted, or tampered with by anyone.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Distributed across thousands of nodes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Cryptographically verified transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Public audit trail for transparency</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">End-to-End Encryption</h3>
              </div>
              <p className="text-gray-300 text-lg mb-4">
                Military-grade encryption protects your vote from the moment it's cast until it's permanently recorded on the blockchain.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>AES-256 encryption standard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Secure key management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Protected data transmission</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About CG-Ballotchain</h2>
            <p className="text-xl text-gray-400">Pioneering the future of democratic participation through blockchain innovation</p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To revolutionize the democratic process by providing a secure, transparent, and accessible voting platform that empowers citizens worldwide. We believe every vote should count and every voice should be heard without compromise.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To become the global standard for digital voting, making secure and transparent elections accessible to everyone. We envision a world where trust in electoral systems is restored through technology that guarantees integrity and accessibility.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Our Core Values</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Trust & Integrity</h4>
                <p className="text-gray-400">
                  We build systems with unwavering commitment to security and honesty, ensuring every vote is protected and every result is verifiable.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Transparency</h4>
                <p className="text-gray-400">
                  Every process is open for scrutiny while maintaining voter privacy. We believe transparency builds trust and strengthens democracy.
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Accessibility</h4>
                <p className="text-gray-400">
                  Voting should be accessible to everyone, regardless of location or circumstance. We're committed to breaking down barriers to participation.
                </p>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-10 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                  <span className="text-blue-400 text-sm font-medium">Our Story</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Building the Future of Democracy</h3>
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  CG-Ballotchain was born from a simple yet powerful idea: democracy should be as secure and transparent as blockchain technology allows. In an era where trust in electoral systems is paramount, we've harnessed the power of decentralized technology to create a voting platform that's both secure and accessible.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our team of blockchain experts, security specialists, and democracy advocates came together to solve one of society's most critical challenges—ensuring that every vote is counted, verified, and protected from tampering.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">2023</div>
                  <div className="text-gray-400">Founded</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-gray-400">Countries</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-gray-400">Open Source</div>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Highlights */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white text-center mb-12">Powered by Innovation</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Real-time processing" },
                { icon: Shield, title: "Bank-Level Security", desc: "Military-grade encryption" },
                { icon: Award, title: "Certified", desc: "Industry standards compliant" },
                { icon: Users, title: "Scalable", desc: "Millions of votes supported" }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/40 transition">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Democracy?</h2>
              <p className="text-xl text-blue-100 mb-8">Join thousands using blockchain technology for secure voting</p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-xl">
                Start Voting Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-blue-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                  <Vote className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">CG-Ballotchain</span>
              </div>
              <p className="text-gray-400">Revolutionizing democracy through blockchain technology.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 CG-Ballotchain. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Discord</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}