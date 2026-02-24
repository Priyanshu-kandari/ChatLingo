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
import { Navigate } from 'react-router-dom'

const App = () => {

  const {data: authData} = useQuery({queryKey: ["authUser"], queryFn: async() => {
    const res = await axiosInstance.get("/auth/me");
    return res.data
  }, retry:false})

  const authUser = authData?.user
  console.log(authUser)

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to = "/login"/>}/>
        <Route path="/signup" element={!authUser? <SignUpPage/>: <Navigate to="/" />}/>
        <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to="/" />}/>
        <Route path="/onboarding" element={!authUser? <OnboardingPage/> : <Navigate to = "/login"/>}/>
        <Route path="/Notification" element={!authUser? <NotificationPage/> : <Navigate to = "/login"/> }/>
        <Route path="/Chat" element={!authUser? <ChatPage/> : <Navigate to = "/login"/>}/>
        <Route path="/Call" element={!authUser? <CallPage/> : <Navigate to = "/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App