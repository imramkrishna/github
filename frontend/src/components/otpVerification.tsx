import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/authContext";

// Define interface for location state
interface LocationState {
    userData: {};
    email?: string;
}

// Define interface for API error response
interface ApiErrorResponse {
    message?: string;
}

function OtpVerification(): ReactElement {
    const auth=useAuth();
    if(!auth){
        return <div>Loading authentication.</div>
    }
    const navigate = useNavigate();
    const location = useLocation() as { state: LocationState };
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
    const {login}=auth;
    // Get email from navigation state
    const email: string = location.state?.email || "";
    const userData=location.state?.userData;
    console.log("UserData: ",userData)
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes

    // Refs for input fields
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer countdown
    useEffect((): (() => void) | undefined => {
        if (timeLeft > 0) {
            const timer: number = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    // Auto-focus first input on mount
    useEffect((): void => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Redirect if no email provided
    useEffect((): void => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleInputChange = (index: number, value: string): void => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp: string[] = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Focus previous input on backspace
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const pastedData: string = e.clipboardData.getData("text");
        const pastedOtp: string[] = pastedData.replace(/\D/g, "").split("").slice(0, 6);

        const newOtp: string[] = [...otp];
        pastedOtp.forEach((digit: string, index: number) => {
            if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);

        // Focus the next empty input or the last one
        const nextEmptyIndex: number = newOtp.findIndex((digit: string) => !digit);
        const focusIndex: number = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const otpValue: string = otp.join("");

        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/verify`, {
                email,
                value: otpValue,
                userData:userData
            });

            if (response.status === 200) {
                setSuccess("Email verified successfully!");
                login({ email })
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            }
        } catch (error) {
            console.error("Verification error:", error);
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError(axiosError.response?.data?.message || "Invalid verification code");
            // Clear OTP on error
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async (): Promise<void> => {
        setIsResending(true);
        setError("");

        try {
            // Call your resend OTP endpoint
            await axios.post(`${BACKEND_URL}/auth/resend-otp`, { email });
            setSuccess("Verification code sent!");
            setTimeLeft(300); // Reset timer
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            setError(axiosError.response?.data?.message || "Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins: number = Math.floor(seconds / 60);
        const secs: number = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* GitHub Logo */}
                <div className="flex justify-center mb-8">
                    <FaGithub className="w-12 h-12 text-white" />
                </div>

                {/* Verification Form */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 sm:p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-light text-white mb-2">
                            Verify your email
                        </h1>
                        <p className="text-gray-400 text-sm">
                            We sent a 6-digit code to
                        </p>
                        <p className="text-blue-400 text-sm font-medium">
                            {email}
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-md mb-4 text-sm flex items-center">
                            <HiCheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-4 text-sm flex items-center">
                            <HiXCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* OTP Input Fields */}
                        <div className="flex justify-center space-x-3 mb-6">
                            {otp.map((digit: string, index: number) => (
                                <input
                                    key={index}
                                    ref={(el: HTMLInputElement | null) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange(index, e.target.value)
                                    }
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                        handleKeyDown(index, e)
                                    }
                                    onPaste={handlePaste}
                                    className="w-12 h-12 text-center text-xl font-semibold bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>

                        {/* Timer */}
                        <div className="text-center mb-4">
                            <p className="text-gray-400 text-sm">
                                Code expires in{" "}
                                <span className={`font-medium ${timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || otp.some((digit: string) => !digit)}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base mb-4"
                        >
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-3 h-4 w-4 text-white" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify email"
                            )}
                        </button>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-gray-400 text-sm mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                                className="text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-medium transition-colors duration-200"
                            >
                                {isResending ? (
                                    <span className="flex items-center justify-center">
                                        <AiOutlineLoading3Quarters className="animate-spin mr-2 h-3 w-3" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Resend code"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Back to Registration */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/register")}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-200"
                    >
                        ← Back to registration
                    </button>
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

export default OtpVerification;