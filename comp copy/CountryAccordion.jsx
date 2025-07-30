import LeagueAccordion from "./LeagueAccordion"
const CountryAccordion = ({ countryName, countryFlag, leagues }) => (
  <div className='bg-gray-800/50 rounded-lg overflow-hidden mb-4'>
    <div className='flex items-center p-4 bg-gray-900/70'>
      <img
        src={countryFlag}
        alt={countryName}
        className='w-6 mr-4 rounded-sm'
      />
      <h3 className='text-xl font-bold text-white'>{countryName}</h3>
    </div>
    <div className='p-2 space-y-2'>
      {Object.entries(leagues).map(([leagueName, leagueData]) => (
        <LeagueAccordion
          key={leagueName}
          leagueName={leagueName}
          leagueLogo={leagueData.logo}
          matches={leagueData.matches}
          isOpen={leagueData.isOpen}
          onToggle={leagueData.onToggle}
        />
      ))}
    </div>
  </div>
)
export default CountryAccordion