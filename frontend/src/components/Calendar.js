import {useContext, useEffect, useState} from "react"
import { StyleSheet, View, Text, FlatList } from "react-native"
import Day from "./Day"
import Header from "./Header"
import {ThemeContext} from  "../context/ThemeContext"
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {getReportsDates} from "../api/reportApi";
import Toast from "react-native-toast-message";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const {theme} = useContext(ThemeContext)
    const {t} = useTranslation()
    const navigation = useNavigation()
    const [dates, setDates] = useState([])

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const res = await getReportsDates()
                setDates(res.data)
            }catch (err){
                Toast.show({
                    type: "error",
                    text1: t("alerts.error"),
                    text2: "Не удалось загрузить даты преступлений",
                    position: "bottom"
                })
            }
        }
        fetchDates()
    }, []);

    const weekDays = t("weekDays" , {returnObjects: true})
    const firstDayOfWeek = t("firstDayOfWeek");

    const generateDays = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let startDayOfWeek = startOfMonth.getDay();

        if (firstDayOfWeek === 1) {
            startDayOfWeek = (startDayOfWeek + 6) % 7;
        }

        const prevMonthDays = [];
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const day = new Date(startOfMonth);
            day.setDate(day.getDate() - (i + 1));
            prevMonthDays.push(day);
        }

        const currentMonthDays = [];
        for (let i = 0; i < endOfMonth.getDate(); i++) {
            const day = new Date(startOfMonth);
            day.setDate(day.getDate() + i);
            currentMonthDays.push(day);
        }

        const nextMonthDays = [];
        while (prevMonthDays.length + currentMonthDays.length + nextMonthDays.length < 42) {
            const day = new Date(endOfMonth);
            day.setDate(endOfMonth.getDate() + nextMonthDays.length + 1);
            nextMonthDays.push(day);
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const days = generateDays()

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }



    return(
        <View style={styles.container}>
            <View style={styles.calendarWrapper}>
                <View style={styles.headerWrapper}>
                    <Header currentDay={currentDate} setCurrentDay={setCurrentDate}/>
                </View>

                <View style={styles.weekDay}>
                    {weekDays.map((day, index) => (
                        <Text key={index} style={[styles.weekdayText, {color: theme.text}]}>{day}</Text>
                    ))}
                </View>

                <View style={styles.daysWrapper}>
                    {days.map((item, index) => {
                        const formatedDate = formatDate(item)
                        const hasViolation = dates.includes(formatedDate)
                        return (
                            <Day
                                key={index}
                                day={item}
                                isToday={item.toDateString() === currentDate.toDateString()}
                                isCurrentMonth={item.getMonth() === currentDate.getMonth()}
                                hasViolation={hasViolation}
                                onPress={() => navigation.navigate("Info", {selectedDate: formatedDate})}
                            />
                        )
                    })}
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: "100%",
        paddingVertical: 20,
    },
    calendarWrapper: {
        width: 340,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        padding: 10,
    },
    headerWrapper: {
        marginBottom: 10,
        alignItems: "center",
    },
    weekDay: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingBottom: 5,
    },
    weekdayText: {
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
        width: 40,
        color: "#333",
    },
    daysWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
})

export default Calendar