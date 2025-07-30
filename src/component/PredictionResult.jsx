// import React, {useMemo} from 'react'
// import {
//   BarChart2,
//   Zap,
//   Loader2,
//   AlertTriangle,
//   Plus,
//   X,
//   Star,
// } from 'lucide-react'
// import Logo from './Logo'

// const PredictionResult = ({ result }) => {
//   if (!result || !result.input) return null
//   const { homeTeam, awayTeam } = result.input


//   const sortedProbabilities = useMemo(() => {
//     if (!result.data || !result.data.probabilities) return []
//     return Object.entries(result.data.probabilities).sort((a, b) => {
//       const lineA = parseFloat(a[0].split('_')[1].replace('_', '.'))
//       const lineB = parseFloat(b[0].split('_')[1].replace('_', '.'))
//       return lineA - lineB
//     })
//   }, [result.data])

//   return (
//     <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 animate-fade-in'>
//       <div className='flex justify-center items-center text-xl font-bold text-center text-gray-800 dark:text-white mb-4'>
//         <Logo teamName={homeTeam} />
//         <span>{homeTeam}</span>
//         <span className='mx-4 text-gray-400 text-base'>vs.</span>
//         <span>{awayTeam}</span>
//         <Logo teamName={awayTeam} />
//       </div>
//       {result.error ? (
//         <div className='p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-center'>
//           <AlertTriangle className='h-5 w-5 mr-3' />
//           <p>{result.error}</p>
//         </div>
//       ) : (
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//           <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center md:col-span-1'>
//             <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
//               Predicted Total Corners
//             </h3>
//             <p className='text-5xl font-bold text-green-500 mt-2'>
//               {result.data.predicted_total_corners}
//             </p>
//           </div>
//           <div className='md:col-span-2'>
//             <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
//               <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
//                 <tr>
//                   <th scope='col' className='px-4 py-2'>
//                     Market
//                   </th>
//                   <th scope='col' className='px-4 py-2 text-center'>
//                     Over Prob.
//                   </th>
//                   <th scope='col' className='px-4 py-2 text-center'>
//                     Under Prob.
//                   </th>
//                   <th scope='col' className='px-4 py-2 text-center'>
//                     Value Bet?
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedProbabilities.map(([key, overProb]) => {
//                   const line = key.split('_')[1].replace('_', '.')
//                   const underProb = 1 - overProb
//                   const oddOver =
//                     result.input[`oddOver${line.replace('.', '')}`]
//                   let valueInfo = { text: '-', className: 'text-gray-500' }
//                   if (oddOver) {
//                     const value = overProb * parseFloat(oddOver) - 1
//                     if (value > 0.05) {
//                       // Using a 5% value threshold
//                       valueInfo = {
//                         text: `+${(value * 100).toFixed(1)}%`,
//                         className: 'text-green-500 font-bold',
//                       }
//                     }
//                   }
//                   return (
//                     <tr
//                       key={key}
//                       className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'
//                     >
//                       <td className='px-4 py-2 font-medium text-gray-900 dark:text-white'>
//                         Over/Under {line}
//                       </td>
//                       <td className='px-4 py-2 text-center text-blue-500 font-semibold'>
//                         {(overProb * 100).toFixed(1)}%
//                       </td>
//                       <td className='px-4 py-2 text-center text-purple-500 font-semibold'>
//                         {(underProb * 100).toFixed(1)}%
//                       </td>
//                       <td
//                         className={`px-4 py-2 text-center ${valueInfo.className}`}
//                       >
//                         {valueInfo.text}
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
// export default PredictionResult
import React, { useMemo } from 'react'
import { AlertTriangle, Star } from 'lucide-react'
import Logo from './Logo' // Assuming Logo component is in a separate file

const PredictionResult = ({ result }) => {
  if (!result || !result.input) return null

  const { homeTeam, awayTeam } = result.input

  // Memoize the sorted probabilities to avoid recalculating on every render
  const sortedProbabilities = useMemo(() => {
    if (!result.data || !result.data.probabilities) return []
    return Object.entries(result.data.probabilities).sort((a, b) => {
      const lineA = parseFloat(a[0].split('_')[1].replace('_', '.'))
      const lineB = parseFloat(b[0].split('_')[1].replace('_', '.'))
      return lineA - lineB
    })
  }, [result.data])

  // --- VALUE BET CALCULATION ---
  // This calculates the single best value bet to highlight the entire card
  const bestValueBet = useMemo(() => {
    let bestBet = null
    if (result.data && result.data.probabilities) {
      for (const [key, overProb] of sortedProbabilities) {
        const line = key.split('_')[1].replace('_', '.')
        const oddOver = result.input[`oddOver${line.replace('.', '')}`]
        if (oddOver) {
          const value = overProb * parseFloat(oddOver) - 1
          if (value > 0.05 && (!bestBet || value > bestBet.value)) {
            bestBet = {
              value: value,
              text: `Value: +${(value * 100).toFixed(1)}% on O/U ${line}`,
              className: value > 0.1 ? 'border-green-500' : 'border-yellow-500',
            }
          }
        }
      }
    }
    return bestBet
  }, [result, sortedProbabilities])

  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sm:p-6 mt-6 animate-fade-in border-4 ${
        bestValueBet ? bestValueBet.className : 'border-transparent'
      }`}
    >
      {bestValueBet && (
        <div className='flex items-center justify-center mb-3 text-base sm:text-lg font-bold text-green-600 dark:text-green-400'>
          <Star className='h-5 w-5 sm:h-6 sm:w-6 mr-2 text-yellow-400' />
          VALUE BET IDENTIFIED
        </div>
      )}

      <div className='flex justify-center items-center text-lg sm:text-xl font-bold text-center text-gray-800 dark:text-white mb-4'>
        <Logo teamName={homeTeam} />
        <span className='truncate'>{homeTeam}</span>
        <span className='mx-2 sm:mx-4 text-gray-400 text-base'>vs.</span>
        <span className='truncate'>{awayTeam}</span>
        <Logo teamName={awayTeam} />
      </div>

      {result.error ? (
        <div className='p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-center'>
          <AlertTriangle className='h-5 w-5 mr-3' />
          <p>{result.error}</p>
        </div>
      ) : (
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center flex-shrink-0'>
            <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
              Predicted Corners
            </h3>
            <p className='text-4xl sm:text-5xl font-bold text-green-500 mt-2'>
              {result.data.predicted_total_corners}
            </p>
          </div>
          <div className='flex-grow overflow-x-auto'>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-2 sm:px-4 py-2'>
                    Market
                  </th>
                  <th scope='col' className='px-2 sm:px-4 py-2 text-center'>
                    Over Prob.
                  </th>
                  <th scope='col' className='px-2 sm:px-4 py-2 text-center'>
                    Under Prob.
                  </th>
                  <th scope='col' className='px-2 sm:px-4 py-2 text-center'>
                    Value?
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedProbabilities.map(([key, overProb]) => {
                  const line = key.split('_')[1].replace('_', '.')
                  const underProb = 1 - overProb
                  const oddOver =
                    result.input[`oddOver${line.replace('.', '')}`]
                  let valueInfo = { text: '-', className: 'text-gray-500' }
                  if (oddOver) {
                    const value = overProb * parseFloat(oddOver) - 1
                    if (value > 0.05) {
                      // 5% value threshold
                      valueInfo = {
                        text: `+${(value * 100).toFixed(1)}%`,
                        className: 'text-green-500 font-bold',
                      }
                    }
                  }
                  return (
                    <tr
                      key={key}
                      className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'
                    >
                      <td className='px-2 sm:px-4 py-2 font-medium text-gray-900 dark:text-white'>
                        O/U {line}
                      </td>
                      <td className='px-2 sm:px-4 py-2 text-center text-blue-500 font-semibold'>
                        {(overProb * 100).toFixed(1)}%
                      </td>
                      <td className='px-2 sm:px-4 py-2 text-center text-purple-500 font-semibold'>
                        {(underProb * 100).toFixed(1)}%
                      </td>
                      <td
                        className={`px-2 sm:px-4 py-2 text-center ${valueInfo.className}`}
                      >
                        {valueInfo.text}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionResult