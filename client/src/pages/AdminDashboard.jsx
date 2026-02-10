import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                };
                if (activeTab === 'users') {
                    const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
                    setUsers(data);
                } else {
                    const { data } = await axios.get('http://localhost:5000/api/admin/logs', config);
                    setLogs(data);
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user, activeTab]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-ebony)] text-[var(--color-cream)]">
                <div className="card-premium p-10 text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
                    <p className="text-[var(--color-taupe)]">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-ebony)] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--color-cream)] mb-2">Admin Control Center</h1>
                        <p className="text-[var(--color-taupe)]">Manage users and monitor system activity</p>
                    </div>
                    <div className="flex bg-[var(--color-taupe)]/10 p-1 rounded-xl border border-[var(--color-taupe)]/10">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'users' ? 'bg-[var(--color-olive)] text-[var(--color-cream)] shadow-lg' : 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]'}`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'logs' ? 'bg-[var(--color-olive)] text-[var(--color-cream)] shadow-lg' : 'text-[var(--color-taupe)] hover:text-[var(--color-cream)]'}`}
                        >
                            System Logs
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <span className="w-12 h-12 border-4 border-[var(--color-olive)]/20 border-t-[var(--color-olive)] rounded-full animate-spin"></span>
                    </div>
                ) : (
                    <div className="card-premium border border-[var(--color-taupe)]/10 overflow-hidden shadow-2xl">
                        {activeTab === 'users' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--color-taupe)]/5 border-b border-[var(--color-taupe)]/10">
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">User</th>
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">Role</th>
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-taupe)]/5">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-[var(--color-cream)]/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[var(--color-olive)]/20 rounded-full flex items-center justify-center text-[var(--color-olive)] font-bold">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-[var(--color-cream)]">{u.name}</div>
                                                            <div className="text-xs text-[var(--color-taupe)]">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${u.role === 'admin'
                                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2 animate-pulse"></span>
                                                    <span className="text-xs text-[var(--color-taupe)] uppercase tracking-widest">Active</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[var(--color-taupe)]/5 border-b border-[var(--color-taupe)]/10">
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">User</th>
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">Date</th>
                                            <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold text-right">Prediction</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-taupe)]/5">
                                        {logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-[var(--color-cream)]/[0.02] transition-colors">
                                                <td className="px-6 py-4 text-[var(--color-cream)] font-medium">
                                                    {log.userId?.name || 'Unknown User'}
                                                    <div className="text-[10px] text-[var(--color-taupe)] font-normal">{log.userId?.email || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[var(--color-cream)]">{new Date(log.createdAt).toLocaleDateString()}</div>
                                                    <div className="text-[10px] text-[var(--color-taupe)]">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${log.prediction === 0
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {log.prediction === 0 ? 'Approved' : 'Rejected'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

