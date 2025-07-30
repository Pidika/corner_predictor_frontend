import Icon from "./Icon"
import MatchCard from "./MatchCard"
const LeagueAccordion = ({
  leagueName,
  leagueLogo,
  matches,
  isOpen,
  onToggle,
}) => {


     const ChevronDownIcon = ({ className }) => (
       <Icon path='M19.5 8.25l-7.5 7.5-7.5-7.5' className={className} />
     )
     
  return (
    <div className='ml-4'>
      <button
        onClick={onToggle}
        className='w-full flex justify-between items-center p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-left'
      >
        <div className='flex items-center'>
          <img src={leagueLogo} alt={leagueName} className='w-6 h-6 mr-3' />
          <span className='font-semibold text-white'>{leagueName}</span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className='py-2 pl-4 border-l-2 border-gray-700 space-y-3'>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  )
}
export default LeagueAccordion
