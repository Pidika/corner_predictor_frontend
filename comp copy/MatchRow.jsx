// import React from 'react'
// import Logo from './Logo'

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


// const MatchRow = ({ match, onRemove, onChange, matchesCount }) => {
//   const LEAGUES = [
//     'Premier League',
//     'La Liga',
//     'Serie A',
//     'Bundesliga',
//     'Ligue 1',
//   ]
//   return (
//     <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative'>
//       {matchesCount > 1 && (
//         <button
//           onClick={() => onRemove(match.id)}
//           className='absolute top-2 right-2 text-gray-400 hover:text-red-500'
//         >
//           <X size={18} />
//         </button>
//       )}
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
//         <Logo teamName={match.homeTeam} />
//         <input
//           type='text'
//           value={match.homeTeam}
//           onChange={(e) => onChange(match.id, 'homeTeam', e.target.value)}
//           placeholder='Home Team'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         />
//         <Logo teamName={match.awayTeam} />
//         <input
//           type='text'
//           value={match.awayTeam}
//           onChange={(e) => onChange(match.id, 'awayTeam', e.target.value)}
//           placeholder='Away Team'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         />
//       </div>
//       <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
//         <select
//           value={match.leagueName}
//           onChange={(e) => onChange(match.id, 'leagueName', e.target.value)}
//           className='col-span-2 md:col-span-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         >
//           {LEAGUES.map((league) => (
//             <option key={league} value={league}>
//               {league}
//             </option>
//           ))}
//         </select>
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddHome}
//           onChange={(e) => onChange(match.id, 'oddHome', e.target.value)}
//           placeholder='Home Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddDraw}
//           onChange={(e) => onChange(match.id, 'oddDraw', e.target.value)}
//           placeholder='Draw Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddAway}
//           onChange={(e) => onChange(match.id, 'oddAway', e.target.value)}
//           placeholder='Away Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
//         />
//       </div>
//       <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddOver85}
//           onChange={(e) => onChange(match.id, 'oddOver85', e.target.value)}
//           placeholder='O/U 8.5 Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddOver95}
//           onChange={(e) => onChange(match.id, 'oddOver95', e.target.value)}
//           placeholder='O/U 9.5 Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddOver105}
//           onChange={(e) => onChange(match.id, 'oddOver105', e.target.value)}
//           placeholder='O/U 10.5 Odd'
//           className='w-full p-2 border border-green-500 dark:border-green-400 rounded-md bg-green-50 dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddOver115}
//           onChange={(e) => onChange(match.id, 'oddOver115', e.target.value)}
//           placeholder='O/U 11.5 Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
//         />
//         <input
//           type='number'
//           step='0.01'
//           value={match.oddOver125}
//           onChange={(e) => onChange(match.id, 'oddOver125', e.target.value)}
//           placeholder='O/U 12.5 Odd'
//           className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
//         />
//       </div>
//     </div>
//   )
// }
// export default MatchRow
import React from 'react'
import { X } from 'lucide-react'
import Logo from './Logo' // Assuming Logo component is in a separate file

// Moved outside the component to prevent re-creation on every render
const LEAGUES = [
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
]

const MatchRow = ({ match, onRemove, onChange, matchesCount }) => {
  return (
    <div className='p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative'>
      {matchesCount > 1 && (
        <button
          onClick={() => onRemove(match.id)}
          className='absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors'
          aria-label='Remove Match'
        >
          <X size={18} />
        </button>
      )}

      {/* --- Team Inputs (Responsive Fix) --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div className='flex items-center space-x-2'>
          <Logo teamName={match.homeTeam} />
          <input
            type='text'
            value={match.homeTeam}
            onChange={(e) => onChange(match.id, 'homeTeam', e.target.value)}
            placeholder='Home Team'
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
            aria-label='Home Team Input'
          />
        </div>
        <div className='flex items-center space-x-2'>
          <Logo teamName={match.awayTeam} />
          <input
            type='text'
            value={match.awayTeam}
            onChange={(e) => onChange(match.id, 'awayTeam', e.target.value)}
            placeholder='Away Team'
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
            aria-label='Away Team Input'
          />
        </div>
      </div>

      {/* --- 1x2 Odds Inputs --- */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
        <select
          value={match.leagueName}
          onChange={(e) => onChange(match.id, 'leagueName', e.target.value)}
          className='col-span-2 md:col-span-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
          aria-label='League Selection'
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
          onChange={(e) => onChange(match.id, 'oddHome', e.target.value)}
          placeholder='Home Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
          aria-label='Home Win Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddDraw}
          onChange={(e) => onChange(match.id, 'oddDraw', e.target.value)}
          placeholder='Draw Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
          aria-label='Draw Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddAway}
          onChange={(e) => onChange(match.id, 'oddAway', e.target.value)}
          placeholder='Away Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
          aria-label='Away Win Odd'
        />
      </div>

      {/* --- Corner Odds Inputs --- */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        <input
          type='number'
          step='0.01'
          value={match.oddOver85}
          onChange={(e) => onChange(match.id, 'oddOver85', e.target.value)}
          placeholder='O/U 8.5 Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
          aria-label='Over/Under 8.5 Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddOver95}
          onChange={(e) => onChange(match.id, 'oddOver95', e.target.value)}
          placeholder='O/U 9.5 Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
          aria-label='Over/Under 9.5 Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddOver105}
          onChange={(e) => onChange(match.id, 'oddOver105', e.target.value)}
          placeholder='O/U 10.5 Odd'
          className='w-full p-2 border border-green-500 dark:border-green-400 rounded-md bg-green-50 dark:bg-gray-700'
          aria-label='Over/Under 10.5 Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddOver115}
          onChange={(e) => onChange(match.id, 'oddOver115', e.target.value)}
          placeholder='O/U 11.5 Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
          aria-label='Over/Under 11.5 Odd'
        />
        <input
          type='number'
          step='0.01'
          value={match.oddOver125}
          onChange={(e) => onChange(match.id, 'oddOver125', e.target.value)}
          placeholder='O/U 12.5 Odd'
          className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-green-50 dark:bg-gray-700'
          aria-label='Over/Under 12.5 Odd'
        />
      </div>
    </div>
  )
}

export default MatchRow
