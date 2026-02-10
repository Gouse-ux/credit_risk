import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const History = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5000/api/predict/history', config);
                setLogs(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-[var(--color-ebony)] p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--color-cream)] mb-2">Prediction History</h1>
                        <p className="text-[var(--color-taupe)]">Review all user loan applications and results</p>
                    </div>
                    <div className="text-right">
                        <span className="text-[var(--color-olive)] font-bold text-2xl">{logs.length}</span>
                        <p className="text-xs uppercase tracking-widest text-[var(--color-taupe)]">Total Predictions</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="w-10 h-10 border-4 border-[var(--color-olive)]/30 border-t-[var(--color-olive)] rounded-full animate-spin"></span>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="card-premium p-20 text-center border-dashed border-2 border-[var(--color-taupe)]/20">
                        <div className="text-6xl mb-4 opacity-20">🕒</div>
                        <h3 className="text-xl font-medium text-[var(--color-cream)]">No records yet</h3>
                        <p className="text-[var(--color-taupe)] mt-2">No loan predictions have been made by users yet.</p>
                    </div>
                ) : (
                    <div className="card-premium overflow-hidden border border-[var(--color-taupe)]/10 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--color-taupe)]/5 border-b border-[var(--color-taupe)]/10">
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">Date</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">User</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">Prediction Result</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold">Details Snippet</th>
                                        <th className="px-6 py-4 text-xs uppercase tracking-widest text-[var(--color-taupe)] font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-taupe)]/5">
                                    {logs.map((log) => (
                                        <tr key={log._id} className="hover:bg-[var(--color-cream)]/[0.02] transition-colors group">
                                            <td className="px-6 py-4 text-[var(--color-cream)]">
                                                <div className="font-medium">{new Date(log.createdAt).toLocaleDateString()}</div>
                                                <div className="text-xs text-[var(--color-taupe)]">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[var(--color-cream)] text-sm font-medium">
                                                    {log.userId?.name || 'Unknown User'}
                                                </div>
                                                <div className="text-[var(--color-taupe)] text-xs">
                                                    {log.userId?.email || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${log.prediction === 0
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                    {log.prediction === 0 ? 'Approved' : 'Rejected'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--color-taupe)] text-sm font-mono truncate max-w-xs">
                                                {log.features.slice(0, 5).join(', ')}...
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-[var(--color-olive)] hover:text-[var(--color-cream)] transition-colors p-2 rounded-lg hover:bg-[var(--color-olive)]/10">
                                                    👁️ View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;

