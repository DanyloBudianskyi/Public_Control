import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { useContext } from "react"
import { ThemeContext } from "../../App"

const Day = ({day, isToday, isCurrentMonth}) => {
    const {theme} = useContext(ThemeContext)

    return(
        <TouchableOpacity style={styles.day}>
            <Text style={[
                styles.text,
                isCurrentMonth ? {color: theme.text} : styles.other,
                isToday ? styles.Today : null,
            ]}>{day.getDate()}</Text>
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
    }
})

export default Day