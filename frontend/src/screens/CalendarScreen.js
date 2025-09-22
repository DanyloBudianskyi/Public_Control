import { View} from "react-native";
import Calendar from "../components/Calendar";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const CalendarScreen = () => {
    const {theme} = useContext(ThemeContext)

    return (
        <View style={{flex: 1, backgroundColor: theme.background}}>
            <Calendar/>
        </View>
    );
}

export default CalendarScreen