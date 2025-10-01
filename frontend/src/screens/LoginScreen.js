import { useNavigation } from "@react-navigation/native"
import {useContext, useState} from "react"
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native"
import {AuthContext} from "../context/AuthContext";
import {ThemeContext} from  "../context/ThemeContext";
import {useTranslation} from "react-i18next";

const LoginScreen = () => {
    const {t} = useTranslation()
    const {theme} = useContext(ThemeContext)

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
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <Text style={[styles.header, {color: theme.text}]}>{t('form.headerLogin')}</Text>
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={email} 
                placeholder={t('form.email')}
                onChangeText={setEmail}
            />
            <TextInput
                placeholderTextColor={theme.subText}
                style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                value={password} 
                placeholder={t('form.password')}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.link, {color: theme.text}]}>{t('form.registerLink')} <Text style={styles.linkHighlight}>{t('form.buttonRegister')}</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: "#439b37ff"}]} onPress={() => handlePress()}>
                <Text>{t('form.buttonLogin')}</Text>
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

export default LoginScreen