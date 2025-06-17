import { useState } from "react";
import { FaGithub, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "dotenv";
import { useAuth } from "../context/authContext";

function Login() {
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const auth = useAuth();
    if (!auth) {
        // Handle the case when auth context is not available
        return <div>Loading authentication...</div>;
    }
    const {login}=auth;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { email, password }
        setIsLoading(true)
        const response = await axios.post(`${BACKEND_URL}/auth/login`, formData)
        if (response.status === 200) {
            setIsLoading(false)
            // Assuming the backend returns user data in response.data.user
            login(response.data.user)
            navigate("/dashboard", { state: { response } })
            return
        }
        console.log("error message")
        setIsLoading(false)

    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
            {/* Main Login Container */}
            <div className="w-full max-w-sm">
                {/* GitHub Logo */}
                <div className="flex justify-center mb-8">
                    <FaGithub className="w-12 h-12 text-white" />
                </div>

                {/* Login Form */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
                    <h1 className="text-2xl font-light text-white text-center mb-6">
                        Sign in to GitHub
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username/Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username or email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your username or email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                                    ) : (
                                        <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-2.5 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-3 h-4 w-4 text-white" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>

                {/* Sign Up Link */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        New to GitHub?{" "}
                        <a
                            href="/registration"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                        >
                            Create an account
                        </a>
                    </p>
                </div>

                {/* Terms and Privacy */}
                <div className="mt-8 text-center text-xs text-gray-500 space-x-4">
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">
                        Terms
                    </a>
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">
                        Privacy
                    </a>
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">
                        Security
                    </a>
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">
                        Contact GitHub
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;