import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList  } from "@react-navigation/drawer";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import BottomTabs from "./BottomTabs";
import { Picker } from "@react-native-picker/picker";
import ProfileScreen from "../screens/ProfileScreen";

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props){
  return(
    <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
        <View>
            <Text>Theme</Text>
            {/* <Switch/> */}
        </View>
        <View>
            <Text>Language:</Text>
            <Picker>
            <Picker.Item label="Укр" value={"ua"}/>
            <Picker.Item label="Англ" value={"en"}/>
            </Picker>
        </View>  
        <View>
            <TouchableOpacity>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
    return(
        <Drawer.Navigator 
            screenOptions={{headerTitle: ''}} 
            drawerContent={(props) => <CustomDrawerContent {...props}/>}
            >
            <Drawer.Screen name="Home" component={BottomTabs}/>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
        </Drawer.Navigator>
    )
}

export default DrawerNavigator