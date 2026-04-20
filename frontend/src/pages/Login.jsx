import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import logo from '../assets/logo.webp';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      // Role-based redirection
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/candidate');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-10 animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        
        <div className="text-center mb-10 overflow-visible">
          <div className="inline-flex flex-col items-center mb-0">
            <img src={logo} alt="Forge India" className="h-20 w-auto mb-3 drop-shadow-md" />
            <div className="h-1.5 w-16 bg-accent-500 rounded-full" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                {...register('email')}
                type="email"
                className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link to="/forgot-password" name="forgot-password" id="forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" name="register" id="register" className="font-semibold text-primary-600 hover:text-primary-700">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
