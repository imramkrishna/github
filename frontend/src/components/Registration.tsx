import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import axios from "axios";

function Registration() {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation
  const validatePassword = (password:string) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== "";
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch || !isPasswordValid) {
      setError("Please ensure all password requirements are met");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }).then(response=>{
        navigate("/verification", { state: { email: formData.email } });
      })
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Main Registration Container */}
      <div className="w-full max-w-md">
        {/* GitHub Logo */}
        <div className="flex justify-center mb-8">
          <FaGithub className="w-12 h-12 text-white" />
        </div>

        {/* Registration Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 sm:p-8">
          <h1 className="text-2xl font-light text-white text-center mb-2">
            Join GitHub
          </h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            Create your account
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter a username"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This will be your username on GitHub
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Create a password"
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
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    {passwordRequirements.length ? (
                      <HiCheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <HiXCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordRequirements.length ? 'text-green-500' : 'text-red-500'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordRequirements.lowercase ? (
                      <HiCheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <HiXCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordRequirements.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                      At least one lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordRequirements.uppercase ? (
                      <HiCheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <HiXCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordRequirements.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {passwordRequirements.number ? (
                      <HiCheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <HiXCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordRequirements.number ? 'text-green-500' : 'text-red-500'}`}>
                      At least one number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors duration-200" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    {passwordsMatch ? (
                      <HiCheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <HiXCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Privacy Notice */}
            <div className="text-xs text-gray-400 py-2 leading-relaxed">
              By creating an account, you agree to the{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                Terms of Service
              </a>
              {" "}and{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </a>
              .
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordsMatch || !isPasswordValid}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-3 h-4 w-4 text-white" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Terms and Privacy Links */}
        <div className="mt-8 text-center text-xs text-gray-500 flex flex-wrap justify-center gap-4">
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

export default Registration;