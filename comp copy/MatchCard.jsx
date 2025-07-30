const MatchCard = ({ match }) => {
  const valueColor = match.value > 0 ? 'text-green-400' : 'text-red-400'
  const confidenceColor =
    match.confidence > 0.85
      ? 'text-green-400'
      : match.confidence > 0.7
      ? 'text-yellow-400'
      : 'text-red-400'

  return (
    <div className='bg-gray-800 rounded-lg shadow-lg p-4 hover:bg-gray-700 transition-all duration-300'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-xs text-gray-400'>{match.league}</p>
          <div className='flex items-center gap-2'>
            <img
              src={match.home_team.logo_url}
              alt={match.home_team.name}
              className='w-6 h-6'
            />
            <span>{match.home_team.name}</span>
            <span className='mx-1'>vs</span>
            <img
              src={match.away_team.logo_url}
              alt={match.away_team.name}
              className='w-6 h-6'
            />
            <span>{match.away_team.name}</span>
          </div>

          {/* <p className='font-bold text-lg'>
            {match.home_team.name} vs {match.away_team.name}
          </p> */}

          <p className='text-sm text-gray-300'>
            {new Date(match.date).toLocaleString()}
          </p>
        </div>
        <div className={`text-lg font-bold ${valueColor}`}>
          {match.value > 0
            ? `+${(match.value * 100).toFixed(1)}%`
            : `${(match.value * 100).toFixed(1)}%`}
          <p className='text-xs font-normal text-gray-400 text-right'>Value</p>
        </div>
      </div>
      <div className='mt-4 grid grid-cols-3 gap-4 text-center'>
        <div>
          <p className='text-2xl font-semibold text-white'>
            {match.predictedCorners.toFixed(1)}
          </p>
          <p className='text-xs text-gray-400'>Predicted Corners</p>
        </div>
        <div>
          <p className='text-2xl font-semibold text-white'>
            {(match.overProb * 100).toFixed(0)}%
          </p>
          <p className='text-xs text-gray-400'>Over 9.5 Prob.</p>
        </div>
        <div>
          <p className={`text-2xl font-semibold ${confidenceColor}`}>
            {(match.confidence * 100).toFixed(0)}%
          </p>
          <p className='text-xs text-gray-400'>Confidence</p>
        </div>
      </div>
    </div>
  )
}
export default MatchCard