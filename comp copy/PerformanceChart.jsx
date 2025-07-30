import Icon from "./Icon"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
const PerformanceChart = () => {
  const ChartIcon = () => (
    <Icon
      path='M3 13.125C3 12.504 3.504 12 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 19.875v-6.75zM12 12.375V9'
      className='w-5 h-5 mr-2'
    />
  )
   const mockPerformanceData = [
      { name: 'Jan', accuracy: 72, profit: 150 },
      { name: 'Feb', accuracy: 75, profit: 210 },
      { name: 'Mar', accuracy: 68, profit: -50 },
      { name: 'Apr', accuracy: 78, profit: 320 },
      { name: 'May', accuracy: 76, profit: 250 },
      { name: 'Jun', accuracy: 81, profit: 450 },
    ]
    return (
  <div className='bg-gray-800 p-4 rounded-lg shadow-md h-80'>
    <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
      <ChartIcon />
      Monthly Performance
    </h3>
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        data={mockPerformanceData}
        margin={{ top: 5, right: 20, left: -10, bottom: 45 }}
      >
        <XAxis dataKey='name' stroke='#9ca3af' />
        <YAxis yAxisId='left' orientation='left' stroke='#9ca3af' />
        <YAxis yAxisId='right' orientation='right' stroke='#9ca3af' />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
          }}
          labelStyle={{ color: '#d1d5db' }}
        />
        <Legend wrapperStyle={{ paddingTop: '20px' }} />
        <Bar
          yAxisId='left'
          dataKey='accuracy'
          fill='#4ade80'
          name='Accuracy (%)'
        />
        <Bar
          yAxisId='right'
          dataKey='profit'
          fill='#22d3ee'
          name='Profit ($)'
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
)
}
export default PerformanceChart