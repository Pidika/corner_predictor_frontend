// import Icon from "./Icon";
// const TopValueBets = ({ matches }) => {
//     const ValueIcon = () => (
//       <Icon
//         path='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6A.75.75 0 012.25 5.25v-.75m0 0A2.25 2.25 0 014.5 2.25h15A2.25 2.25 0 0121.75 4.5v9.75a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V4.5z'
//         className='w-5 h-5 mr-2'
//       />
//     )

//     const topBets = matches.filter(m => m.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);
//     return (
//         <div className="bg-gray-800 p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><ValueIcon />Top Value Bets</h3>
//             <div className="space-y-3">
//                 {topBets.length > 0 ? topBets.map(match => (
//                     <div key={match.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
//                         <div>
//                             <p className="font-semibold text-sm">{match.homeTeam} vs {match.awayTeam}</p>
//                             <p className="text-xs text-gray-400">{match.league}</p>
//                         </div>
//                         <div className="text-right">
//                             <p className="font-bold text-green-400 text-lg">
//                                +{(match.value * 100).toFixed(1)}%
//                             </p>
//                             <p className="text-xs text-gray-400">
//                                Pred. {match.predictedCorners.toFixed(1)} corners
//                             </p>
//                         </div>
//                     </div>
//                 )) : <p className="text-sm text-gray-400">No value bets identified for today.</p>}
//             </div>
//         </div>
//     );
// };
// export default TopValueBets
import React, { useState, useEffect } from 'react'
import {
  BarChart2,
  Zap,
  Loader2,
  AlertTriangle,
  Plus,
  X,
  Star,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// --- Shared Components ---
const LEAGUES = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
]

const Header = ({ activeView, setActiveView }) => (
  <header className='bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50'>
    <div className='container mx-auto flex justify-between items-center'>
      <div className='flex items-center space-x-3'>
        <BarChart2 className='h-8 w-8 text-green-400' />
        <h1 className='text-xl md:text-2xl font-bold tracking-tight'>
          Corner Kick Predictor
        </h1>
      </div>
      <nav className='flex items-center space-x-2 bg-gray-800 rounded-lg p-1'>
        <button
          onClick={() => setActiveView('predictor')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeView === 'predictor'
              ? 'bg-green-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Predictor
        </button>
        <button
          onClick={() => setActiveView('performance')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            activeView === 'performance'
              ? 'bg-green-500 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Performance
        </button>
      </nav>
    </div>
  </header>
)

// --- Prediction Hub Components ---
const PredictionResult = ({ result }) => {
  if (!result || !result.input) return null
  const { homeTeam, awayTeam, oddOver } = result.input
  let valueBetInfo = null
  if (!result.error && oddOver) {
    const value = result.data.probability_over_10_5 * parseFloat(oddOver) - 1
    if (value > 0) {
      valueBetInfo = {
        value: value,
        text: `Value: ${(value * 100).toFixed(2)}%`,
        className: value > 0.1 ? 'border-green-500' : 'border-yellow-500',
      }
    }
  }
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 animate-fade-in border-4 ${
        valueBetInfo ? valueBetInfo.className : 'border-transparent'
      }`}
    >
      {valueBetInfo && (
        <div className='flex items-center justify-center mb-3 text-lg font-bold text-green-600 dark:text-green-400'>
          <Star className='h-6 w-6 mr-2 text-yellow-400' />
          VALUE BET IDENTIFIED
        </div>
      )}
      <h2 className='text-xl font-bold text-center text-gray-800 dark:text-white mb-4'>
        {homeTeam} vs. {awayTeam}
      </h2>
      {result.error ? (
        <div className='p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-center'>
          <AlertTriangle className='h-5 w-5 mr-3' />
          <p>{result.error}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
          <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Predicted Corners
            </h3>
            <p className='text-4xl font-bold text-green-500'>
              {result.data.predicted_total_corners}
            </p>
          </div>
          <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Over 10.5 Prob.
            </h3>
            <p className='text-4xl font-bold text-blue-500'>
              {(result.data.probability_over_10_5 * 100).toFixed(1)}%
            </p>
          </div>
          <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
            <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Under 10.5 Prob.
            </h3>
            <p className='text-4xl font-bold text-purple-500'>
              {(result.data.probability_under_10_5 * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const createNewMatch = (matchData = {}) => ({
  id: crypto.randomUUID(),
  homeTeam: matchData.home_team || '',
  awayTeam: matchData.away_team || '',
  leagueName: matchData.league_name || 'Premier League',
  oddHome: matchData.odd_home || '',
  oddDraw: matchData.odd_draw || '',
  oddAway: matchData.odd_away || '',
  oddOver: '',
})

const PredictionHub = () => {
  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMatches, setIsFetchingMatches] = useState(true)
  const [globalError, setGlobalError] = useState('')

  const fetchMatches = async () => {
    setIsFetchingMatches(true)
    setGlobalError('')
    setMatches([])
    try {
      const response = await fetch('http://127.0.0.1:5001/api/upcoming-matches')
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch matches.')
      if (data.length === 0) {
        setGlobalError(
          'No upcoming matches found from the odds API. You can add one manually.'
        )
        setMatches([createNewMatch()]) // Add one manual row if none are found
      } else {
        setMatches(data.map((match) => createNewMatch(match)))
      }
    } catch (err) {
      setGlobalError(err.message)
      setMatches([createNewMatch()]) // Add a manual row on error
    } finally {
      setIsFetchingMatches(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const handleMatchChange = (id, field, value) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const addMatch = () => setMatches((prev) => [...prev, createNewMatch()])
  const removeMatch = (id) =>
    setMatches((prev) => prev.filter((m) => m.id !== id))

  const handlePredictAll = async () => {
    setGlobalError('')
    setPredictions([])
    const validMatches = matches.filter(
      (m) =>
        m.homeTeam &&
        m.awayTeam &&
        m.oddHome &&
        m.oddDraw &&
        m.oddAway &&
        m.oddOver
    )
    if (validMatches.length === 0) {
      setGlobalError(
        'Please fill in at least one complete match row, including Over 10.5 odds.'
      )
      return
    }
    setIsLoading(true)
    const predictionResults = []
    for (const match of validMatches) {
      const payload = {
        home_team: match.homeTeam,
        away_team: match.awayTeam,
        league_name: match.leagueName,
        odd_home: parseFloat(match.oddHome),
        odd_draw: parseFloat(match.oddDraw),
        odd_away: parseFloat(match.oddAway),
      }
      try {
        const response = await fetch('http://127.0.0.1:5001/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Prediction failed')
        predictionResults.push({ input: match, data })
      } catch (err) {
        predictionResults.push({ input: match, error: err.message })
      }
    }
    setPredictions(predictionResults)
    setIsLoading(false)
  }

  return (
    <>
      <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
              Prediction Hub
            </h2>
            <p className='text-gray-500 dark:text-gray-400'>
              Upcoming matches are loaded automatically.
            </p>
          </div>
          <button
            onClick={fetchMatches}
            disabled={isFetchingMatches}
            className='bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50'
          >
            {isFetchingMatches ? (
              <Loader2 className='animate-spin' />
            ) : (
              <RefreshCw size={18} />
            )}
          </button>
        </div>

        {isFetchingMatches && (
          <div className='flex justify-center items-center my-10'>
            <Loader2 className='animate-spin h-8 w-8 text-green-500' />
          </div>
        )}

        {!isFetchingMatches && (
          <div className='space-y-4'>
            {matches.map((match) => (
              <div
                key={match.id}
                className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative'
              >
                {matches.length > 1 && (
                  <button
                    onClick={() => removeMatch(match.id)}
                    className='absolute top-2 right-2 text-gray-400 hover:text-red-500'
                  >
                    <X size={18} />
                  </button>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                  <input
                    type='text'
                    value={match.homeTeam}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'homeTeam', e.target.value)
                    }
                    placeholder='Home Team'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  />
                  <input
                    type='text'
                    value={match.awayTeam}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'awayTeam', e.target.value)
                    }
                    placeholder='Away Team'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  />
                </div>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                  <select
                    value={match.leagueName}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'leagueName', e.target.value)
                    }
                    className='col-span-2 md:col-span-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                    aria-label='League'
                  >
                    {LEAGUES.map((league) => (
                      <option key={league} value={league}>
                        {league}
                      </option>
                    ))}
                  </select>
                  <input
                    type='number'
                    step='0.01'
                    value={match.oddHome}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'oddHome', e.target.value)
                    }
                    placeholder='Home Odd'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  />
                  <input
                    type='number'
                    step='0.01'
                    value={match.oddDraw}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'oddDraw', e.target.value)
                    }
                    placeholder='Draw Odd'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  />
                  <input
                    type='number'
                    step='0.01'
                    value={match.oddAway}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'oddAway', e.target.value)
                    }
                    placeholder='Away Odd'
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  />
                  <input
                    type='number'
                    step='0.01'
                    value={match.oddOver}
                    onChange={(e) =>
                      handleMatchChange(match.id, 'oddOver', e.target.value)
                    }
                    placeholder='Over 10.5 Odd'
                    className='w-full p-2 border border-green-500 dark:border-green-400 rounded-md bg-green-50 dark:bg-gray-700'
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='flex justify-between items-center mt-6'>
          <button
            onClick={addMatch}
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors'
          >
            <Plus size={18} className='mr-2' /> Add Manual Match
          </button>
          <button
            onClick={handlePredictAll}
            disabled={isLoading || isFetchingMatches}
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-400 text-lg'
          >
            {isLoading ? (
              <Loader2 className='animate-spin mr-2' />
            ) : (
              <Zap className='mr-2' />
            )}
            {isLoading ? 'Calculating...' : 'Get All Predictions'}
          </button>
        </div>
      </div>
      {globalError && (
        <div className='max-w-4xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center'>
          <AlertTriangle className='h-5 w-5 mr-3' />
          {globalError}
        </div>
      )}
      <div className='max-w-4xl mx-auto'>
        {predictions.map((p) => (
          <PredictionResult key={p.input.id} result={p} />
        ))}
      </div>
    </>
  )
}

// --- Performance Page Component ---
const PerformancePage = () => {
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/backtest_results.json')
        if (!response.ok)
          throw new Error(
            `Could not fetch performance data. Status: ${response.status}`
          )
        const data = await response.json()
        setPerformanceData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading)
    return (
      <div className='flex justify-center items-center mt-10'>
        <Loader2 className='animate-spin h-10 w-10 text-green-500' />
      </div>
    )
  if (error || !performanceData)
    return (
      <div className='max-w-4xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md'>
        <h3 className='font-bold'>Error Loading Performance Data</h3>
        <p>
          {error ||
            'The backtest_results.json file could not be found or is invalid.'}
        </p>
        <p className='mt-2 text-sm'>
          Please ensure you have run `python backtest_model.py` and placed the
          generated JSON file in the `public` folder of your React project.
        </p>
      </div>
    )

  const { summary, chartData } = performanceData
  return (
    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto animate-fade-in'>
      <h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white mb-6'>
        Historical Performance
      </h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8'>
        <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
          <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
            Total Profit
          </h3>
          <p className='text-3xl font-bold text-green-500'>
            {summary.totalProfit} u
          </p>
        </div>
        <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
          <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
            ROI
          </h3>
          <p className='text-3xl font-bold text-green-500'>{summary.roi}</p>
        </div>
        <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
          <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
            Win Rate
          </h3>
          <p className='text-3xl font-bold text-blue-500'>{summary.winRate}</p>
        </div>
        <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
          <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
            Value Bets
          </h3>
          <p className='text-3xl font-bold text-purple-500'>
            {summary.valueBetsFound}
          </p>
        </div>
      </div>
      <h3 className='text-xl font-bold text-center text-gray-800 dark:text-white mb-4'>
        Profit Over Time
      </h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(128, 128, 128, 0.2)'
            />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: 'rgba(128, 128, 128, 0.5)',
              }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='cumulative_profit'
              name='Cumulative Profit (units)'
              stroke='#4ade80'
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- Main App Component ---
export default function App() {
  const [activeView, setActiveView] = useState('predictor')

  return (
    <div className='bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200'>
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className='container mx-auto p-4 md:p-6'>
        {activeView === 'predictor' && <PredictionHub />}
        {activeView === 'performance' && <PerformancePage />}
      </main>
    </div>
  )
}
