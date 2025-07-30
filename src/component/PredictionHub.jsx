// import React, { useEffect, useMemo, useState } from 'react'
// import MatchRow from './MatchRow'
// import PredictionResult from './PredictionResult'
// import {
//   ArrowUpDown,
//   BarChart2,
//   Zap,
//   Loader2,
//   AlertTriangle,
//   Plus,
//   X,
//   Star,
//   RefreshCw,
// } from 'lucide-react'
// const PredictionHub = () => {
//     const createNewMatch = (matchData = {}) => ({
//       id: crypto.randomUUID(),
//       homeTeam: matchData.home_team || '',
//       awayTeam: matchData.away_team || '',
//       leagueName: matchData.league_name || 'Premier League',
//       oddHome: matchData.odd_home || '',
//       oddDraw: matchData.odd_draw || '',
//       oddAway: matchData.odd_away || '',
//       oddOver85: '',
//       oddOver95: '',
//       oddOver105: '',
//       oddOver115: '',
//       oddOver125: '',
//     })
//   const [matches, setMatches] = useState([])
//   const [predictions, setPredictions] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetchingMatches, setIsFetchingMatches] = useState(true)
//   const [globalError, setGlobalError] = useState('')
//   const [sortKey, setSortKey] = useState('value')

//   const fetchMatches = async () => {
//     setIsFetchingMatches(true)
//     setGlobalError('')
//     setMatches([])
//     try {
//       const response = await fetch('http://127.0.0.1:5001/api/upcoming-matches')
//       const data = await response.json()
//       if (!response.ok)
//         throw new Error(data.error || 'Failed to fetch matches.')
//       if (data.length === 0) {
//         setGlobalError(
//           'No upcoming matches found from the odds API. You can add one manually.'
//         )
//         setMatches([createNewMatch()]) // Add one manual row if none are found
//       } else {
//         setMatches(data.map((match) => createNewMatch(match)))
//         console.log(data)
//       }
//     } catch (err) {
//       setGlobalError(err.message)
//       setMatches([createNewMatch()]) // Add a manual row on error
//     } finally {
//       setIsFetchingMatches(false)
//     }
//   }
//   useEffect(() => {
//     fetchMatches()
//   }, [])

//    const handleMatchChange = (id, field, value) => setMatches(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
//     const addMatch = () => setMatches(prev => [...prev, createNewMatch()]);
//     const removeMatch = (id) => setMatches(prev => prev.filter(m => m.id !== id));

//     const handlePredictAll = async () => {
//         setGlobalError('');
//         setPredictions([]);
//         const validMatches = matches.filter(m => m.homeTeam && m.awayTeam && m.oddHome && m.oddDraw && m.oddAway);
//         if (validMatches.length === 0) {
//             setGlobalError("Please fill in at least one match row with Home/Draw/Away odds.");
//             return;
//         }
//         setIsLoading(true);
//         const predictionResults = [];
//         for (const match of validMatches) {
//             const payload = {
//                 home_team: match.homeTeam, away_team: match.awayTeam, league_name: match.leagueName,
//                 odd_home: parseFloat(match.oddHome), odd_draw: parseFloat(match.oddDraw), odd_away: parseFloat(match.oddAway)
//             };
//             try {
//                 const response = await fetch('http://127.0.0.1:5001/api/predict', {
//                     method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
//                 });
//                 const data = await response.json();
//                 if (!response.ok) throw new Error(data.error || 'Prediction failed');
//                 predictionResults.push({ input: match, data });
//             } catch (err) {
//                 predictionResults.push({ input: match, error: err.message });
//             }
//         }
//         setPredictions(predictionResults);
//         setIsLoading(false);
//     };

//   const sortedPredictions = useMemo(() => {
//     return [...predictions].sort((a, b) => {
//       if (a.error || !a.data) return 1
//       if (b.error || !b.data) return -1
//       switch (sortKey) {
//         case 'value':
//           return (b.valueBetInfo?.value || -1) - (a.valueBetInfo?.value || -1)
//         case 'probability':
//           return b.data.probability_over_10_5 - a.data.probability_over_10_5
//         case 'corners':
//           return b.data.predicted_total_corners - a.data.predicted_total_corners
//         default:
//           return 0
//       }
//     })
//   }, [predictions, sortKey])
//   return (
//     <>
//       <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto'>
//         <div className='flex justify-between items-center mb-6'>
//           <div>
//             <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
//               Prediction Hub
//             </h2>
//             <p className='text-gray-500 dark:text-gray-400'>
//               Upcoming matches are loaded automatically.
//             </p>
//           </div>
//           <button
//             onClick={fetchMatches}
//             disabled={isFetchingMatches}
//             className='bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-md flex items-center transition-colors disabled:opacity-50'
//           >
//             {isFetchingMatches ? (
//               <Loader2 className='animate-spin' />
//             ) : (
//               <RefreshCw size={18} />
//             )}
//           </button>
//         </div>

//         {isFetchingMatches && (
//           <div className='flex justify-center items-center my-10'>
//             <Loader2 className='animate-spin h-8 w-8 text-green-500' />
//           </div>
//         )}

//         {!isFetchingMatches && (
//           <div className='space-y-4'>
//             {matches.map((match) => (
//               <MatchRow
//                 key={match.id}
//                 match={match}
//                 matchesCount={matches.length}
//                 onRemove={removeMatch}
//                 onChange={handleMatchChange}
//               />
//             ))}
//           </div>
//         )}

//         <div className='flex justify-between items-center mt-6'>
//           <button
//             onClick={addMatch}
//             className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors'
//           >
//             <Plus size={18} className='mr-2' /> Add Manual Match
//           </button>
//           <button
//             onClick={handlePredictAll}
//             disabled={isLoading || isFetchingMatches}
//             className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-400 text-lg'
//           >
//             {isLoading ? (
//               <Loader2 className='animate-spin mr-2' />
//             ) : (
//               <Zap className='mr-2' />
//             )}
//             {isLoading ? 'Calculating...' : 'Get All Predictions'}
//           </button>
//         </div>
//       </div>
//       {globalError && (
//         <div className='max-w-4xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center'>
//           <AlertTriangle className='h-5 w-5 mr-3' /> {globalError}
//         </div>
//       )}
//       {sortedPredictions.length > 0 && (
//         <div className='max-w-4xl mx-auto mt-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center space-x-2'>
//           <span className='font-semibold mr-2'>
//             <ArrowUpDown size={16} className='inline-block' /> Sort by:
//           </span>
//           <button
//             onClick={() => setSortKey('value')}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               sortKey === 'value'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-white dark:bg-gray-600'
//             }`}
//           >
//             Highest Value
//           </button>
//           <button
//             onClick={() => setSortKey('probability')}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               sortKey === 'probability'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-white dark:bg-gray-600'
//             }`}
//           >
//             Highest Probability
//           </button>
//           <button
//             onClick={() => setSortKey('corners')}
//             className={`px-3 py-1 rounded-md text-sm font-medium ${
//               sortKey === 'corners'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-white dark:bg-gray-600'
//             }`}
//           >
//             Most Corners
//           </button>
//         </div>
//       )}
//       <div className='max-w-4xl mx-auto'>
//         {sortedPredictions.map((p) => (
//           <PredictionResult key={p.input.id} result={p} />
//         ))}
//       </div>
//     </>
//   )
// };
// export default PredictionHub
import React, { useEffect, useMemo, useState } from 'react'
import MatchRow from './MatchRow'
import PredictionResult from './PredictionResult'
import {
  ArrowUpDown,
  Zap,
  Loader2,
  AlertTriangle,
  Plus,
  RefreshCw,
} from 'lucide-react'

const createNewMatch = (matchData = {}) => ({
  id: crypto.randomUUID(),
  homeTeam: matchData.home_team || '',
  awayTeam: matchData.away_team || '',
  leagueName: matchData.league_name || 'Premier League',
  oddHome: matchData.odd_home || '',
  oddDraw: matchData.odd_draw || '',
  oddAway: matchData.odd_away || '',
  oddOver85: '',
  oddOver95: '',
  oddOver105: '',
  oddOver115: '',
  oddOver125: '',
})

