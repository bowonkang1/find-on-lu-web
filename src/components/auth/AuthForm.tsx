import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate } from "react-router-dom"; 

const SCHOOL_DOMAIN = "@lawrence.edu";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  //True->sign in, False->Sign up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    if (!email.endsWith(SCHOOL_DOMAIN)) {
      return `Please use your Lawrence email ending with ${SCHOOL_DOMAIN}`;
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    

    // Validate school email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Check password match for sign up
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        setMessage("🎉 Check your email to confirm your account!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {isLogin ? "Welcome to Find On LU" : "Join Find On LU"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            setError("");
            setMessage("");
          }}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            isLogin
              ? "bg-white text-lu-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            setError("");
            setMessage("");
          }}
          className={`flex-1 py-2 rounded-md font-medium transition-colors ${
            !isLogin
              ? "bg-white text-lu-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="School Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`your.name${SCHOOL_DOMAIN}`}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isLogin ? "Your password" : "Minimum 6 characters"}
          required
        />

        {!isLogin && (
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>

      {!isLogin && (
        <p className="mt-4 text-xs text-gray-500 text-center">
          By signing up, you'll receive a confirmation email at your Lawrence
          address.
        </p>
      )}
    </div>
  );
}
