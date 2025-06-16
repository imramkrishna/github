import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Registration from './components/Registration'
import OtpVerification from './components/otpVerification'
import Dashboard from './components/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/verification" element={<OtpVerification/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
