import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-[var(--color-ebony)] border-b border-[var(--color-taupe)]/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[var(--color-olive)] rounded flex items-center justify-center">
                    <span className="text-xl">📊</span>
                </div>
                <Link to="/" className="text-xl font-bold text-[var(--color-cream)] tracking-tight">LoanPredict</Link>
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <div className="flex items-center gap-4 text-[var(--color-taupe)]">
                            <Link to="/predict" className="hover:text-[var(--color-cream)] transition-colors flex items-center gap-1">
                                <span className="text-sm">📝</span> Predict
                            </Link>
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/history" className="hover:text-[var(--color-cream)] transition-colors flex items-center gap-1">
                                        <span className="text-sm">🕒</span> History
                                    </Link>
                                    <Link to="/admin" className="hover:text-[var(--color-cream)] transition-colors">Admin</Link>
                                </>
                            )}
                        </div>
                        <div className="h-4 w-px bg-[var(--color-taupe)]/20"></div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-[var(--color-cream)]">{user.email || user.name}</span>
                                <span className={`text-[10px] uppercase tracking-tighter px-1.5 py-0.5 rounded border ${user.role === 'admin'
                                        ? 'bg-[var(--color-olive)]/10 text-[var(--color-olive)] border-[var(--color-olive)]/20 shadow-[0_0_10px_rgba(163,163,141,0.1)]'
                                        : 'bg-[var(--color-taupe)]/10 text-[var(--color-taupe)] border-[var(--color-taupe)]/20'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-[var(--color-taupe)] hover:text-red-400 transition-colors "
                                title="Logout"
                            >
                                🚪
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-[var(--color-cream)] hover:text-[var(--color-olive)] transition-colors">Login</Link>
                        <Link to="/register" className="btn-primary py-1 px-4">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

