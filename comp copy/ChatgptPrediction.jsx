import React, { useEffect, useMemo, useState } from 'react'
import { TEAMS } from './Teams'

import ChatgptPredictionResult from './ChatgptPredictionResult'
import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X } from 'lucide-react'
const ChatgptPrediction = () => {
  const createNewMatch = () => ({
    id: crypto.randomUUID(),
    homeTeam: '',
    awayTeam: '',
    leagueName: 'Premier League',
    oddHome: '',
    oddDraw: '',
    oddAway: '',
    oddOver: '',
    oddUnder: '', // New field for Over 10.5 odds
  })

  const [matches, setMatches] = useState([createNewMatch()])
  const [predictions, setPredictions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const LEAGUES = [
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
  ]

  const handleMatchChange = (id, field, value) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === id ? { ...match, [field]: value } : match
      )
    )
  }
  const addMatch = () => setMatches((prev) => [...prev, createNewMatch()])
  const removeMatch = (id) =>
    setMatches((prev) => prev.filter((match) => match.id !== id))

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
        m.oddOver &&
        m.oddUnder
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
      const payload = validMatches.map((match) => ({
        league: match.leagueName,
        date: new Date().toISOString(), // or specific match date if available
        home_team: {
          name: match.homeTeam,
          country: 'England', // optional: pass real country
          logo_url: '', // optional: pass real logo
        },
        away_team: {
          name: match.awayTeam,
          country: 'England',
          logo_url: '',
        },
        OddHome: parseFloat(match.oddHome),
        OddDraw: parseFloat(match.oddDraw),
        OddAway: parseFloat(match.oddAway),
        odds_over_corners: parseFloat(match.oddOver),
        odds_under_corners: parseFloat(match.oddUnder),
      }))

      console.log(payload)

      try {
        const response = await fetch(
          'http://127.0.0.1:5001/api/predict-fixtures',
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

  return (
    <>
      <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white mb-1'>
          Prediction Hub
        </h2>
        <p className='text-center text-gray-500 dark:text-gray-400 mb-6'>
          Add matches and get predictions for all of them at once.
        </p>
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
                <select
                  value={match.homeTeam}
                  onChange={(e) =>
                    handleMatchChange(match.id, 'homeTeam', e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  aria-label='Home Team'
                >
                  <option value=''>Select Home Team</option>
                  {TEAMS.filter((t) => t !== match.awayTeam).map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                <select
                  value={match.awayTeam}
                  onChange={(e) =>
                    handleMatchChange(match.id, 'awayTeam', e.target.value)
                  }
                  className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
                  aria-label='Away Team'
                >
                  <option value=''>Select Away Team</option>
                  {TEAMS.filter((t) => t !== match.homeTeam).map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
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
                <input
                  type='number'
                  step='0.01'
                  value={match.oddUnder}
                  onChange={(e) =>
                    handleMatchChange(match.id, 'oddUnder', e.target.value)
                  }
                  placeholder='Under 10.5 Odd'
                  className='w-full p-2 border border-green-500 dark:border-green-400 rounded-md bg-green-50 dark:bg-gray-700'
                />
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-between items-center mt-6'>
          <button
            onClick={addMatch}
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors'
          >
            <Plus size={18} className='mr-2' /> Add Match
          </button>
          <button
            onClick={handlePredictAll}
            disabled={isLoading}
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
          <ChatgptPredictionResult key={p.input.id} result={p} />
        ))}
      </div>
    </>
  )
}

export default ChatgptPrediction
