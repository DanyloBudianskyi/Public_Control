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
                <Text style={{color: theme.text}}>{currentDay.toLocaleString(i18n.language, { month: "long", year: "numeric" })}</Text>
            </View>
            <View style={styles.right}>
                <TouchableOpacity onPress={handleToday}>
                    <Text style={{color: theme.text}}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePrevMonth}>
                    <Text style={{color: theme.text}}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextMonth}>
                    <Text style={{color: theme.text}}>↓</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    display: {
        flexDirection: 'row'
    },
    left: {
        flex: 1,
    },
    right: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    }
})

export default Header