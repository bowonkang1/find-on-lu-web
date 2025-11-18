import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../lib/supabase";

interface LoginFormProps {
  onLogin: (email: string) => void;
} //receives a function called onLogin from its parent component

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState(""); //Stores the current text in the email input fields(user input)
  const [password, setPassword] = useState(""); //Stores the current text in the password input field(user input)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  ); //Stores validation error messages(not user input)
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); //Show/hide modal
  const [resetEmail, setResetEmail] = useState(""); // Store user's email input (string)
  const [resetMessage, setResetMessage] = useState(""); //Success message to display (string)

  const validateForm = () => {
    //checks if inputs are valid
    const newErrors: { email?: string; password?: string } = {}; //create an empty object, and the object have email and password poroperty

    //if validation finds a problem in email
    if (!email) {
      newErrors.email = "Email is required"; //add error message
    } else if (!email.endsWith("@lawrence.edu")) {
      newErrors.email = "Please use your LU email address";
    }

    //if validaion finds a problem in password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; //
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //stop page refresh

    if (!validateForm()) return; //if validation fail(checks if the form is filled out correctly ), stop here

    // Simple login - just pass the email
    onLogin(email);
  };

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setResetMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetMessage("Check your email for the password reset link!");
      setResetEmail("");
    } catch (err: any) {
      setErrors({ email: err.message || "Failed to send reset email" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-lu-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to Find On LU
        </h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.name@lawrence.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // controlled component
          //event handler that runs every time the user types in the password input field
          error={errors.password}
        />

        <div className="text-right -mt-2 mb-4">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-lu-blue-600 hover:text-lu-blue-800"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button className="text-lu-blue-600 hover:text-lu-blue-700 font-medium">
            Sign up here
          </button>
        </p>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail("");
                  setResetMessage("");
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {resetMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {resetMessage}
              </div>
            )}

            {errors.email && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.email}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Enter your LU email address and we'll send you a link to reset
                your password.
              </p>

              <Input
                label="Email"
                type="email"
                placeholder="your.email@lawrence.edu"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                    setResetMessage("");
                    setErrors({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
