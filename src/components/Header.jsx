import { Link, useNavigate, useLocation } from 'react-router-dom'
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import google from '../assets/google.svg'

export const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation()
    const isLandingPage = location.pathname === "/"

    const handleLogout = () => {
    logout();
    navigate('/');
    };

    return (
        <header className="bg-olive-950 z-50 sticky top-0 w-full">
            <div className="flex justify-between items-center px-5 md:px-6 py-3 md:py-4">
                {/* logo */}
                <div>
                    <img src={google} alt="Logo" className="h-8 w-auto flex-shrink-0" />
                </div>
                {/* nav */}
                <nav className='hidden md:flex justify-center items-center gap-8'>
                    {isLandingPage ? (
                        <a className='text-olive-50 font-semibold' href="#home">Home</a>
                    ) : (
                        <Link to='/' className='text-olive-50 font-semibold'>Home</Link>
                    )}
                    {isLandingPage ? (
                        <a className='text-olive-50 font-semibold' href="#about">About</a>
                    ) : (
                        <Link to='/' className='text-olive-50 font-semibold'>About</Link>
                    )}
                    {isLandingPage ? (
                        <a
                            className='text-olive-50 font-semibold'
                            href="#service"
                        >
                            Service
                        </a>
                    ) : (
                        <div className="relative group">
                            <button className="text-olive-50 font-semibold">
                                Service
                            </button>

                            <div className="
                                absolute
                                top-full
                                left-0
                                p-2
                                hidden
                                group-hover:block
                                bg-white
                                rounded-lg
                                shadow-lg
                                min-w-[180px]
                                z-50
                            ">
                                <Link
                                    to="/ai"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    AI Consultant
                                </Link>

                                <Link
                                    to="/cogs-calculator"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    COGS Calculator
                                </Link>

                                <Link
                                    to="/schedule"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Schedule
                                </Link>
                                <Link
                                    to="/forum"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Forum
                                </Link>
                            </div>
                        </div>
                    )}
                    {isLandingPage ?(
                        <a className='text-olive-50 font-semibold' href="#footer">Contact</a>
                    ):(
                        <Link to='/' className='text-olive-50 font-semibold'>Contact</Link>
                    )}
                </nav>
                {/* login */}
                {isAuthenticated ? (
                    <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded-md hover:bg-red-600 transition">
                        Logout
                    </button>
                ) : (
                    <Link to="/login"
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Login
                    </Link>
                )}
            </div>
        </header>
    )
}