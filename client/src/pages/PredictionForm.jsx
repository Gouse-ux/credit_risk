import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PredictionForm = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        person_age: '',
        person_income: '',
        person_home_ownership: 'RENT',
        person_emp_length: '',
        loan_intent: 'EDUCATION',
        loan_grade: 'A',
        loan_amnt: '',
        loan_int_rate: '',
        loan_percent_income: '',
        cb_person_default_on_file: 'N',
        cb_person_cred_hist_length: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const homeOwnershipOptions = ['RENT', 'OWN', 'MORTGAGE', 'OTHER'];
    const loanIntentOptions = ['EDUCATION', 'MEDICAL', 'PERSONAL', 'VENTURE', 'HOMEIMPROVEMENT', 'DEBTCONSOLIDATION'];
    const loanGradeOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    // Mapping for ML API (Categorical to Numerical)
    // Note: This should match the encoding used during model training.
    const mapToNumeric = (data) => {
        const homeMap = { 'RENT': 0, 'OWN': 1, 'MORTGAGE': 2, 'OTHER': 3 };
        const intentMap = { 'EDUCATION': 0, 'MEDICAL': 1, 'PERSONAL': 2, 'VENTURE': 3, 'HOMEIMPROVEMENT': 4, 'DEBTCONSOLIDATION': 5 };
        const gradeMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6 };
        const defaultMap = { 'N': 0, 'Y': 1 };

        return [
            Number(data.person_age),
            Number(data.person_income),
            homeMap[data.person_home_ownership],
            Number(data.person_emp_length),
            intentMap[data.loan_intent],
            gradeMap[data.loan_grade],
            Number(data.loan_amnt),
            Number(data.loan_int_rate),
            Number(data.loan_percent_income),
            defaultMap[data.cb_person_default_on_file],
            Number(data.cb_person_cred_hist_length)
        ];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPrediction(null);
        setLoading(true);

        try {
            const features = mapToNumeric(formData);

            if (features.some(f => isNaN(f) && typeof f !== 'number')) {
                setError('Please fill all fields correctly');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/predict', { features }, config);
            setPrediction(data.prediction);
        } catch (err) {
            setError(err.response?.data?.message || 'Prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-ebony)] p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[var(--color-cream)] mb-2">Loan Prediction</h1>
                    <p className="text-[var(--color-taupe)]">Fill in the details to predict loan approval</p>
                </div>

                <form onSubmit={handleSubmit} className="card-premium p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-[var(--color-taupe)]/10">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[var(--color-taupe)] border-b border-[var(--color-taupe)]/10 pb-2 flex items-center gap-2">
                            <span>👤</span> Personal Details
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Age (in years)</label>
                            <input
                                type="number"
                                name="person_age"
                                value={formData.person_age}
                                onChange={handleChange}
                                className="w-full input-premium"
                                placeholder="e.g. 25"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Annual Income (₹)</label>
                            <input
                                type="number"
                                name="person_income"
                                value={formData.person_income}
                                onChange={handleChange}
                                className="w-full input-premium"
                                placeholder="e.g. 500000"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Home Ownership</label>
                            <select
                                name="person_home_ownership"
                                value={formData.person_home_ownership}
                                onChange={handleChange}
                                className="w-full input-premium appearance-none"
                            >
                                {homeOwnershipOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Employment Length (years)</label>
                            <input
                                type="number"
                                name="person_emp_length"
                                value={formData.person_emp_length}
                                onChange={handleChange}
                                className="w-full input-premium"
                                placeholder="e.g. 5"
                                required
                            />
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[var(--color-taupe)] border-b border-[var(--color-taupe)]/10 pb-2 flex items-center gap-2">
                            <span>💰</span> Loan Information
                        </h3>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Loan Purpose</label>
                            <select
                                name="loan_intent"
                                value={formData.loan_intent}
                                onChange={handleChange}
                                className="w-full input-premium appearance-none"
                            >
                                {loanIntentOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Loan Grade</label>
                                <select
                                    name="loan_grade"
                                    value={formData.loan_grade}
                                    onChange={handleChange}
                                    className="w-full input-premium appearance-none"
                                >
                                    {loanGradeOptions.map(opt => (
                                        <option key={opt} value={opt}>Grade {opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Defaulted Before?</label>
                                <select
                                    name="cb_person_default_on_file"
                                    value={formData.cb_person_default_on_file}
                                    onChange={handleChange}
                                    className="w-full input-premium appearance-none"
                                >
                                    <option value="N">No</option>
                                    <option value="Y">Yes</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Loan Amount (₹)</label>
                            <input
                                type="number"
                                name="loan_amnt"
                                value={formData.loan_amnt}
                                onChange={handleChange}
                                className="w-full input-premium"
                                placeholder="e.g. 100000"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="loan_int_rate"
                                    value={formData.loan_int_rate}
                                    onChange={handleChange}
                                    className="w-full input-premium"
                                    placeholder="10.5"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Loan % of Income</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="loan_percent_income"
                                    value={formData.loan_percent_income}
                                    onChange={handleChange}
                                    className="w-full input-premium"
                                    placeholder="0.25"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-[var(--color-taupe)]">Credit History Length (years)</label>
                            <input
                                type="number"
                                name="cb_person_cred_hist_length"
                                value={formData.cb_person_cred_hist_length}
                                onChange={handleChange}
                                className="w-full input-premium"
                                placeholder="e.g. 5"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-lg shadow-[var(--color-olive)]/20"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-[var(--color-cream)]/30 border-t-[var(--color-cream)] rounded-full animate-spin"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>Get Prediction <span className="text-2xl">⚡</span></>
                            )}
                        </button>
                    </div>
                </form>

                {prediction !== null && (
                    <div className={`mt-10 p-8 card-premium text-center border-l-8 ${prediction === 1 ? 'border-red-500' : 'border-green-500 animate-pulse'}`}>
                        <h2 className="text-2xl font-bold mb-2">
                            Result: {prediction === 1 ? '⚠️ High Risk / Rejected' : '✅ Low Risk / Approved'}
                        </h2>
                        <p className="text-[var(--color-taupe)]">
                            Based on our AI model, this loan application is classified as
                            <span className="text-[var(--color-cream)] font-bold"> {prediction === 1 ? 'Likely to Default' : 'Reliable'}</span>.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-10 p-6 bg-red-900/20 border border-red-500/50 text-red-400 rounded-xl text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionForm;

