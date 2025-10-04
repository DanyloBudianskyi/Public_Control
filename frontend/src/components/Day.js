import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { useContext } from "react"
import {ThemeContext} from  "../context/ThemeContext"

const Day = ({day, isToday, isCurrentMonth, onPress, hasViolation}) => {
    const {theme} = useContext(ThemeContext)

    return(
        <TouchableOpacity onPress={onPress} style={styles.day}>
            <Text style={[
                styles.text,
                isCurrentMonth ? {color: theme.text} : styles.other,
                isToday ? styles.Today : null,
            ]}>{day.getDate()}</Text>
            {hasViolation && <Text style={styles.dot}>•</Text>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Today: {
        backgroundColor: "#5c5c5c",
        fontWeight: "800",
        color: "white"
    },
    day: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    text: {
        padding: 10,
    },
    other: {
        color: 'gray'
    },
    dot: {
        fontSize: 12,
        color: "red",
        position: "absolute",
        bottom: 4,
    },
})

export default Day