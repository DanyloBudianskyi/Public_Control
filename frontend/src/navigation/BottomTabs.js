import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import { useContext } from "react";
import {ThemeContext} from  "../context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import CalendarStack from "./CalendarStack";

const BottomTab = createBottomTabNavigator()

const BottomTabs = () => {
    const {isDarkTheme, theme} = useContext(ThemeContext)
    const {t} = useTranslation()
    const {isLoggedIn} = useContext(AuthContext)


    return(
        <BottomTab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.navigationBackground,
                },
                tabBarActiveTintColor: theme.text,
                tabBarInactiveTintColor: isDarkTheme ? '#888' : '#555',
            }}
        >
            <BottomTab.Screen 
                name="CalendarMain"
                component={CalendarStack}
                options={{
                    tabBarLabel: t('calendar'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar-outline" size={size} color={color} />
                    )
            }}
                />
            <BottomTab.Screen 
                name="Map" 
                component={MapScreen}
                options={{
                    tabBarLabel: t('map'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" size={size} color={color} />
                    )
            }}
                />
            {isLoggedIn && 
            <BottomTab.Screen 
                name="Report"
                component={ReportScreen}
                options={{
                    tabBarLabel: t('report'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    )
            }}
            />}
        </BottomTab.Navigator>
    )
}

export default BottomTabs