import { useContext, useState } from "react"
import { StyleSheet, View, Text, FlatList } from "react-native"
import Day from "./Day"
import Header from "./Header"
import { ThemeContext } from "../../App"
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const {theme} = useContext(ThemeContext)
    const {t} = useTranslation()
    const navigation = useNavigation()

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
                <Header currentDay={currentDate} setCurrentDay={setCurrentDate}/>
                <View style={styles.weekDay}>
                        {weekDays.map((day, index) => (
                    <Text key={index} style={[styles.weekdayText, {color: theme.text}]}>{day}</Text>
                ))}
                </View>
                <FlatList
                    data={days}
                    renderItem={({ item }) => (
                        <Day 
                        day={item} 
                        isToday={item.toDateString() === currentDate.toDateString()}
                        isCurrentMonth={item.getMonth() === currentDate.getMonth()}
                        onPress={() => {
                            const formatedDate = formatDate(item)
                            navigation.navigate("Info", {selectedDate: formatedDate})
                        }}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={7}
                    scrollEnabled={false}
                    key={currentDate.getMonth()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  week: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  weekDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  weekdayText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    width: 40,
    height: 40,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
  },
  calendarWrapper: {
    flex: 1,
    paddingHorizontal: 10,
    width: 320,
    },
})

export default Calendar