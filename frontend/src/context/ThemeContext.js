import {createContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

const ThemeProvider = ({children}) => {
    const [isDarkTheme, setIsDarkTheme] = useState(false)
    const theme = isDarkTheme ? darkTheme : lightTheme

    useEffect(() => {
        const loadTheme = async () => {
            try{
                const storedTheme = await AsyncStorage.getItem("APP_THEME")
                if(storedTheme !== null){
                    setIsDarkTheme(storedTheme === "dark")
                }
            } catch (err) {
                Toast.show({
                    type: "error",
                    text1: "Тема",
                    text2: "Неможливо завантажити тему"
                })
            }
        }
        loadTheme()
    }, []);

    const toggleTheme = async () => {
        try{
            const newTheme = !isDarkTheme
            setIsDarkTheme(newTheme)
            await AsyncStorage.setItem("APP_THEME", newTheme ? "dark" : "light")
        } catch (error) {
            console.log("Error saving theme:", error);
        }
    }

    return(
        <ThemeContext.Provider value={{isDarkTheme, toggleTheme, theme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider