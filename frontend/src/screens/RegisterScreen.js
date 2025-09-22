import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

const RegisterScreen = () => {
    const [username, setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const navigation = useNavigation()

    return(
        <View>
            <Text>Register</Text>
            <TextInput 
                value={username} 
                onChangeText={setUsername} 
                placeholder="Username"
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
            <TouchableOpacity>
                <Text>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RegisterScreen