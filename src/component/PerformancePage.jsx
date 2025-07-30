import React, {useState, useEffect} from 'react'
import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PerformancePage = () => {
    const [performanceData, setPerformanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/backtest_results.json');
                if (!response.ok) throw new Error(`Could not fetch performance data. Status: ${response.status}`);
                const data = await response.json();
                setPerformanceData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center mt-10"><Loader2 className="animate-spin h-10 w-10 text-green-500" /></div>;
    if (error || !performanceData) return (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            <h3 className="font-bold">Error Loading Performance Data</h3>
            <p>{error || "The backtest_results.json file could not be found or is invalid."}</p>
            <p className="mt-2 text-sm">Please ensure you have run `python backtest_model.py` and placed the generated JSON file in the `public` folder of your React project.</p>
        </div>
    );

    const { summary, chartData } = performanceData;
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Historical Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Total Profit</h3><p className="text-3xl font-bold text-green-500">{summary.totalProfit}</p></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">ROI</h3><p className="text-3xl font-bold text-green-500">{summary.roi}</p></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Win Rate</h3><p className="text-3xl font-bold text-blue-500">{summary.winRate}</p></div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"><h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Value Bets</h3><p className="text-3xl font-bold text-purple-500">{summary.valueBetsFound}</p></div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Profit Over Time</h3>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(128, 128, 128, 0.5)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="cumulative_profit" name="Cumulative Profit (units)" stroke="#4ade80" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PerformancePage