import Icon from "../component/Icon";
const LoadingSpinner = () => (
  <div className='flex justify-center items-center p-8'>
    <Icon
      path='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-1.685v-2.172a3.375 3.375 0 00-3.375-3.375H10.5a3.375 3.375 0 00-3.375 3.375v2.172m0 0a3.375 3.375 0 003.375 3.375h3.75a3.375 3.375 0 003.375-3.375z'
      className='w-10 h-10 animate-spin text-green-400'
    />
    <p className='ml-4 text-lg'>Loading Live Matches...</p>
  </div>
)

export default LoadingSpinner