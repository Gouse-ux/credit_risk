import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, role);
        if (result.success) {
            navigate('/predict');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-[var(--color-ebony)]">
            <div className="card-premium p-10 w-full max-w-md border border-[var(--color-taupe)]/10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[var(--color-olive)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--color-olive)]/30">
                        <span className="text-3xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-cream)]">Create Account</h2>
                    <p className="text-[var(--color-taupe)] mt-2">Join us to start predicting</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-taupe)] flex items-center gap-2">
                            <span>👤</span> Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full input-premium py-3"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-taupe)] flex items-center gap-2">
                            <span>📧</span> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full input-premium py-3"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-taupe)] flex items-center gap-2">
                            <span>🔒</span> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full input-premium py-3"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--color-taupe)] flex items-center gap-2">
                            <span>🎭</span> Register as
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full input-premium py-3 bg-[var(--color-ebony)]"
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full btn-primary py-4 mt-4 text-lg flex items-center justify-center gap-2 shadow-xl shadow-[var(--color-olive)]/10"
                    >
                        Create Account <span className="text-xl">→</span>
                    </button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="flex-1 h-px bg-[var(--color-taupe)]/20"></div>
                        <span className="text-xs text-[var(--color-taupe)] uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-[var(--color-taupe)]/20"></div>
                    </div>

                    <a
                        href="http://localhost:5000/api/auth/google"
                        className="w-full btn-secondary py-3 flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Sign up with Google
                    </a>
                </form>

                <p className="mt-8 text-center text-sm text-[var(--color-taupe)]">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-[var(--color-cream)] hover:text-[var(--color-olive)] cursor-pointer font-semibold transition-colors underline decoration-[var(--color-olive)]/30 underline-offset-4"
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

