import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/Drawer';
import { createContext, useEffect, useState } from 'react';
import { loadLanguage } from './src/i18n';
import { createTable } from './src/database';
import AuthProvider from './src/context/AuthContext';
import Toast from "react-native-toast-message";
import ConnectionProvider from "./src/context/ConnectionContext";
import ThemeProvider from "./src/context/ThemeContext";


export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  
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
        <ConnectionProvider>
            <ThemeProvider>
                <NavigationContainer>
                    {!isLoading && <DrawerNavigator/>}
                </NavigationContainer>
                </ThemeProvider>
            <Toast/>
        </ConnectionProvider>
    </AuthProvider>
  );
}
