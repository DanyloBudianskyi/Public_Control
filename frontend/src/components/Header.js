import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {ThemeContext} from  "../context/ThemeContext"
import {useTranslation} from "react-i18next";

const Header = ({currentDay,setCurrentDay}) => {
    const {theme} = useContext(ThemeContext)
    const {i18n} = useTranslation()

    const handlePrevMonth = () => {
        setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDay(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDay(new Date());
    };
    return(
        <View style={styles.display}>
            <View style={styles.left}>
                <Text style={[styles.monthText, {color: theme.text}]}>{currentDay.toLocaleString(i18n.language, { month: "long", year: "numeric" })}</Text>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Text style={[styles.button, {borderColor: theme.text, color: theme.text}]}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToday}>
                    <Text style={[styles.button, {borderColor: theme.text, color: theme.text}]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextMonth}>
                    <Text style={[styles.button, {borderColor: theme.text, color: theme.text}]}>→</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 10,
    },
    monthText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    button: {
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10,
    }
})

export default Header