import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import NewScreen from '../screens/NewScreen';
import { useContext } from "react";
import { ThemeContext } from "../../App";

const BottomTab = createBottomTabNavigator()

const BottomTabs = () => {
    const {isDarkTheme, theme} = useContext(ThemeContext)

    return(
        <BottomTab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.background,
                },
                tabBarActiveTintColor: theme.text,
                tabBarInactiveTintColor: isDarkTheme ? '#888' : '#555',
            }}
        >
            <BottomTab.Screen name="Calendar" component={CalendarScreen}/>
            <BottomTab.Screen name="Map" component={MapScreen}/>
            <BottomTab.Screen name="New" component={NewScreen}/>
        </BottomTab.Navigator>
    )
}

export default BottomTabs