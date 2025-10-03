import {createContext, useEffect, useState} from "react"
import {Alert} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState('')
    const {t} = useTranslation()

    const register = async (email, name, lastName, password) => {
        try {
            const res = await axios.post('http://192.168.1.71:3000/register', {
                email, name, lastName,  password
            }, {timeout: 5000})

            const token = res.data.token;
            const userData = res.data.user || { email, name, lastName };

            setToken(token);
            setUser(userData);
            setIsLoggedIn(true)

            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            Alert.alert(t('success.registrationTitle'), t('success.registration'))
        } catch (err) {
            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;

                if (status === 409) {
                    throw new Error(t('errors.emailExists'));
                }
                if (status === 400 && data.details) {
                    const messages = Object.values(data.details)
                        .flat()
                        .map(msg => {
                            if (msg.includes('Email')) return t('errors.invalidEmail');
                            if (msg.includes('Password must be at least')) return t('errors.shortPassword');
                            return msg;
                        });
                    throw new Error(messages.join('\n'));
                }
            }
            else {
                throw new Error(t('errors.networkError'))
            }

            throw new Error(t('errors.general'));
        }
    }

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://192.168.1.71:3000/login', {
                email, password
            }, {timeout: 5000})

            const token = res.data.token;
            const userData = res.data.user;

            setToken(token);
            setUser(userData);
            setIsLoggedIn(true)

            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userData", JSON.stringify(userData));

            Alert.alert('Успіх', 'Ви увійшли')
        } catch (err) {
            if (err.response) {
                const status = err.response.status
                const message = err.response.data?.message

                if (status === 404) {
                    throw new Error(t('errors.userNotFound'))
                } else if (status === 401) {
                    throw new Error(t('errors.invalidCredentials'))
                } else {
                    throw new Error(t('errors.generalError'))
                }

            } else {
                throw new Error(t('errors.networkError'))
            }
        }
    }

    const logout = async () => {
        Alert.alert(
            "Вихід",
            "Ви дійсно хочете вийти з акаунту?",
            [
                {
                    text: "Скасувати",
                    style: "cancel"
                },
                {
                    text: "Вийти",
                    style: 'destructive',
                    onPress: async () => {
                        setToken("")
                        setUser(null)
                        setIsLoggedIn(false)
                        await AsyncStorage.removeItem("userToken")
                        await AsyncStorage.removeItem("userData")
                    }
                }
            ],
            {cancelable: true}
        )
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
        <AuthContext.Provider value={{isLoggedIn, user, loading, token, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider