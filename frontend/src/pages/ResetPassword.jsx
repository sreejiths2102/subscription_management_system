import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password criteria checklist (matching Register.jsx)
  const passwordCriteria = {
    length: formData.password.length > 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    special: /[^a-zA-Z0-9\s]/.test(formData.password),
    matches: formData.password && formData.password === formData.confirm_password,
  };

  const validate = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = 'New password is required.';
    } else {
      if (formData.password.length <= 8) {
        errs.password = 'Password must contain more than 8 characters.';
      } else if (!/[A-Z]/.test(formData.password)) {
        errs.password = 'Password must contain at least one uppercase letter.';
      } else if (!/[a-z]/.test(formData.password)) {
        errs.password = 'Password must contain at least one lowercase letter.';
      } else if (!/[^a-zA-Z0-9\s]/.test(formData.password)) {
        errs.password = 'Password must contain at least one special character.';
      }
    }

    if (!formData.confirm_password) {
      errs.confirm_password = 'Confirm password is required.';
    } else if (formData.password !== formData.confirm_password) {
      errs.confirm_password = 'Confirm password must match the password.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!token) {
      setServerError('Missing reset token. Please request a new password reset link.');
      return;
    }

    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });
      setSuccess(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((d) => d.msg || d).join(', '));
      } else {
        setServerError('Invalid or expired reset token. Please request a new password reset link.');
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
          Set new password
        </h2>
        <p className="mt-2 text-center text-xs text-neutral-500">
          Choose a secure, strong password to regain access to your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#E8E8E8] rounded-2xl shadow-xs sm:px-10 space-y-5">
          {/* Missing Token Warning */}
          {!token && (
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Reset token not detected</span>
              </div>
              <p className="text-xs text-amber-700">
                Please ensure you opened the full link sent to your registered email address.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block text-xs font-bold text-black underline underline-offset-2 pt-1"
              >
                Request a new reset link &rarr;
              </Link>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">{serverError}</div>
            </div>
          )}

          {/* Success State */}
          {success ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F2F4ED] text-[#788A5B] mx-auto flex items-center justify-center border border-[#788A5B]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-black">Password successfully reset!</h3>
                <p className="text-xs text-neutral-600 mt-1">
                  Your credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-2xs text-xs font-semibold text-white bg-black hover:bg-neutral-800 transition-colors"
              >
                Proceed to Sign In
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 transition-colors ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#E8E8E8] focus:border-[#788A5B] focus:ring-[#788A5B]'
                    }`}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              {/* Password Criteria Checklist */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-[#E8E8E8] space-y-1.5 text-[11px]">
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordCriteria.length ? 'text-[#788A5B] font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>More than 8 characters</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordCriteria.upper ? 'text-[#788A5B] font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordCriteria.lower ? 'text-[#788A5B] font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>At least one lowercase letter (a-z)</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    passwordCriteria.special ? 'text-[#788A5B] font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>At least one special character (!@#$%^&*)</span>
                </div>
                {formData.confirm_password && (
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordCriteria.matches ? 'text-[#788A5B] font-semibold' : 'text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-xs text-black placeholder-neutral-400 focus:outline-none focus:ring-1 transition-colors ${
                      errors.confirm_password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#E8E8E8] focus:border-[#788A5B] focus:ring-[#788A5B]'
                    }`}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirm_password}</p>
                )}
              </div>

              {/* Black Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-2xs text-xs font-semibold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#788A5B]" />
                      Updating password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Back Link */}
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

