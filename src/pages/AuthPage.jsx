import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api';
import growthImg from '../assets/growth.svg';
import collaboratehImg from '../assets/collaborate.svg';
import starImg from '../assets/star.svg';
import google from '../assets/google.svg';
import linkedin from '../assets/linkedin.svg'

export const AuthPage = () => {
    const navigate = useNavigate();
    const { authenticated } = useAuth();
    const [step, setStep] = useState("login");

    //handle form data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_agree_terms: false,
    });
    const [error, setError] = useState({
        password: '',
        password_confirmation: '',
        validation: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    //handle perubahan
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({
            password: '',
            password_confirmation: '',
            validation: '',
        });
        if (step === "register") {
            if(formData.password.length<8) {
                setError(prev => ({
                    ...prev,
                    password: 'Password less than 8 character'
                }));
                return;
            }

            if(formData.password_confirmation.length<8) {
                setError(prev => ({
                    ...prev,
                    password_confirmation: 'Password Confirmation less than 8 character'
                }));
                return;
            }

            if (formData.password !== formData.password_confirmation) {
                setError(prev => ({
                    ...prev,
                    password_confirmation: 'Password do not match'
                }));
                return;
            }
        }

        setIsLoading(true);

        if(step === "login") {
            try {
                const response = await authAPI.login(formData);
                const { user, token } = response.data.data;
                authenticated(user, token);
                navigate('/');
            } catch (err) {
                setError({
                    validation: err.response?.data?.message || 'Login failed. Please try again.'});
                    console.log(err.response.data);
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const response = await authAPI.register(formData);
                const { user, token } = response.data.data;
                console.log(response.data);
                authenticated(user, token);
                navigate('/');
            } catch (err) {
                setError({
                    validation:err.response?.data?.message || 'Registration failed. Please try again.'
                });
                console.log(err.response.data);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="p-9 h-screen">
            <div className="h-[90%] text-olive-50 flex flex-row justify-center items-center basis-1/4 bg-[#262525] rounded-lg min-h-full">
                <div className="flex flex-col justify-center items-start px-12 gap-2">
                    <h2 className="font-bold text-3xl">Elevate Your Business with GrowBusiness</h2>
                    <p>Manage your entire operation from a single, powerful dashboard designed for growth.</p>
                    <div className="flex flex-row gap-2">
                        <img src={growthImg} alt="growth" className="max-w-[30px] max-h-[30px]"/>
                        <span>Average profit increased by 38% in 3 months</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <img src={collaboratehImg} alt="collaborate" className="max-w-[30px] max-h-[30px]"/>
                        <span>12,400+ MSMEs (Micro, Small, and Medium Enterprises) have joined</span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <img src={starImg} alt="star" className="max-w-[30px] max-h-[30px]"/>
                        <span>4.9/5 rating from active users</span>
                    </div>
                </div>
                {/* form */}
                <div className="py-10 px-8 text-olive-50 basis-3/4 bg-[#4E4D4D] rounded-lg min-h-full max-h-full flex flex-col gap-3">
                    {/* button */}
                    <div className="relative flex w-[220px] bg-[#4E4D4D] rounded-full p-1 outline-1 outline-white">
                        <div
                            className={`
                                absolute top-1 left-1
                                w-[106px] h-[40px]
                                bg-[#272727] rounded-full
                                transition-all duration-300
                                ${step === "register" ? "translate-x-[110px]" : ""}
                            `}
                        />
                        <button
                            onClick={() => setStep("login")}
                            className="relative z-10 w-1/2 py-2 text-white cursor-pointer font-medium">
                            Login
                        </button>

                        <button
                            onClick={() => setStep("register")}
                            className="relative z-10 w-1/2 py-2 text-white cursor-pointer font-medium">
                            Register
                        </button>
                    </div>
                    {/* 3rd party */}
                    <div className="flex gap-2">
                        <div className="flex basis-full flex-row outline-1 outline-white rounded-lg px-10 py-2 gap-4 justify-center items-center cursor-pointer">
                            <img src={google} alt="google" className="max-w-[40px] max-h-[40px]"/>
                            <span>Continue with Google</span>
                        </div>
                        <div className="flex basis-full flex-row outline-1 outline-white rounded-lg px-10 py-2 gap-4 justify-center items-center cursor-pointer">
                            <img src={linkedin} alt="linkedin" className="max-w-[40px] max-h-[40px]"/>
                            <span>Continue with LinkedIn</span>
                        </div>
                    </div>
                    {/* break */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-400"></div>

                        <span className="text-sm text-gray-400">
                            or with email
                        </span>

                        <div className="flex-1 h-px bg-gray-400"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {step === "login" ? (
                            // login
                            <form className="flex flex-col gap-4"
                            onSubmit={handleSubmit}>
                                <label className="block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    placeholder="Grow@Bussiness.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="p-3 rounded-lg outline-1 outline-white"/>
                                <label className="block text-sm font-semibold">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="p-3 rounded-lg bg-transparent outline-1 outline-white"/>
                                    {error.password && <p className="text-red-500">{error.password}</p>}
                                <button
                                    type="submit"
                                    className="bg-black py-3 rounded-lg font-semibold">
                                    Login
                                </button>
                            </form>
                        ) : (
                            // register
                            <form 
                            className="flex flex-col gap-2"
                            onSubmit={handleSubmit}>
                                <div className="flex flex-row gap-2">
                                    <div className="flex flex-col basis-full gap-2">
                                        <label className="block text-sm font-semibold">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            name="first_name"
                                            required
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="p-3 rounded-lg outline-1 outline-white"/>
                                    </div>
                                    <div className="flex flex-col basis-full gap-2">
                                        <label className="block text-sm font-semibold">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            required
                                            className="p-3 rounded-lg outline-1 outline-white"/>
                                    </div>
                                </div>
                                <label className="block text-sm font-semibold">Email</label>
                                <input
                                    type="email"
                                    placeholder="Grow@Bussiness.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="p-3 rounded-lg outline-1 outline-white"/>
                                <label className="block text-sm font-semibold">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="p-3 rounded-lg bg-transparent outline-1 outline-white"/>
                                    {error.password && <p className="text-red-500">{error.password}</p>}
                                <label className="block text-sm font-semibold">Password Confirmation</label>
                                <input
                                    type="password"
                                    placeholder="Password Confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    required
                                    className="p-3 rounded-lg outline-1 outline-white"/>
                                    {error.password_confirmation && <p className="text-red-500">{error.password_confirmation}</p>}
                                <div>
                                    <input
                                    type="checkbox"
                                    name="is_agree_terms"
                                    checked={formData.is_agree_terms}
                                    required
                                    onChange={handleInputChange}/>
                                    <label> I agree to the terms & conditions and GrowBusiness privacy policy</label>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-black py-3 rounded-lg font-semibold cursor-pointer"
                                    disabled={isLoading}>
                                    {isLoading ? 'Registering...' : 'Create Free Account'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}