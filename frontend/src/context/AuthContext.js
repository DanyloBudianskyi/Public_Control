import { createContext, use, useState } from "react"
import {Alert} from "react-native";
import axios from "axios";

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState('');

    const register = async (email, name, lastName, password) => {
        try {
            const res = await axios.post('http://192.168.1.71:3000/register', {
                email, name, lastName,  password
            })
            setToken(res.data.token);
            setIsLoggedIn(true)
            console.log(res.data.token)
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
            setToken(res.data.token);
            setIsLoggedIn(true)
            console.log(res.data.token)
            Alert.alert('Успіх', 'Ви увійшли')
        } catch (e) {
            Alert.alert('Помилка', 'Логін не вдалося')
        }
    }

    return(
        <AuthContext.Provider value={{isLoggedIn, user, loading, register, login}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider