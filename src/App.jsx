import { useState } from 'react'
import Manager from './components/Manager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1 className='text-4xl text-emerald-500'></h1>
      <Manager/>
    </div>
  )
}

export default App
