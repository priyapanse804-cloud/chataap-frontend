import React from 'react'
import { Route } from 'react-router'
import Home from './Pages/Home'
import { Routes } from 'react-router'
import Chats from './Pages/Chats'
import './App.css'

const App = () => {
  return (
    <div className='App'>
     <Routes>
      <Route path='/' Component={Home}/>
      <Route path='/chats' Component={Chats}/>
     </Routes>
    </div>
  )
}

export default App
