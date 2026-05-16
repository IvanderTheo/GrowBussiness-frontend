import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api';

import ovalOrange from '../assets/oval-orange.svg';
import ovalPurple from '../assets/oval-purple.svg';
import ovalBlue from '../assets/oval-blue.svg';
import frame1 from '../assets/frame-1.png';
import frame2 from '../assets/frame-2.png';
import frame3 from '../assets/frame-3.png';
import frame4 from '../assets/frame-4.png';

export const LandingPage = () => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();



    // slide content
    const slides = [frame1, frame2, frame3, frame4,frame1, frame2, frame3, frame4,frame1, frame2, frame3, frame4];
    const infiniteSlides = [...slides, ...slides];
    const [translate, setTranslate] = useState(0);
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTranslate((prev) => {
                if (prev >= slides.length * 220) {
                    return 0;
                }

                return prev + 1;
            });
        }, 16);

        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            {/* home */}
            <section id="home" className="overflow-hidden scroll-mt-[10vh]">
                <div className="flex flex-col justify-center items-center relative w-full h-screen">
                    {/* FULL BACKGROUND */}
                    <div>
                        <div className="absolute inset-0 max-h-[60vh]">
                            {/* BLUE */}
                            <img
                                src={ovalBlue}
                                alt="blue"
                                className="
                                    absolute
                                    left-20
                                    top-1/2
                                    -translate-y-1/2
                                    w-[300px]
                                    opacity-40
                                "/>
                            {/* ORANGE */}
                            <img
                                src={ovalOrange}
                                alt="orange"
                                className="
                                    absolute
                                    top-0
                                    right-0
                                    w-[150px]
                                    opacity-30
                                "/>
                            {/* PURPLE */}
                            <img
                                src={ovalPurple}
                                alt="purple"
                                className="
                                    absolute
                                    bottom-0
                                    right-20
                                    w-[200px]
                                    opacity-30
                                "/>

                            {/* GLOBAL BLUR */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gray-200/20
                                    blur-[600px]
                                    max-h-[40vh]
                                "/>
                        </div>
                    </div>

                    {/* CONTENT */}
                    <div
                        className="
                            relative
                            z-10
                            h-full
                            flex
                            flex-col
                            justify-center
                            items-center
                            max-h-[60vh]
                        ">
                        <div className="text-white flex flex-col justify-center items-center px-[60vh] gap-5">
                            <h3 className="font-extrabold text-[5vh] text-center">Grow your business with data-driven decisions</h3>
                            <p className="font-sm text-[2vh] text-center">A modular business management platform featuring AI insights, HPP calculators, smart scheduling, and community forums all in one seamless ecosystem.</p>
                            <div className="flex flex-row gap-5 w-full">
                                <button className="outline-1 outline-white rounded-lg p-4 w-full">Get Started for Free →</button>
                                <button className="outline-1 outline-white rounded-lg p-4 w-full">▷ Watch Demo</button>
                            </div>
                            <p className="text-gray-400">No credit card required · Free to use · Sign in for premium features</p>
                        </div>
                    </div>
                    {/* information */}
                    <div className="flex flex-row min-w-full gap-10 items-center p-10">
                        <div className="bg-[#262525] w-full text-white outline-1 outline-white rounded-lg px-12 py-5 flex justify-center items-center flex-col">
                            <p className="font-extrabold text-[5vh] text-center">12.400+</p>
                            <p className="font-bold text-[2vh] text-center">Active Users</p>
                        </div>
                        <div className="bg-[#262525] w-full text-white outline-1 outline-white rounded-lg px-12 py-5 flex justify-center items-center flex-col">
                            <p className="font-extrabold text-[5vh] text-center">89.300</p>
                            <p className="font-bold text-[2vh] text-center">COGS Calculations</p>
                        </div>
                        <div className="bg-[#262525] w-full text-white outline-1 outline-white rounded-lg px-12 py-5 flex justify-center items-center flex-col">
                            <p className="font-extrabold text-[5vh] text-center">34.700</p>
                            <p className="font-bold text-[2vh] text-center">Forum Discussions</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* about */}
            <section id="about" className="p-10 overflow-hidden scroll-mt-[12vh] min-h-screen">
                <div className="flex flex-row justify-center items-center">
                    <div className="basis-2/5">
                        <img/>
                    </div>
                    <div className="gap-12 basis-3/5 flex flex-col justify-center items-center text-white">
                        <span className="text-2xl"><h1 className="text-7xl"><strong>GrowBussiness</strong></h1> is building the ultimate platform for local bussiness. <span className="text-gray-500">We power billions of calculations and AI interactions to keep your business ahead of the curve.</span></span>
                        <div className="flex flex-col justify-end">
                            <h2 className="text-xl"><strong>Team Japung</strong></h2>
                            <span className="text-gray-500">CO-founder of GrowBusiness</span>
                        </div>
                    </div>
                </div>
            </section>
            {/* feature */}
            <section id="service" className="p-16 overflow-hidden scroll-mt-[12vh] min-h-screen">
                <div className="flex flex-col justify-center items-center gap-16">
                    <h2 className="text-5xl text-white"><strong>Our Service</strong></h2>
                    <div className="grid grid-cols-2 text-white gap-5">
                        <Link to="/ai">
                            <div className="cursor-pointer bg-[#262525] outline-1 outline-white rounded-2xl p-10">
                                <h3 className="text-2xl font-bold">Ai Consultan</h3>
                                <p>Intelligent LLM-based virtual assistant for real-time, data-driven business decisions</p>
                            </div>
                        </Link>
                        <Link to="/cogs-calculator">
                            <div className="cursor-pointer bg-[#262525] outline-1 outline-white rounded-2xl p-10">
                                <h3 className="text-2xl font-bold">COGS Calculator</h3>
                                <p>Instantly calculate Cost of Goods Sold and profit margins without pressing a calculate button</p>
                            </div>
                        </Link>
                        <Link to="/schedule">
                            <div className="cursor-pointerr bg-[#262525] outline-1 outline-white rounded-2xl p-10">
                                <h3 className="text-2xl font-bold">Schedule Management</h3>
                                <p>Manage operational schedules with statecharts, visual history, and drag-and-drop calendar functionality</p>
                            </div>
                        </Link>
                        <Link to="/forum">
                            <div className="cursor-pointer bg-[#262525] outline-1 outline-white rounded-2xl p-10">
                                <h3 className="text-2xl font-bold">Forum Chat</h3>
                                <p>A discussion space for entrepreneurs featuring push notifications and optimistic UI updates</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
            {/* bottom */}
            <section className="overflow-hidden h-[60vh] scroll-mt-[12vh]">
                <div className="flex flex-col">
                    <div className="p-16">
                        <h3 className="text-5xl text-end text-white"><strong>Lets Grow Business Together</strong></h3>
                    </div>
                    <div>
                        <div className="relative w-full overflow-hidden rounded-2xl">
                        {/* Wrapper */}
                            <div
                                className="
                                    flex
                                    transition-transform
                                    duration-700
                                    ease-in-out"
                                    style={{
                                    transform: `translateX(-${current * 100}%)`,
                                }}>
                                {slides.map((slide, index) => (
                                <img
                                    key={index}
                                    src={slide}
                                    alt={`slide-${index}`}
                                    className="
                                    h-[200px]
                                    object-cover
                                    flex-shrink-0"/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}