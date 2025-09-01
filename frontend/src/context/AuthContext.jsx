import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const Ctx = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  useEffect(()=>{
    if (!token) return
    api.get('/auth/me', { headers: { Authorization: 'Bearer ' + token }})
      .then(res => setUser(res.data.user))
      .catch(()=>{
        setToken(''); localStorage.removeItem('token'); setUser(null)
      })
  }, [token])

  function login(tk, usr){
    setToken(tk); localStorage.setItem('token', tk); setUser(usr)
  }
  function logout(){
    setToken(''); localStorage.removeItem('token'); setUser(null)
  }

  return <Ctx.Provider value={{ user, token, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