const PredictionHub = () => {
  const [matches, setMatches] = useState([])
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMatches, setIsFetchingMatches] = useState(true)
  const [globalError, setGlobalError] = useState('')
  const [sortKey, setSortKey] = useState('value')

  const fetchMatches = async () => {
    setIsFetchingMatches(true)
    setGlobalError('')
    setPredictions([]) // Clear old predictions when fetching new matches
    setMatches([])
    try {
      const response = await fetch('/upcoming_matches.json') 
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch matches.')
      if (data.length === 0) {
        setGlobalError(
          'No upcoming matches found from the odds API. You can add one manually.'
        )
        setMatches([createNewMatch()])
      } else {
        setMatches(data.map((match) => createNewMatch(match)))
      }
    } catch (err) {
      setGlobalError(err.message)
      setMatches([createNewMatch()])
    } finally {
      setIsFetchingMatches(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const handleMatchChange = (id, field, value) =>
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  const addMatch = () => setMatches((prev) => [...prev, createNewMatch()])
  const removeMatch = (id) =>
    setMatches((prev) => prev.filter((m) => m.id !== id))

  const handlePredictAll = async () => {
    setGlobalError('')
    setPredictions([])
    const validMatches = matches.filter(
      (m) => m.homeTeam && m.awayTeam && m.oddHome && m.oddDraw && m.oddAway
    )
    if (validMatches.length === 0) {
      setGlobalError(
        'Please fill in at least one match row with Home/Draw/Away odds.'
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
        const response = await fetch(
          'https://corner-predictor-api.onrender.com/api/predict',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        )
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

  const sortedPredictions = useMemo(() => {
    // First, calculate value bet info for each prediction
    const predictionsWithValues = predictions.map((p) => {
      if (p.error || !p.data) return p

      // Find the best value bet for the O/U 10.5 line to use for sorting
      const oddOver = p.input.oddOver105
      const overProb = p.data.probabilities.over_10_5
      let value = -1

      if (oddOver) {
        value = overProb * parseFloat(oddOver) - 1
      }

      return { ...p, value: value > 0.05 ? value : -1 }
    })

    // Now, sort based on the calculated value or other keys
    return predictionsWithValues.sort((a, b) => {
      if (a.error || !a.data) return 1
      if (b.error || !b.data) return -1
      switch (sortKey) {
        case 'value':
          return b.value - a.value
        case 'probability':
          return b.data.probabilities.over_10_5 - a.data.probabilities.over_10_5
        case 'corners':
          return b.data.predicted_total_corners - a.data.predicted_total_corners
        default:
          return 0
      }
    })
  }, [predictions, sortKey])

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
              <MatchRow
                key={match.id}
                match={match}
                matchesCount={matches.length}
                onRemove={removeMatch}
                onChange={handleMatchChange}
              />
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
          <AlertTriangle className='h-5 w-5 mr-3' /> {globalError}
        </div>
      )}
      {sortedPredictions.length > 0 && (
        <div className='max-w-4xl mx-auto mt-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center space-x-2'>
          <span className='font-semibold mr-2'>
            <ArrowUpDown size={16} className='inline-block' /> Sort by (O/U
            10.5):
          </span>
          <button
            onClick={() => setSortKey('value')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              sortKey === 'value'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-600'
            }`}
          >
            Highest Value
          </button>
          <button
            onClick={() => setSortKey('probability')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              sortKey === 'probability'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-600'
            }`}
          >
            Highest Probability
          </button>
          <button
            onClick={() => setSortKey('corners')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              sortKey === 'corners'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-600'
            }`}
          >
            Most Corners
          </button>
        </div>
      )}
      <div className='max-w-4xl mx-auto'>
        {sortedPredictions.map((p) => (
          <PredictionResult key={p.input.id} result={p} />
        ))}
      </div>
    </>
  )
}

export default PredictionHub
