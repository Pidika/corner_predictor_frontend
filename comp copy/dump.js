import React, { useState, useMemo, useEffect } from 'react';
import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X, Star, RefreshCw, ArrowUpDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Shared Components ---
const LEAGUES = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];

const Header = ({ activeView, setActiveView }) => (
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <BarChart2 className="h-8 w-8 text-green-400" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Corner Kick Predictor</h1>
            </div>
            <nav className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <button onClick={() => setActiveView('predictor')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeView === 'predictor' ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Predictor</button>
                <button onClick={() => setActiveView('performance')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeView === 'performance' ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Performance</button>
            </nav>
        </div>
    </header>
);

// --- Prediction Hub Components ---
const PredictionResult = ({ result }) => {
    if (!result || !result.input) return null;
    const { homeTeam, awayTeam } = result.input;
    
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 animate-fade-in">
            <div className="flex justify-center items-center text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
                <span>{homeTeam}</span>
                <span className="mx-4 text-gray-400 text-base">vs.</span>
                <span>{awayTeam}</span>
            </div>
            {result.error ? (
                <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 mr-3" /><p>{result.error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Predicted Total Corners</h3>
                        <p className="text-5xl font-bold text-green-500 mt-2">{result.data.predicted_total_corners}</p>
                    </div>
                    <div className="md:col-span-2">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Market</th>
                                    <th scope="col" className="px-4 py-2 text-center">Over Prob.</th>
                                    <th scope="col" className="px-4 py-2 text-center">Under Prob.</th>
                                    <th scope="col" className="px-4 py-2 text-center">Value Bet?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(result.data.probabilities).map(([key, overProb]) => {
                                    const line = key.split('_')[1].replace('_', '.');
                                    const underProb = 1 - overProb;
                                    const oddOver = result.input[`oddOver${line.replace('.', '')}`];
                                    let valueInfo = { text: '-', className: 'text-gray-500' };
                                    if (oddOver) {
                                        const value = (overProb * parseFloat(oddOver)) - 1;
                                        if (value > 0.05) { // Using a 5% value threshold
                                            valueInfo = { text: `+${(value * 100).toFixed(1)}%`, className: 'text-green-500 font-bold' };
                                        }
                                    }
                                    return (
                                        <tr key={key} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                            <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">Over/Under {line}</td>
                                            <td className="px-4 py-2 text-center text-blue-500 font-semibold">{(overProb * 100).toFixed(1)}%</td>
                                            <td className="px-4 py-2 text-center text-purple-500 font-semibold">{(underProb * 100).toFixed(1)}%</td>
                                            <td className={`px-4 py-2 text-center ${valueInfo.className}`}>{valueInfo.text}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const createNewMatch = (matchData = {}) => ({
    id: crypto.randomUUID(), homeTeam: matchData.home_team || '', awayTeam: matchData.away_team || '',
    leagueName: matchData.league_name || 'Premier League', oddHome: matchData.odd_home || '',
    oddDraw: matchData.odd_draw || '', oddAway: matchData.odd_away || '',
    oddOver85: '', oddOver95: '', oddOver105: '', oddOver115: '', oddOver125: ''
});

const MatchRow = ({ match, onRemove, onChange, matchesCount }) => (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
        {matchesCount > 1 && ( <button onClick={() => onRemove(match.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X size={18} /></button> )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <input type="text" value={match.homeTeam} onChange={e => onChange(match.id, 'homeTeam', e.target.value)} placeholder="Home Team" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
             <input type="text" value={match.awayTeam} onChange={e => onChange(match.id, 'awayTeam', e.target.value)} placeholder="Away Team" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <select value={match.leagueName} onChange={e => onChange(match.id, 'leagueName', e.target.value)} className="col-span-2 md:col-span-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">{LEAGUES.map(league => <option key={league} value={league}>{league}</option>)}</select>
            <input type="number" step="0.01" value={match.oddHome} onChange={e => onChange(match.id, 'oddHome', e.target.value)} placeholder="Home Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddDraw} onChange={e => onChange(match.id, 'oddDraw', e.target.value)} placeholder="Draw Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddAway} onChange={e => onChange(match.id, 'oddAway', e.target.value)} placeholder="Away Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input type="number" step="0.01" value={match.oddOver85} onChange={e => onChange(match.id, 'oddOver85', e.target.value)} placeholder="O/U 8.5 Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddOver95} onChange={e => onChange(match.id, 'oddOver95', e.target.value)} placeholder="O/U 9.5 Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddOver105} onChange={e => onChange(match.id, 'oddOver105', e.target.value)} placeholder="O/U 10.5 Odd" className="w-full p-2 border border-green-500 dark:border-green-400 rounded-md bg-green-50 dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddOver115} onChange={e => onChange(match.id, 'oddOver115', e.target.value)} placeholder="O/U 11.5 Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700" />
            <input type="number" step="0.01" value={match.oddOver125} onChange={e => onChange(match.id, 'oddOver125', e.target.value)} placeholder="O/U 12.5 Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700" />
        </div>
    </div>
);

const PredictionHub = () => {
    const [matches, setMatches] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMatches, setIsFetchingMatches] = useState(true);
    const [globalError, setGlobalError] = useState('');
    const [sortKey, setSortKey] = useState('value');

    const fetchMatches = async () => { /* ... (Identical to previous version) ... */ };
    useEffect(() => { fetchMatches(); }, []);

    const handleMatchChange = (id, field, value) => setMatches(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    const addMatch = () => setMatches(prev => [...prev, createNewMatch()]);
    const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id));

    const handlePredictAll = async () => {
        setGlobalError('');
        setPredictions([]);
        const validMatches = matches.filter(m => m.homeTeam && m.awayTeam && m.oddHome && m.oddDraw && m.oddAway);
        if (validMatches.length === 0) {
            setGlobalError("Please fill in at least one match row with Home/Draw/Away odds.");
            return;
        }
        setIsLoading(true);
        const predictionResults = [];
        for (const match of validMatches) {
            const payload = {
                home_team: match.homeTeam, away_team: match.awayTeam, league_name: match.leagueName,
                odd_home: parseFloat(match.oddHome), odd_draw: parseFloat(match.oddDraw), odd_away: parseFloat(match.oddAway)
            };
            try {
                const response = await fetch('http://127.0.0.1:5001/api/predict', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Prediction failed');
                predictionResults.push({ input: match, data });
            } catch (err) {
                predictionResults.push({ input: match, error: err.message });
            }
        }
        setPredictions(predictionResults);
        setIsLoading(false);
    };
    
    const sortedPredictions = useMemo(() => { /* ... (Identical to previous version) ... */ }, [predictions, sortKey]);

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Prediction Hub</h2>
                        <p className="text-gray-500 dark:text-gray-400">Upcoming matches are loaded automatically.</p>
                    </div>
                    <button onClick={fetchMatches} disabled={isFetchingMatches} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50">
                        {isFetchingMatches ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                    </button>
                </div>
                
                {isFetchingMatches && <div className="flex justify-center items-center my-10"><Loader2 className="animate-spin h-8 w-8 text-green-500" /></div>}

                {!isFetchingMatches && (
                    <div className="space-y-4">
                        {matches.map((match) => <MatchRow key={match.id} match={match} matchesCount={matches.length} onRemove={removeMatch} onChange={handleMatchChange} />)}
                    </div>
                )}

                <div className="flex justify-between items-center mt-6">
                    <button onClick={addMatch} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors"><Plus size={18} className="mr-2"/> Add Manual Match</button>
                    <button onClick={handlePredictAll} disabled={isLoading || isFetchingMatches} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-400 text-lg">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                        {isLoading ? 'Calculating...' : 'Get All Predictions'}
                    </button>
                </div>
            </div>
            {globalError && ( /* ... (Identical to previous version) ... */ )}
            {sortedPredictions.length > 0 && ( /* ... (Identical to previous version) ... */ )}
            <div className="max-w-4xl mx-auto">
                {sortedPredictions.map(p => <PredictionResult key={p.input.id} result={p} />)}
            </div>
        </>
    );
};

// --- Performance Page Component ---
const PerformancePage = () => { /* ... (Identical to previous version) ... */ };

// --- Main App Component ---
export default function App() {
    const [activeView, setActiveView] = useState('predictor');
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto p-4 md:p-6">
                {activeView === 'predictor' && <PredictionHub />}
                {activeView === 'performance' && <PerformancePage />}
            </main>
        </div>
    );
}
