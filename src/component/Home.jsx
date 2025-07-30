// // import React, { useState, useEffect, useMemo } from 'react'

// // import Header from './Header'
// // import Filters from './Filters'
// // import Footer from './Footer'
// // import TopValueBets from './TopValueBets'
// // import MatchCard from './MatchCard'
// // import PerformanceChart from './PerformanceChart'
// // import Icon from './Icon'
// // import LoadingSpinner from '../utils/LoadingSpinner'
// // import ErrorMessage from '../utils/ErrorMessage'
// // import CountryAccordion from './CountryAccordion'
// // const Home = () => {
// //   const [rawMatches, setRawMatches] = useState([])
// //   const [openAccordions, setOpenAccordions] = useState({})
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState(null)
// //   const [filters, setFilters] = useState({
// //     date: new Date().toISOString().slice(0, 10),
// //     league: '',
// //     search: '',
// //   })

// //   const toggleAccordion = (leagueName) => {
// //     setOpenAccordions((prev) => ({ ...prev, [leagueName]: !prev[leagueName] }))
// //   }

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target
// //     setFilters((prev) => ({ ...prev, [name]: value }))
// //   }

// //   // --- HIGHLIGHT START: Updated useEffect to fetch from local backend ---
// //   useEffect(() => {
// //     const fetchMatches = async () => {
// //       setLoading(true)
// //       setError(null)

// //       // Fetch from our own Flask backend
// //       // const url = `http://127.0.0.1:5001/api/matches?date=${filters.date}`
// //       const url = `http://127.0.0.1:5001/api/predictions?date=${filters.date}`

// //       try {
// //         const response = await fetch(url)
// //         if (!response.ok) {
// //           throw new Error(
// //             `HTTP error! status: ${response.status}. Make sure the backend server is running.`
// //           )
// //         }
// //         const data = await response.json()

// //         // Add placeholder prediction data until our model is ready
// //         const matchesWithPredictions = data.map((match) => ({
// //           ...match,
// //           predictedCorners: 9.5 + Math.random() * 5,
// //           overProb: 0.4 + Math.random() * 0.4,
// //           value: Math.random() * 0.6 - 0.1,
// //           confidence: 0.7 + Math.random() * 0.29,
// //         }))

// //         setRawMatches(matchesWithPredictions)
// //       } catch (err) {
// //         setError(err.message)
// //         console.error('Fetch error:', err)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }

// //     fetchMatches()
// //   }, [filters.date])
// //   // --- HIGHLIGHT END ---

// //   // --- HIGHLIGHT START: Updated data grouping and filtering logic ---
// //   const { groupedMatches, availableLeagues } = useMemo(() => {
// //     const searchTerm = filters.search.toLowerCase()

// //     const grouped = rawMatches.reduce((acc, match) => {
// //       const country = match.home_team.country
// //       const league = match.league

// //       // Filter by league
// //       if (filters.league && match.league !== filters.league) {
// //         return acc
// //       }

// //       // Filter by search term
// //       if (
// //         searchTerm &&
// //         !match.home_team.name.toLowerCase().includes(searchTerm) &&
// //         !match.away_team.name.toLowerCase().includes(searchTerm)
// //       ) {
// //         return acc
// //       }

// //       if (!acc[country]) {
// //         acc[country] = { flag: match.home_team.logo_url, leagues: {} } // Use a team logo as a pseudo flag
// //       }
// //       if (!acc[country].leagues[league]) {
// //         acc[country].leagues[league] = {
// //           logo: match.home_team.logo_url,
// //           matches: [],
// //         }
// //       }
// //       acc[country].leagues[league].matches.push(match)
// //       return acc
// //     }, {})

// //     const availableLeagues = [
// //       ...new Set(rawMatches.map((m) => m.league)),
// //     ].sort()

// //     return { groupedMatches: grouped, availableLeagues }
// //   }, [rawMatches, filters.league, filters.search])
// //   // --- HIGHLIGHT END ---

// //   const renderContent = () => {
// //     if (loading) return <LoadingSpinner />
// //     if (error) return <ErrorMessage message={error} />
// //     const countries = Object.keys(groupedMatches)
// //     if (countries.length === 0)
// //       return (
// //         <p className='text-center text-gray-400 py-8'>
// //           No matches found for the selected date or filters.
// //         </p>
// //       )

// //     return (
// //       <div className='space-y-4'>
// //         {countries.map((countryName) => {
// //           const countryData = groupedMatches[countryName]
// //           const leaguesWithToggle = Object.entries(countryData.leagues).reduce(
// //             (acc, [leagueName, leagueData]) => {
// //               acc[leagueName] = {
// //                 ...leagueData,
// //                 isOpen: !!openAccordions[leagueName],
// //                 onToggle: () => toggleAccordion(leagueName),
// //               }
// //               return acc
// //             },
// //             {}
// //           )
// //           return (
// //             <CountryAccordion
// //               key={countryName}
// //               countryName={countryName}
// //               countryFlag={countryData.flag}
// //               leagues={leaguesWithToggle}
// //             />
// //           )
// //         })}
// //       </div>
// //     )
// //   }

// //   const allFilteredMatches = Object.values(groupedMatches)
// //     .flatMap((country) => Object.values(country.leagues))
// //     .flatMap((league) => league.matches)

// //   return (
// //     <div className='bg-gray-900 min-h-screen text-gray-200 font-sans'>
// //       <Header />
// //       <main className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
// //         <div className='mb-8'>
// //           <h2 className='text-3xl font-bold text-white'>Dashboard</h2>
// //           <p className='text-gray-400 mt-1'>Analysis for football matches.</p>
// //         </div>
// //         <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
// //           <div className='lg:col-span-2'>
// //             <Filters
// //               leagues={availableLeagues}
// //               filters={filters}
// //               onFilterChange={handleFilterChange}
// //             />
// //             {renderContent()}
// //           </div>
// //           <div className='space-y-8'>
// //             <TopValueBets matches={allFilteredMatches} />
// //             <PerformanceChart />
// //           </div>
// //         </div>
// //       </main>
// //       <Footer />
// //     </div>
// //   )
// // }

// // export default Home
// // import React, { useState, useMemo } from 'react'
// // import {
// //   BarChart2,
// //   Zap,
// //   Shield,
// //   TrendingUp,
// //   TrendingDown,
// //   Loader2,
// //   AlertTriangle,
// //   ChevronsUpDown,
// // } from 'lucide-react'
// // import { TEAMS } from './Teams'


// // const LEAGUES = [
// //   'Premier League',
// //   'La Liga',
// //   'Serie A',
// //   'Bundesliga',
// //   'Ligue 1',
// // ]

// // const Header = () => (
// //   <header className='bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50'>
// //     <div className='container mx-auto flex justify-between items-center'>
// //       <div className='flex items-center space-x-3'>
// //         <BarChart2 className='h-8 w-8 text-green-400' />
// //         <h1 className='text-xl md:text-2xl font-bold tracking-tight'>
// //           Corner Kick Predictor
// //         </h1>
// //       </div>
// //     </div>
// //   </header>
// // )

// // const PredictionResult = ({ result }) => {
// //   console.log(result)

// //   if (!result) return null
  
// //   const overProb = result['probability_over_10.5'] * 100
// //   const underProb = result['probability_under_10.5'] * 100
// //   return (
// //     <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 animate-fade-in'>
// //       <h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white mb-4'>
// //         Prediction Result
// //       </h2>
// //       <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
// //         <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
// //           <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
// //             Predicted Corners
// //           </h3>
// //           <p className='text-4xl font-bold text-green-500'>
// //             {result.predicted_total_corners}
// //           </p>
// //         </div>
// //         <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
// //           <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
// //             Over 10.5 Prob.
// //           </h3>
// //           <p className='text-4xl font-bold text-blue-500'>
// //             {overProb.toFixed(1)}%
// //           </p>
// //         </div>
// //         <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg'>
// //           <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase'>
// //             Under 10.5 Prob.
// //           </h3>
// //           <p className='text-4xl font-bold text-purple-500'>
// //             {underProb.toFixed(1)}%
// //           </p>
// //         </div>
// //       </div>
// //       <div className='mt-6'>
// //         <h4 className='text-center text-gray-600 dark:text-gray-300 mb-2'>
// //           Probability Distribution
// //         </h4>
// //         <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 flex overflow-hidden'>
// //           <div
// //             className='bg-blue-500 h-6 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-l-full'
// //             style={{ width: `${overProb}%` }}
// //           >
// //             {overProb > 10 && `Over ${overProb.toFixed(0)}%`}
// //           </div>
// //           <div
// //             className='bg-purple-500 h-6 text-xs font-medium text-purple-100 text-center p-1 leading-none rounded-r-full'
// //             style={{ width: `${underProb}%` }}
// //           >
// //             {underProb > 10 && `Under ${underProb.toFixed(0)}%`}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default function App() {
// //   const [homeTeam, setHomeTeam] = useState('')
// //   const [awayTeam, setAwayTeam] = useState('')
// //   const [leagueName, setLeagueName] = useState('Premier League')
// //   const [oddHome, setOddHome] = useState(2.0)
// //   const [oddDraw, setOddDraw] = useState(3.5)
// //   const [oddAway, setOddAway] = useState(3.0)

// //   const [prediction, setPrediction] = useState(null)
// //   const [isLoading, setIsLoading] = useState(false)
// //   const [error, setError] = useState('')

// //   const availableAwayTeams = useMemo(
// //     () => TEAMS.filter((t) => t !== homeTeam),
// //     [homeTeam]
// //   )
// //   const availableHomeTeams = useMemo(
// //     () => TEAMS.filter((t) => t !== awayTeam),
// //     [awayTeam]
// //   )

// //   const handlePredict = async () => {
// //     if (!homeTeam || !awayTeam || !oddHome || !oddDraw || !oddAway) {
// //       setError('Please fill in all fields.')
// //       return
// //     }

// //     setIsLoading(true)
// //     setError('')
// //     setPrediction(null)

// //     const payload = {
// //       home_team: homeTeam,
// //       away_team: awayTeam,
// //       league_name: leagueName,
// //       odd_home: parseFloat(oddHome),
// //       odd_draw: parseFloat(oddDraw),
// //       odd_away: parseFloat(oddAway),
// //     }

// //     try {
// //       const response = await fetch('http://127.0.0.1:5001/api/predict', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(payload),
// //       })

// //       const data = await response.json()

// //       if (!response.ok) {
// //         throw new Error(data.error || 'An unknown error occurred.')
// //       }

// //       setPrediction(data)
// //     } catch (err) {
// //       setError(err.message)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <div className='bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200'>
// //       <Header />
// //       <main className='container mx-auto p-4 md:p-6'>
// //         <div className='bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-2xl mx-auto'>
// //           <h2 className='text-2xl font-bold text-center text-gray-800 dark:text-white mb-1'>
// //             Match Predictor
// //           </h2>
// //           <p className='text-center text-gray-500 dark:text-gray-400 mb-6'>
// //             Enter match details to get a prediction.
// //           </p>

// //           <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
// //             <div>
// //               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //                 Home Team
// //               </label>
// //               <select
// //                 value={homeTeam}
// //                 onChange={(e) => setHomeTeam(e.target.value)}
// //                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //               >
// //                 <option value=''>Select Home Team</option>
// //                 {availableHomeTeams.map((team) => (
// //                   <option key={team} value={team}>
// //                     {team}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div>
// //               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //                 Away Team
// //               </label>
// //               <select
// //                 value={awayTeam}
// //                 onChange={(e) => setAwayTeam(e.target.value)}
// //                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //               >
// //                 <option value=''>Select Away Team</option>
// //                 {availableAwayTeams.map((team) => (
// //                   <option key={team} value={team}>
// //                     {team}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <div className='mb-4'>
// //             <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //               League
// //             </label>
// //             <select
// //               value={leagueName}
// //               onChange={(e) => setLeagueName(e.target.value)}
// //               className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //             >
// //               {LEAGUES.map((league) => (
// //                 <option key={league} value={league}>
// //                   {league}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div className='grid grid-cols-3 gap-4 mb-6'>
// //             <div>
// //               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //                 Home Odd
// //               </label>
// //               <input
// //                 type='number'
// //                 step='0.01'
// //                 value={oddHome}
// //                 onChange={(e) => setOddHome(e.target.value)}
// //                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //               />
// //             </div>
// //             <div>
// //               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //                 Draw Odd
// //               </label>
// //               <input
// //                 type='number'
// //                 step='0.01'
// //                 value={oddDraw}
// //                 onChange={(e) => setOddDraw(e.target.value)}
// //                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //               />
// //             </div>
// //             <div>
// //               <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
// //                 Away Odd
// //               </label>
// //               <input
// //                 type='number'
// //                 step='0.01'
// //                 value={oddAway}
// //                 onChange={(e) => setOddAway(e.target.value)}
// //                 className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700'
// //               />
// //             </div>
// //           </div>

// //           <button
// //             onClick={handlePredict}
// //             disabled={isLoading}
// //             className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-400'
// //           >
// //             {isLoading ? (
// //               <Loader2 className='animate-spin mr-2' />
// //             ) : (
// //               <Zap className='mr-2' />
// //             )}
// //             {isLoading ? 'Calculating...' : 'Get Prediction'}
// //           </button>
// //         </div>

// //         {error && (
// //           <div className='max-w-2xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center'>
// //             <AlertTriangle className='h-5 w-5 mr-3' />
// //             {error}
// //           </div>
// //         )}

// //         <PredictionResult result={prediction} />
// //       </main>
// //     </div>
// //   )
// // }
// import React, { useState, useMemo } from 'react';
// import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X } from 'lucide-react';

// // A curated list of teams from the top 5 leagues for the dropdowns.
// const TEAMS = [
//   // Premier League
//   "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace",
//   "Everton", "Fulham", "Liverpool", "Luton", "Man City", "Man United", "Newcastle",
//   "Nottingham Forest", "Sheffield United", "Tottenham", "West Ham", "Wolves", "Burnley",
//   // La Liga
//   "Alaves", "Almeria", "Athletic Club", "Atletico Madrid", "Barcelona", "Cadiz", "Celta Vigo",
//   "Getafe", "Girona", "Granada", "Las Palmas", "Mallorca", "Osasuna", "Rayo Vallecano",
//   "Real Betis", "Real Madrid", "Real Sociedad", "Sevilla", "Valencia", "Villarreal",
//   // Serie A
//   "AC Milan", "Atalanta", "Bologna", "Cagliari", "Empoli", "Fiorentina", "Frosinone",
//   "Genoa", "Inter", "Juventus", "Lazio", "Lecce", "Monza", "Napoli",
//   "Roma", "Salernitana", "Sassuolo", "Torino", "Udinese", "Verona",
//   // Bundesliga
//   "Augsburg", "Bayer Leverkusen", "Bayern Munich", "Bochum", "Darmstadt", "Dortmund",
//   "Eintracht Frankfurt", "FC Heidenheim", "FC Koln", "Freiburg", "Hoffenheim", "Mainz 05",
//   "Monchengladbach", "RB Leipzig", "Stuttgart", "Union Berlin", "Werder Bremen", "Wolfsburg",
//   // Ligue 1
//   "Brest", "Clermont Foot", "Le Havre", "Lens", "Lille", "Lorient", "Lyon",
//   "Marseille", "Metz", "Monaco", "Montpellier", "Nantes", "Nice", "Paris SG",
//   "Reims", "Rennes", "Strasbourg", "Toulouse"
// ].sort();

// const LEAGUES = ["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"];

// const Header = () => (
//     <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
//         <div className="container mx-auto flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//                 <BarChart2 className="h-8 w-8 text-green-400" />
//                 <h1 className="text-xl md:text-2xl font-bold tracking-tight">Corner Kick Predictor</h1>
//             </div>
//         </div>
//     </header>
// );

// const PredictionResult = ({ result }) => {
//     if (!result || !result.input) return null;

//     const { homeTeam, awayTeam } = result.input;
    
// console.log(result);

//     return (
//         <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mt-6 animate-fade-in">
//             <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
//                 {homeTeam} vs. {awayTeam}
//             </h2>
//             {result.error ? (
//                 <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-center">
//                     <AlertTriangle className="h-5 w-5 mr-3" />
//                     <p>{result.error}</p>
//                 </div>
//             ) : (
//                 <>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
//                         <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//                             <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Predicted Corners</h3>
//                             <p className="text-4xl font-bold text-green-500">{result.data.predicted_total_corners}</p>
//                         </div>
//                         <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//                             <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Over 10.5 Prob.</h3>
//                             <p className="text-4xl font-bold text-blue-500">{(result.data['probability_over_10.5'] * 100).toFixed(1)}%</p>
//                         </div>
//                         <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
//                             <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Under 10.5 Prob.</h3>
//                             <p className="text-4xl font-bold text-purple-500">{(result.data['probability_under_10.5'] * 100).toFixed(1)}%</p>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// const createNewMatch = () => ({
//     id: crypto.randomUUID(),
//     homeTeam: '',
//     awayTeam: '',
//     leagueName: 'Premier League',
//     oddHome: '',
//     oddDraw: '',
//     oddAway: ''
// });

// export default function App() {
//     const [matches, setMatches] = useState([createNewMatch()]);
//     const [predictions, setPredictions] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [globalError, setGlobalError] = useState('');

//     const handleMatchChange = (id, field, value) => {
//         setMatches(prevMatches => 
//             prevMatches.map(match => 
//                 match.id === id ? { ...match, [field]: value } : match
//             )
//         );
//     };

