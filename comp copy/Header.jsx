import Icon from "./Icon"
 import { BarChart2, Zap, Loader2, AlertTriangle, Plus, X } from 'lucide-react';
  const Header = ({ activeView, setActiveView }) =>{
 return (
  //   <header className='bg-gray-900 text-white shadow-lg'>
  //     <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
  //       <div className='flex items-center justify-between h-16'>
  //         <div className='flex items-center'>
  //           <Icon
  //             path='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
  //             className='w-8 h-8 text-green-400'
  //           />
  //           <h1 className='text-xl sm:text-2xl font-bold ml-3'>
  //             Corner Kick Predictor
  //           </h1>
  //         </div>
  //         <nav className='hidden md:flex items-center space-x-4'>
  //           <a
  //             href='#'
  //             className='px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
  //           >
  //             Dashboard
  //           </a>
  //           <a
  //             href='#'
  //             className='px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
  //           >
  //             Performance
  //           </a>
  //           <a
  //             href='#'
  //             className='px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
  //           >
  //             About
  //           </a>
  //         </nav>
  //       </div>
  //     </div>
  //   </header>
  
    <header className="bg-gray-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <BarChart2 className="h-8 w-8 text-green-400" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Corner Kick Predictor</h1>
            </div>
            <nav className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
                <button onClick={() => setActiveView('predictor')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeView === 'predictor' ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Predictor</button>
                <button onClick={() => setActiveView('performance')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeView === 'performance' ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Performance</button>
            </nav>
        </div>
    </header>

)

}
export default Header
