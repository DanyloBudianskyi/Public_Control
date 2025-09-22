import {createStackNavigator} from "@react-navigation/stack";
import InfoScreen from "../screens/InfoScreen";
import CalendarScreen from "../screens/CalendarScreen";

const Stack = createStackNavigator()

const CalendarStack = () => {
    return (
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name={"Calendar"} component={CalendarScreen}/>
                <Stack.Screen name={"Info"} component={InfoScreen}/>
            </Stack.Navigator>
    )
}

export  default  CalendarStack