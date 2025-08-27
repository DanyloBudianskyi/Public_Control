import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/Drawer';
import { createContext, useState } from 'react';

export const ThemeContext = createContext()

const darkTheme = {
  background: '#121212',
  text: '#fff',
}
const lightTheme = {
  background: '#fff',
  text: '#000',
}

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const theme = isDarkTheme ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{isDarkTheme, setIsDarkTheme, theme}}> 
      <NavigationContainer>
        <DrawerNavigator/>
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
