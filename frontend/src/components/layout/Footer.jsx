import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';

function Footer({ navigate }) {
    return (
        <footer className="bg-[#f5f4f0] text-black pt-16 pb-8 px-24 max-lg:px-12 max-md:px-6 max-sm:px-4 flex justify-center box-border font-sans">
            <div className="w-full max-w-[1200px] flex flex-col gap-12">

                {/* Upper Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] gap-12 items-start w-full">

                    {/* Left Column: Branding & Newsletter */}
                    <div className="flex flex-col gap-8 max-w-[400px]">
                        <div className="flex flex-col gap-2">
                            <h2 
                                className="text-[2.2rem] font-bold italic tracking-tight m-0 cursor-pointer"
                                onClick={() => navigate?.('home')}
                            >
                                ClearDent
                            </h2>
                            <p className="text-black/60 text-[0.88rem] leading-relaxed m-0">
                                Trusted Dental Care for a Lifetime of Healthy Smiles
                            </p>
                        </div>

                        {/* Newsletter Block */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[1rem] font-semibold m-0 text-black/90">
                                Subscribe to our Newsletter
                            </h4>
                            <div className="flex items-center border-b border-black/20 pb-2 w-full max-w-[320px]">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="bg-transparent border-none outline-none text-black text-[0.85rem] placeholder-black/40 w-full pr-4"
                                />
                                <button className="w-8 h-8 rounded-lg bg-black/15 text-black border-none flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors shrink-0">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns Grid & Giant Wordmark */}
                    <div className="flex flex-col gap-12 w-full">
                        {/* 3 Columns Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                            {/* Service Column */}
                            <div className="flex flex-col gap-4">
                                <h5 className="text-[0.78rem] font-bold text-black/50 uppercase tracking-widest m-0">Service</h5>
                                <div className="flex flex-col gap-2.5 text-[0.85rem] text-black/70">
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Cavity</span>
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Dental clinic</span>
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Orthodontics</span>
                                    <span onClick={() => navigate?.('booking')} className="hover:text-black cursor-pointer transition-colors">Payments</span>
                                </div>
                            </div>

                            {/* Quick Link Column */}
                            <div className="flex flex-col gap-4">
                                <h5 className="text-[0.78rem] font-bold text-black/50 uppercase tracking-widest m-0">Quick Link</h5>
                                <div className="flex flex-col gap-2.5 text-[0.85rem] text-black/70">
                                    <span 
                                        onClick={() => {
                                            if (navigate) {
                                                navigate('home');
                                                setTimeout(() => {
                                                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                                                }, 100);
                                            }
                                        }} 
                                        className="hover:text-black cursor-pointer transition-colors"
                                    >
                                        FAQs
                                    </span>
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Terms & Conditions</span>
                                    <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Refund Policy</span>
                                </div>
                            </div>

                            {/* Contact Column */}
                            <div className="flex flex-col gap-4">
                                <h5 className="text-[0.78rem] font-bold text-black/50 uppercase tracking-widest m-0">Contact</h5>
                                <div className="flex flex-col gap-3 text-[0.85rem] text-black/70">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-black/60" />
                                        <a href="mailto:info@cleardent.com" className="hover:text-black text-black/70 no-underline transition-colors">
                                            info@cleardent.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-black/60" />
                                        <span className="hover:text-black transition-colors cursor-pointer">
                                            +1 (212) 555-7483
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Large Wordmark Overlay matching layout */}
                        <div className="flex justify-end select-none mt-4 max-sm:justify-center">
                            <h1 className="text-[7rem] max-lg:text-[5.5rem] max-md:text-[4rem] max-sm:text-[3rem] font-black italic text-white/[0.04] m-0 leading-none tracking-tighter">
                                ClearDent
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Bottom Row Separator */}
                <div className="h-[1px] bg-black/10 w-full" />

                {/* Bottom Metadata Row */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[0.75rem] text-black/45 w-full">
                    {/* Legal Links */}
                    <div className="flex gap-4.5 flex-wrap max-sm:justify-center">
                        <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Terms</span>
                        <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                        <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Cookies</span>
                        <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Legal</span>
                        <span onClick={() => navigate?.('services')} className="hover:text-black cursor-pointer transition-colors">Recalls</span>
                    </div>

                    {/* Copyright statement */}
                    <div className="text-center font-medium">
                        &copy; {new Date().getFullYear()} ClearDent. All Rights Reserved.
                    </div>

                    {/* Social networks icons */}
                    <div className="flex gap-3 items-center">
                        <a href="https://youtube.com" className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 text-black/60 hover:text-black flex items-center justify-center transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                        </a>
                        <a href="https://linkedin.com" className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 text-black/60 hover:text-black flex items-center justify-center transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        <a href="https://instagram.com" className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 text-black/60 hover:text-black flex items-center justify-center transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                        </a>
                        <a href="https://facebook.com" className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/15 text-black/60 hover:text-black flex items-center justify-center transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
