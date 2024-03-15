import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store'

export const LoginContext = createContext(null);

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key)
  const data = await SecureStore.isAvailableAsync()
  return result
}

export default function AuthContext({ children }) {
  const [isLogin, setIsLogin] = useState('')

  useEffect(() => {
    getValueFor("accessToken").then((data)=>{
      setIsLogin(data)
    })
  }, [])
  return (
    <LoginContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </LoginContext.Provider>
  )
}
