import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, User, Briefcase } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer', // 'customer' or 'staff'
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time password criteria verification
  const passwordCriteria = {
    length: formData.password.length > 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    special: /[^a-zA-Z0-9\s]/.test(formData.password),
    matches: formData.password && formData.password === formData.confirm_password,
  };

  const validateForm = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
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

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: formData.email.trim().toLowerCase() } });
      }, 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((d) => d.msg || d).join(', '));
      } else {
        setServerError('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Minimal Olive Accent Pill */}
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-olive-50 text-olive-800 border border-olive-200">
            <span className="w-1.5 h-1.5 rounded-full bg-olive-600"></span>
            Subscription Platform
          </span>
        </div>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-neutral-900 hover:text-olive-700 underline underline-offset-4 decoration-olive-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-neutral-200/80 rounded-2xl shadow-sm sm:px-10">
          {serverError && (
            <div className="mb-6 rounded-xl bg-red-50/70 p-4 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">{serverError}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-xl bg-olive-50 p-4 border border-olive-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-olive-700 shrink-0 mt-0.5" />
              <div className="text-sm text-olive-800 font-medium">{successMessage}</div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('customer')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-left transition-all ${
                    formData.role === 'customer'
                      ? 'border-olive-600 bg-olive-50/60 ring-1 ring-olive-600 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <User className={`w-5 h-5 mb-1.5 ${formData.role === 'customer' ? 'text-olive-700' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-semibold ${formData.role === 'customer' ? 'text-olive-900' : 'text-neutral-700'}`}>
                    Customer
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 text-center leading-tight">
                    Manage own subscriptions
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('staff')}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-left transition-all ${
                    formData.role === 'staff'
                      ? 'border-olive-600 bg-olive-50/60 ring-1 ring-olive-600 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <Briefcase className={`w-5 h-5 mb-1.5 ${formData.role === 'staff' ? 'text-olive-700' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-semibold ${formData.role === 'staff' ? 'text-olive-900' : 'text-neutral-700'}`}>
                    Staff
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 text-center leading-tight">
                    Manage customers & orders
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-olive-600 focus:ring-olive-600'
                  }`}
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-olive-600 focus:ring-olive-600'
                  }`}
                  placeholder="jane@company.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-olive-600 focus:ring-olive-600'
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

              {/* Password criteria checklist with subtle olive indicators */}
              <div className="mt-3 p-3 bg-neutral-50/70 rounded-xl border border-neutral-100 space-y-1.5 text-xs">
                <span className="font-semibold text-neutral-600 block mb-1">Requirements:</span>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.length ? 'bg-olive-600' : 'bg-neutral-300'}`} />
                  <span className={passwordCriteria.length ? 'text-olive-900 font-medium' : 'text-neutral-500'}>
                    More than 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.upper ? 'bg-olive-600' : 'bg-neutral-300'}`} />
                  <span className={passwordCriteria.upper ? 'text-olive-900 font-medium' : 'text-neutral-500'}>
                    At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.lower ? 'bg-olive-600' : 'bg-neutral-300'}`} />
                  <span className={passwordCriteria.lower ? 'text-olive-900 font-medium' : 'text-neutral-500'}>
                    At least one lowercase letter (a-z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${passwordCriteria.special ? 'bg-olive-600' : 'bg-neutral-300'}`} />
                  <span className={passwordCriteria.special ? 'text-olive-900 font-medium' : 'text-neutral-500'}>
                    At least one special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${
                    errors.confirm_password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-olive-600 focus:ring-olive-600'
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

            {/* Black Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-xs text-sm font-semibold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-olive-400" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
