import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { format } from "date-fns"

const Day = ({day, isToday, isCurrentMonth}) => {
    return(
        <TouchableOpacity style={styles.day}>
            <Text style={[styles.text,isToday ? styles.Today : null, isCurrentMonth ? null : styles.other]}>{day.getDate()}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    Today: {
        backgroundColor: "#5c5c5c",
        fontWeight: "800"
    },
    day: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    text: {
        padding: 10,
    },
    other: {
        color: 'gray'
    }
})

export default Day