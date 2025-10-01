import { useNavigation } from "@react-navigation/native"
import {useContext, useState} from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import {AuthContext} from "../context/AuthContext";
import {ThemeContext} from  "../context/ThemeContext";

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const {login} = useContext(AuthContext)

    const handlePress = async () => {
        try {
            await login(email, password)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })
        } catch (err) {
            console.log(err.message || "login failed")
        }
    }
    return(
        <View>
            <Text>Login</Text>
            <TextInput 
                value={email} 
                placeholder="Email" 
                onChangeText={setEmail}
            />
            <TextInput
                value={password} 
                placeholder="Password" 
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={() => handlePress()}>
                <Text>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen