import React from 'react'
import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X } from 'lucide-react'

const ChatgptPredictionResult = ({ result }) => {
  if (!result || !result.input) return null

  const { homeTeam, awayTeam, oddOver } = result.input

  // --- VALUE BET CALCULATION ---
  let valueBetInfo = null
  if (!result.error && oddOver) {
    const value = result.data['probability_over_10.5'] * parseFloat(oddOver) - 1
    if (value > 0) {
      valueBetInfo = {
        value: value,
        text: `Value: ${(value * 100).toFixed(2)}%`,
        className: value > 0.1 ? 'border-green-500' : 'border-yellow-500',
      }
    }
  }

//   {
//     "away_team": {
//       "country": "England",
//       "logo_url": "",
//       "name": "Newcastle"
//     },
//     "date": "2025-07-27T10:42:15.468Z",
//     "home_team": {
//       "country": "England",
//       "logo_url": "",
//       "name": "Aston Villa"
//     },
//     "league": "Premier League",
//     "model_cls_over_flag": 1,
//     "model_corner_line": 9.0,
//     "model_ensemble_over_flag": 1,
//     "model_pred_total_corners": 10.913187026977539,
//     "model_prob_over": 0.6066035628318787,
//     "model_reg_over_flag": 1,
//     "model_value_edge": 0.07184422016143799
//   }
// ]

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
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
            <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
                Predicted Corners
              </h3>
              <p className='text-4xl font-bold text-green-500'>
                {result.data.model_pred_total_corners}
              </p>
            </div>
            <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
                Over 10.5 Prob.
              </h3>
              <p className='text-4xl font-bold text-blue-500'>
                {(result.data.model_prob_over * 100).toFixed(1)}%
              </p>
            </div>
            <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
              <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
                Under 10.5 Prob.
              </h3>
              <p className='text-4xl font-bold text-purple-500'>
                {(result.data['probability_under_10.5'] * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatgptPredictionResult
