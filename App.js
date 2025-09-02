import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/Drawer';
import { createContext, useEffect, useState } from 'react';
import { loadLanguage } from './src/i18n';
import { createTable } from './src/database';

export const ThemeContext = createContext()

const darkTheme = {
  background: '#222222ff',
  text: '#fff',
  navigationBackground: '#121212',
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
    <ThemeContext.Provider value={{isDarkTheme, setIsDarkTheme, theme}}> 
      <NavigationContainer>
        {!isLoading && <DrawerNavigator/>}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
