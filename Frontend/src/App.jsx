import React from 'react'
import { Routes , Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import {Toaster, toast} from "react-hot-toast"

const App = () => {
  return (
    <>
    <div>App
      <button onClick={()=>
        toast.success("hello World")
      }>Create a toast</button>
    </div>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signup" element={<SignUpPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/onboarding" element={<OnboardingPage/>}/>
      <Route path="/Notification" element={<NotificationPage/>}/>
      <Route path="/Chat" element={<ChatPage/>}/>
      <Route path="/Call" element={<CallPage/>}/>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App