import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import { useContext } from "react";
import { ThemeContext } from "../../App";
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';

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
                name="Calendar" 
                component={CalendarScreen}
                options={{tabBarLabel: t('calendar')}}
                />
            <BottomTab.Screen 
                name="Map" 
                component={MapScreen}
                options={{tabBarLabel: t('map')}}
                />
            {isLoggedIn && 
            <BottomTab.Screen 
                name="Report"
                component={ReportScreen}
                options={{tabBarLabel: t('report')}}
            />}
        </BottomTab.Navigator>
    )
}

export default BottomTabs