import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import OtpVerification from './components/otpVerification'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/verification" element={<OtpVerification/>}/>
        <Route/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
