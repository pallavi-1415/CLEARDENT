import React, { useState } from 'react';
import { LogOut, ChevronUp, ChevronDown, User, Calendar, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';

function Navbar({ activeTab, setActiveTab, isLoggedIn, onLogout, currentUser, navigate, setPortalSubTab }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const userInitials = currentUser && currentUser.name
        ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    const [logoutConfirm, setLogoutConfirm] = useState({ isOpen: false });

    const handleLogoutClick = () => {
        setLogoutConfirm({ isOpen: true });
    };

    const confirmLogout = () => {
        if (onLogout) {
            onLogout();
        }
        if (setActiveTab) setActiveTab('website');
        navigate('home');
        setLogoutConfirm({ isOpen: false });
    };

    const cancelLogout = () => {
        setLogoutConfirm({ isOpen: false });
    };

    return (
        <header className="sticky top-0 z-50 bg-[#f8fafc] border-b border-slate-200/50 flex justify-between items-center transition-all duration-200 px-24 py-6 max-lg:px-12 max-lg:py-[1.2rem] max-md:px-6 max-md:py-4 max-sm:px-4 max-sm:py-[0.9rem]">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { if (setActiveTab) setActiveTab('website'); navigate('home'); }}>
                <div className="w-8 h-8 rounded-[8px] bg-gold flex items-center justify-center text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="M12 6a3.5 3.5 0 0 0-3.5 3.5c0 3.5 3.5 6.5 3.5 6.5s3.5-3 3.5-6.5A3.5 3.5 0 0 0 12 6z" />
                    </svg>
                </div>
                <span className="font-sans text-[1.4rem] font-semibold text-text-primary tracking-[-0.02em]">
                    <span className="font-normal">Clear</span>Dent
                </span>
            </div>

            {/* Center Links */}
            {activeTab === 'website' && (
                <nav className="hidden md:flex items-center gap-10">
                    <span
                        onClick={() => navigate('services')}
                        className="no-underline text-text-secondary text-[0.95rem] font-medium transition-colors duration-200 hover:text-gold font-sans cursor-pointer"
                    >
                        Services
                    </span>
                    <span
                        onClick={() => navigate('doctors')}
                        className="no-underline text-text-secondary text-[0.95rem] font-medium transition-colors duration-200 hover:text-gold font-sans cursor-pointer"
                    >
                        Our Doctors
                    </span>
                    <span
                        onClick={() => navigate('faq')}
                        className="no-underline text-text-secondary text-[0.95rem] font-medium transition-colors duration-200 hover:text-gold font-sans cursor-pointer"
                    >
                        FAQ
                    </span>
                </nav>
            )}

            {/* Right Section: Login / Logout */}
            <div className="flex items-center gap-4">
                {!isLoggedIn ? (
                    <div className="hidden md:flex gap-3 items-center">
                        <Button
                            onClick={() => navigate('login')}
                            variant="primary"
                            className="px-5 py-2.5 text-[0.85rem]"
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => navigate('signup')}
                            variant="outline"
                            className="px-5 py-2.5 text-[0.85rem]"
                        >
                            Sign Up
                        </Button>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Dropdown Toggle Trigger - shows "Account" */}
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="bg-none border-none cursor-pointer flex items-center gap-2.5 text-text-primary text-[0.9rem] font-medium px-3 py-1.5 rounded-full bg-[#f1f5f9] transition-all duration-200 hover:bg-[#e2e8f0] font-sans"
                        >
                            <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-semibold text-[0.85rem]">
                                {userInitials}
                            </div>
                            <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                                Account
                            </span>
                            {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <>
                                {/* Invisible backdrop */}
                                <div
                                    onClick={() => setDropdownOpen(false)}
                                    className="fixed inset-0 z-[998] bg-transparent"
                                />
                                <div className="absolute right-0 top-[calc(100%+8px)] w-[210px] bg-white rounded-[12px] shadow-[0_10px_25px_rgba(15,23,42,0.08)] border border-slate-200/50 p-2 flex flex-col gap-1 z-[999] animate-fade-in">
                                    {currentUser?.role === 'admin' ? (
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate('admin-dashboard');
                                            }}
                                            className="flex items-center gap-2.5 p-3 rounded-[8px] border-none bg-none text-text-secondary text-[0.88rem] font-medium text-left cursor-pointer w-full transition-all duration-200 hover:bg-slate-100 hover:text-gold font-sans"
                                        >
                                            <User size={16} />
                                            <span>Admin Dashboard</span>
                                        </button>
                                    ) : currentUser?.role === 'doctor' ? (
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                navigate('doctor-dashboard');
                                            }}
                                            className="flex items-center gap-2.5 p-3 rounded-[8px] border-none bg-none text-text-secondary text-[0.88rem] font-medium text-left cursor-pointer w-full transition-all duration-200 hover:bg-slate-100 hover:text-gold font-sans"
                                        >
                                            <User size={16} />
                                            <span>Doctor Workspace</span>
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => {
                                                    if (setActiveTab) setActiveTab('portal');
                                                    if (setPortalSubTab) setPortalSubTab('profile');
                                                    setDropdownOpen(false);
                                                    navigate('home');
                                                }}
                                                className="flex items-center gap-2.5 p-3 rounded-[8px] border-none bg-none text-text-secondary text-[0.88rem] font-medium text-left cursor-pointer w-full transition-all duration-200 hover:bg-slate-100 hover:text-gold font-sans"
                                            >
                                                <User size={16} />
                                                <span>Profile</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (setActiveTab) setActiveTab('portal');
                                                    if (setPortalSubTab) setPortalSubTab('appointments');
                                                    setDropdownOpen(false);
                                                    navigate('home');
                                                }}
                                                className="flex items-center gap-2.5 p-3 rounded-[8px] border-none bg-none text-text-secondary text-[0.88rem] font-medium text-left cursor-pointer w-full transition-all duration-200 hover:bg-slate-100 hover:text-gold font-sans"
                                            >
                                                <Calendar size={16} />
                                                <span>Appointment History</span>
                                            </button>
                                        </>
                                    )}

                                    <div className="h-[1px] bg-slate-100 my-1" />

                                    <button
                                        onClick={() => {
                                            handleLogoutClick();
                                            setDropdownOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 p-3 rounded-[8px] border-none bg-none text-red-500 text-[0.88rem] font-medium text-left cursor-pointer w-full transition-all duration-200 hover:bg-red-50 font-sans"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {/* Mobile Menu Hamburger Button */}
                {activeTab === 'website' && (
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2.5 text-text-primary hover:text-gold bg-white hover:bg-slate-50 border border-slate-200/85 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center shrink-0"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                )}
            </div>
            <ConfirmModal
                isOpen={logoutConfirm.isOpen}
                title="Logout Confirmation"
                message="Are you sure you want to logout?"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
                confirmText="Yes, Logout"
                cancelText="Cancel"
            />

            {/* Collapsible Mobile Menu Drawer */}
            {activeTab === 'website' && mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 top-[72px] z-[40] bg-slate-900/20 backdrop-blur-xs md:hidden"
                    />
                    <div className="absolute top-[100%] left-0 right-0 bg-[#f8fafc] border-b border-slate-200 p-6 flex flex-col gap-5 md:hidden z-[49] animate-fade-in shadow-lg">
                        <nav className="flex flex-col gap-4">
                            <span
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('services');
                                }}
                                className="text-text-primary text-[1.1rem] font-medium py-2 hover:text-gold transition-colors font-sans cursor-pointer text-left"
                            >
                                Services
                            </span>
                            <span
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('doctors');
                                }}
                                className="text-text-primary text-[1.1rem] font-medium py-2 hover:text-gold transition-colors font-sans cursor-pointer text-left"
                            >
                                Our Doctors
                            </span>
                            <span
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate('faq');
                                }}
                                className="text-text-primary text-[1.1rem] font-medium py-2 hover:text-gold transition-colors font-sans cursor-pointer text-left"
                            >
                                FAQ
                            </span>
                        </nav>

                        {!isLoggedIn && (
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate('login');
                                    }}
                                    variant="primary"
                                    className="w-full py-3 text-[0.95rem] justify-center"
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        navigate('signup');
                                    }}
                                    variant="outline"
                                    className="w-full py-3 text-[0.95rem] justify-center bg-white"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </header>
    );
}

export default Navbar;
