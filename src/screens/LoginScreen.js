import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

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
            <TouchableOpacity>
                <Text>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen