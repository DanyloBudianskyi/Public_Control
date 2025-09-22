import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/Drawer';
import { createContext, useEffect, useState } from 'react';
import { loadLanguage } from './src/i18n';
import { createTable } from './src/database';
import AuthProvider from './src/context/AuthContext';

export const ThemeContext = createContext()

const darkTheme = {
  background: '#313131ff',
  text: '#fff',
  navigationBackground: '#242424ff',
  subText: '#888'
}
const lightTheme = {
  background: '#e2e2e2ff',
  text: '#000',
  navigationBackground: '#fff',
  subText: '#666'
}

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const theme = isDarkTheme ? darkTheme : lightTheme
  
  const initApp = async () => {
    await loadLanguage()
    await createTable()
    setIsLoading(false)
  } 
  
  useEffect(() => {
    initApp()
  }, [])

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{isDarkTheme, setIsDarkTheme, theme}}> 
        <NavigationContainer>
          {!isLoading && <DrawerNavigator/>}
        </NavigationContainer>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}
