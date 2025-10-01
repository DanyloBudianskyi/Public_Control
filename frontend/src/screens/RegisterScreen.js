import { useNavigation } from "@react-navigation/native"
import {useContext, useState} from "react"
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import {AuthContext} from "../context/AuthContext";
import {ThemeContext} from  "../context/ThemeContext";
import {useTranslation} from "react-i18next";

const RegisterScreen = () => {
    const {t} = useTranslation()
    const {theme} = useContext(ThemeContext)

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
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.header, {color: theme.text}]}>{t('form.headerRegister')}</Text>
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={name}
                onChangeText={setName}
                placeholder={t('form.name')}
            />
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t('form.lastname')}
            />
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={email} 
                onChangeText={setEmail} 
                placeholder={t('form.email')}
            />
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={password} 
                onChangeText={setPassword} 
                placeholder={t('form.password')}
                secureTextEntry
            />
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={confirm} 
                onChangeText={setConfirm} 
                placeholder={t('form.confirmPassword')}
                secureTextEntry
            />
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={[styles.link, {color: theme.text}]}>{t('form.loginLink')} <Text style={styles.linkHighlight}>{t('form.buttonLogin')}</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#439b37ff"}]} onPress={() => handlePress()}>
                <Text>{t('form.buttonRegister')}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    link: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 12,
    },
    linkHighlight: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        color: "#439b37",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    }
});

export default RegisterScreen