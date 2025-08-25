import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import NewScreen from '../screens/NewScreen';

const BottomTab = createBottomTabNavigator()

const BottomTabs = () => {
    return(
        <BottomTab.Navigator>
            <BottomTab.Screen name="Calendar" component={CalendarScreen}/>
            <BottomTab.Screen name="Map" component={MapScreen}/>
            <BottomTab.Screen name="New" component={NewScreen}/>
        </BottomTab.Navigator>
    )
}

export default BottomTabs