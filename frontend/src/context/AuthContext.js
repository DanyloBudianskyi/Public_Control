import {createContext, useEffect, useState} from "react"
import {Alert} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState('')

    const register = async (email, name, lastName, password) => {
        try {
            const res = await axios.post('http://192.168.1.71:3000/register', {
                email, name, lastName,  password
            })

            const token = res.data.token;
            const userData = res.data.user || { email, name, lastName };

            setToken(token);
            setUser(userData);
            setIsLoggedIn(true)

            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            Alert.alert('Успіх', 'Користувача зареєстровано')
        } catch (e) {
            Alert.alert('Помилка', 'Реєстрація не вдалася')
        }
    }

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://192.168.1.71:3000/login', {
                email, password
            })

            const token = res.data.token;
            const userData = res.data.user;

            setToken(token);
            setUser(userData);
            setIsLoggedIn(true)

            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            Alert.alert('Успіх', 'Ви увійшли')
        } catch (e) {
            Alert.alert('Помилка', 'Логін не вдалося')
        }
    }

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("userToken")
                const storedUser = await AsyncStorage.getItem("userData")
                if (storedToken) {
                    setToken(storedToken)
                    setIsLoggedIn(true)
                }
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                }
            } catch (err) {
                console.log("Error loading auth data", err)
            } finally {
                setLoading(false)
            }
        }
        loadUser()
    }, []);

    return(
        <AuthContext.Provider value={{isLoggedIn, user, loading, token, register, login}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider