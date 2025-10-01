import { useNavigation } from "@react-navigation/native"
import {useContext, useState} from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import {AuthContext} from "../context/AuthContext";
import {ThemeContext} from  "../context/ThemeContext";

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const navigation = useNavigation()
    const {register} = useContext(AuthContext)

    const handlePress = async () => {
        if (password !== confirm) {
            return
        }
        try {
            await register(email, name, lastName, password)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })
        } catch (err) {
            console.log(err.message || "Registration failed")
        }
    }

    return(
        <View>
            <Text>Register</Text>
            <TextInput 
                value={name}
                onChangeText={setName}
                placeholder="Your name"
            />
            <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Your lastname"
            />
            <TextInput 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Email"
            />
            <TextInput 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry
            />
            <TextInput 
                value={confirm} 
                onChangeText={setConfirm} 
                placeholder="Confirm password" 
                secureTextEntry
            />
            <TouchableOpacity onPress={() => handlePress()}>
                <Text>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RegisterScreen