import Icon from './Icon'

const Filters = ({ leagues, filters, onFilterChange }) => {
    const leaugueToDisplay = Object.entries(leagues)
    // console.log(leaugueToDisplay);
    
  const SearchIcon = () => (
    <Icon
      path='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
      className='w-5 h-5 text-gray-400'
    />
  )
  return (
    <div className='bg-gray-800 p-4 rounded-lg shadow-md mb-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
        <div className='relative'>
          <label
            htmlFor='search'
            className='text-sm font-medium text-gray-300 mb-1 block'
          >
            Search Team
          </label>
          <input
            type='text'
            id='search'
            name='search'
            placeholder='e.g., Real Madrid'
            value={filters.search}
            onChange={onFilterChange}
            className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
          />
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pt-6 pointer-events-none'>
            {' '}
            <SearchIcon />{' '}
          </div>
        </div>
        <div>
          <label
            htmlFor='league'
            className='text-sm font-medium text-gray-300 mb-1 block'
          >
            League
          </label>
          <select
            id='league'
            name='league'
            value={filters.league}
            onChange={onFilterChange}
            className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            <option value=''>All Leagues</option>
            {leaugueToDisplay.map((leagues) => (
              leagues.map((league ) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor='date'
            className='text-sm font-medium text-gray-300 mb-1 block'
          >
            Date
          </label>
          <input
            type='date'
            id='date'
            name='date'
            value={filters.date}
            onChange={onFilterChange}
            className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
          />
        </div>
      </div>
    </div>
  )
}

// const Filters = ({ leagues, filters, onFilterChange }) => {
//   const SearchIcon = () => (<Icon
//       path='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
//       className='w-5 h-5 text-gray-400'
//     />)
//     return (
//       <div className='bg-gray-800 p-4 rounded-lg shadow-md mb-6'>
//         <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
//           <div className='relative'>
//             <label
//               htmlFor='search'
//               className='text-sm font-medium text-gray-300 mb-1 block'
//             >
//               Search Team
//             </label>
//             <input
//               type='text'
//               id='search'
//               placeholder='e.g., Real Madrid'
//               className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//             />
//             <div className='absolute inset-y-0 left-0 flex items-center pl-3 pt-6 pointer-events-none'>
//               {' '}
//               <SearchIcon />{' '}
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor='league'
//               className='text-sm font-medium text-gray-300 mb-1 block'
//             >
//               League
//             </label>
//             <select
//               id='league'
//               className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//             >
//               <option value=''>All Leagues</option>
//               {leagues.map((league) => (
//                 <option key={league.id} value={league.id}>
//                   {league.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor='date'
//               className='text-sm font-medium text-gray-300 mb-1 block'
//             >
//               Date
//             </label>
//             <input
//               type='date'
//               id='date'
//               name='date'
//               value={filters.date}
//               onChange={onFilterChange}
//               className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//             />
//           </div>
//         </div>
//       </div>
//     )
// }
export default Filters
// const Filters = ({ leagues, filters, onFilterChange, onSearch }) => {
//   const SearchIcon = () => (
//     <Icon
//       path='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
//       className='w-5 h-5 text-gray-400'
//     />
//   )

//   return (
//     <div className='bg-gray-800 p-4 rounded-lg shadow-md mb-6'>
//       <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
//         <div className='relative'>
//           <label
//             htmlFor='search'
//             className='text-sm font-medium text-gray-300 mb-1 block'
//           >
//             Search Team
//           </label>
//           <input
//             type='text'
//             id='search'
//             name='search'
//             value={filters.search}
//             onChange={onFilterChange}
//             placeholder='e.g., Real Madrid'
//             className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//           />
//           <div className='absolute inset-y-0 left-0 flex items-center pl-3 pt-6 pointer-events-none'>
//             <SearchIcon />
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor='league'
//             className='text-sm font-medium text-gray-300 mb-1 block'
//           >
//             League
//           </label>
//           <select
//             id='league'
//             name='league'
//             value={filters.league}
//             onChange={onFilterChange}
//             className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//           >
//             <option value=''>All Leagues</option>
//             {leagues.map((league) => (
//               <option key={league.id} value={league.id}>
//                 {league.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor='date'
//             className='text-sm font-medium text-gray-300 mb-1 block'
//           >
//             Date
//           </label>
//           <input
//             type='date'
//             id='date'
//             name='date'
//             value={filters.date}
//             onChange={onFilterChange}
//             className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
//           />
//         </div>
//         <div>
//           <button
//             onClick={onSearch}
//             className='bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition'
//           >
//             Search Fixtures
//           </button>
//         </div>
//       </div>

//       {/* Search Button */}
//     </div>
//   )
// }
// export default Filters
