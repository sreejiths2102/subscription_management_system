import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../api';
import { Eye, EyeOff, AlertCircle, Loader2, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
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

    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Store JWT token and user details in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect role-based: admin -> /admin, staff -> /staff, customer -> /blank (or customer panel)
      // Redirect based on role:
      if (data.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (data.user?.role === 'staff') {
        navigate('/staff', { replace: true });
      } else if (data.user?.role === 'customer') {
        navigate('/customer', { replace: true });
      } else {
        navigate('/blank', { replace: true });
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((d) => d.msg || d).join(', '));
      } else {
        setServerError('Unable to sign in. Please verify your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@subscription.com',
      password: 'AdminPassword123!',
    });
    setErrors({});
    setServerError('');
  };

  const fillStaffCredentials = () => {
    setFormData({
      email: 'staff@subscription.com',
      password: 'StaffPassword123!',
    });
    setErrors({});
    setServerError('');
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
          Sign in
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          New here?{' '}
          <Link to="/register" className="font-medium text-neutral-900 hover:text-olive-700 underline underline-offset-4 decoration-olive-400">
            Create an account
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

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-neutral-200 focus:border-olive-600 focus:ring-olive-600'
                    }`}
                  placeholder="name@company.com"
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
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full appearance-none rounded-xl border px-3.5 py-2.5 pr-10 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 sm:text-sm transition-colors ${errors.password
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col gap-2">
            <span className="text-[11px] font-medium text-neutral-400 text-center uppercase tracking-wider">
              Quick Role Sign-In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-olive-600" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={fillStaffCredentials}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-olive-600" />
                <span>Staff Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