//     const addMatch = () => {
//         setMatches(prevMatches => [...prevMatches, createNewMatch()]);
//     };

//     const removeMatch = (id) => {
//         setMatches(prevMatches => prevMatches.filter(match => match.id !== id));
//     };

//     const handlePredictAll = async () => {
//         setGlobalError('');
//         setPredictions([]);
        
//         const validMatches = matches.filter(m => m.homeTeam && m.awayTeam && m.oddHome && m.oddDraw && m.oddAway);

//         if (validMatches.length === 0) {
//             setGlobalError("Please fill in at least one complete match row.");
//             return;
//         }
        
//         setIsLoading(true);

//         const predictionResults = [];
//         for (const match of validMatches) {
//             const payload = {
//                 home_team: match.homeTeam,
//                 away_team: match.awayTeam,
//                 league_name: match.leagueName,
//                 odd_home: parseFloat(match.oddHome),
//                 odd_draw: parseFloat(match.oddDraw),
//                 odd_away: parseFloat(match.oddAway)
//             };

//             try {
//                 const response = await fetch('http://127.0.0.1:5001/api/predict', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload),
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

//     return (
//         <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200">
//             <Header />
//             <main className="container mx-auto p-4 md:p-6">
//                 <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
//                     <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1">Prediction Hub</h2>
//                     <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Add matches and get predictions for all of them at once.</p>
                    
//                     <div className="space-y-4">
//                         {matches.map((match, index) => (
//                             <div key={match.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
//                                 {matches.length > 1 && (
//                                     <button onClick={() => removeMatch(match.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
//                                         <X size={18} />
//                                     </button>
//                                 )}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                     <select value={match.homeTeam} onChange={e => handleMatchChange(match.id, 'homeTeam', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" aria-label="Home Team">
//                                         <option value="">Select Home Team</option>
//                                         {TEAMS.filter(t => t !== match.awayTeam).map(team => <option key={team} value={team}>{team}</option>)}
//                                     </select>
//                                     <select value={match.awayTeam} onChange={e => handleMatchChange(match.id, 'awayTeam', e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" aria-label="Away Team">
//                                         <option value="">Select Away Team</option>
//                                         {TEAMS.filter(t => t !== match.homeTeam).map(team => <option key={team} value={team}>{team}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                                     <select value={match.leagueName} onChange={e => handleMatchChange(match.id, 'leagueName', e.target.value)} className="md:col-span-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" aria-label="League">
//                                         {LEAGUES.map(league => <option key={league} value={league}>{league}</option>)}
//                                     </select>
//                                     <input type="number" step="0.01" value={match.oddHome} onChange={e => handleMatchChange(match.id, 'oddHome', e.target.value)} placeholder="Home Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
//                                     <input type="number" step="0.01" value={match.oddDraw} onChange={e => handleMatchChange(match.id, 'oddDraw', e.target.value)} placeholder="Draw Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
//                                     <input type="number" step="0.01" value={match.oddAway} onChange={e => handleMatchChange(match.id, 'oddAway', e.target.value)} placeholder="Away Odd" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex justify-between items-center mt-6">
//                          <button 
//                             onClick={addMatch}
//                             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors">
//                             <Plus size={18} className="mr-2"/> Add Match
//                         </button>
//                         <button 
//                             onClick={handlePredictAll}
//                             disabled={isLoading}
//                             className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition-colors disabled:bg-gray-400 text-lg">
//                             {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
//                             {isLoading ? 'Calculating...' : 'Get All Predictions'}
//                         </button>
//                     </div>
//                 </div>

//                 {globalError && (
//                     <div className="max-w-4xl mx-auto mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center">
//                         <AlertTriangle className="h-5 w-5 mr-3" />
//                         {globalError}
//                     </div>
//                 )}

//                 <div className="max-w-4xl mx-auto">
//                     {predictions.map(p => <PredictionResult key={p.input.id} result={p} />)}
//                 </div>
//             </main>
//         </div>
//     );
// }


import React, {useEffect, useMemo, useState} from 'react'

import { TEAMS } from './Teams'
import PredictionHub from './PredictionHub'
import PerformancePage from './PerformancePage'
import Header from './Header'
import Footer from './Footer'
export const Home = () => {

const [activeView, setActiveView] = useState('predictor');

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-200">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto p-4 md:p-6">
                {activeView === 'predictor' && <PredictionHub />}
                {activeView === 'performance' && <PerformancePage />}
            </main>
            <Footer />
        </div>
    );
}
