import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList  } from "@react-navigation/drawer";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import BottomTabs from "./BottomTabs";
import { Picker } from "@react-native-picker/picker";
import ProfileScreen from "../screens/ProfileScreen";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props){
  const {isDarkTheme, setIsDarkTheme, theme} = useContext(ThemeContext)

  return(
    <DrawerContentScrollView {...props}
        contentContainerStyle={{backgroundColor: theme.background, flex: 1}}
    >
        <DrawerItemList {...props}/>
        <View>
            <Text style={{color: theme.text}}>{isDarkTheme ? "Dark theme" : "Light theme"}</Text>
            <Switch value={isDarkTheme} onChange={() => setIsDarkTheme(!isDarkTheme)}/>
        </View>
        <View>
            <Text style={{color: theme.text}}>Language:</Text>
            <Picker style={{color: theme.text}}>
                <Picker.Item label="Укр" value={"uk"}/>
                <Picker.Item label="Англ" value={"en"}/>
            </Picker>
        </View>  
        <View>
            <TouchableOpacity>
                <Text style={{color: theme.text}}>Log out</Text>
            </TouchableOpacity>
        </View>
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
    const {isDarkTheme, theme} = useContext(ThemeContext)
    return(
        <Drawer.Navigator 
            screenOptions={{
                headerTitle: '',
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                drawerActiveTintColor: isDarkTheme ? '#fff' : '#000',
                drawerInactiveTintColor: isDarkTheme ? '#aaa' : '#444',
            }} 
            drawerContent={(props) => <CustomDrawerContent {...props}/>}
        >
            <Drawer.Screen name="Home" component={BottomTabs}/>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
        </Drawer.Navigator>
    )
}

export default DrawerNavigator