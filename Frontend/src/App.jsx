import React from 'react'
import { Routes , Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import NotificationPage from './pages/NotificationPage'
import ChatPage from './pages/ChatPage'
import CallPage from './pages/CallPage'
import {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'

const App = () => {

  const {data  } = useQuery({queryKey: ["todos"], queryFn: async() => {
    const res = await axiosInstance.get("/auth/me");
    return res.data
  }, retry:false})

  console.log({data})
  return (
    <div>
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
    </div>
  )
}

export default App