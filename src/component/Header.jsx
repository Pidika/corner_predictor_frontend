
 import { BarChart2, } from 'lucide-react';
  const Header = ({ activeView, setActiveView }) =>{
 return (
  
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
