import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Registered email address is required.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessInfo(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await authService.forgotPassword(email.trim().toLowerCase());
      setSuccessInfo(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((d) => d.msg || d).join(', '));
      } else {
        setServerError('Unable to process password reset request. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Minimal Olive Accent Pill */}
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F4ED] text-[#788A5B] border border-[#788A5B]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#788A5B]"></span>
            Brightloop Software
          </span>
        </div>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-black">
          Reset password
        </h2>
        <p className="mt-2 text-center text-xs text-neutral-500">
          Enter your registered email address and we'll generate a secure password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E8E8] rounded-2xl shadow-xs sm:px-10 space-y-5">
          {/* Server Error Alert */}
          {serverError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">{serverError}</div>
            </div>
          )}

          {/* Success Message */}
          {successInfo ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#F2F4ED] p-4 border border-[#788A5B]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#788A5B] shrink-0" />
                  <span className="text-xs font-bold text-black">Reset link dispatched</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {successInfo.message}
                </p>
                {successInfo.is_registered && (
                  <p className="text-[11px] text-[#788A5B] font-medium pt-1">
                    ✓ Verified registered account for <span className="font-bold">{email}</span>.
                  </p>
                )}
              </div>

              {/* Development / Demo Quick Reset Link */}
              {successInfo.reset_link && (
                <div className="p-3.5 rounded-xl border border-[#E8E8E8] bg-neutral-50 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                    Direct Reset Link Preview
                  </span>
                  <a
                    href={successInfo.reset_link}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-2xs"
                  >
                    <span>Proceed to Set New Password</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#F2F4ED]" />
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setSuccessInfo(null);
                  setEmail('');
                }}
                className="w-full py-2 text-xs text-neutral-500 hover:text-black transition-colors"
              >
                Send reset link to a different email
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                      if (serverError) setServerError('');
                    }}
                    className={`block w-full appearance-none rounded-xl border pl-9 pr-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 transition-colors ${
                      error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#E8E8E8] focus:border-[#788A5B] focus:ring-[#788A5B]'
                    }`}
                    placeholder="name@company.com"
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
              </div>

              {/* Black Primary Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-2xs text-xs font-semibold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#788A5B]" />
                      Generating link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Back to Sign In Link */}
          <div className="pt-3 border-t border-[#E8E8E8] text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

