import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import DepositCrypto from './pages/DepositCrypto'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/depositcrypto' element={<DepositCrypto />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
