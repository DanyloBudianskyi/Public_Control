import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList  } from "@react-navigation/drawer";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ProfileScreen from "../screens/ProfileScreen";
import { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import { changeLanguage } from "../i18n";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import BottomTabs from "./BottomTabs";

const Drawer = createDrawerNavigator()

function CustomDrawerContent(props){
  const {isDarkTheme, setIsDarkTheme, theme} = useContext(ThemeContext)
  const [lng, setLng] = useState(i18next.language)
  const {t} = useTranslation()

  const handleLanguageChange = (lang) => {
    setLng(lang)
    changeLanguage(lang)
  }
  
  return(
    <DrawerContentScrollView {...props}
        contentContainerStyle={{backgroundColor: theme.navigationBackground, flex: 1}}
    >
        <DrawerItemList {...props}/>
        <View>
            <Text style={{color: theme.text}}>{isDarkTheme ? t('darkTheme') : t('lightTheme')}</Text>
            <Switch value={isDarkTheme} onValueChange={() => setIsDarkTheme(!isDarkTheme)}/>
        </View>
        <View>
            <Text style={{color: theme.text}}>{t('language')}:</Text>
            <Picker style={{color: theme.text}}
              selectedValue={lng}
              onValueChange={handleLanguageChange}
            >
                <Picker.Item label="Українська" value={"uk"}/>
                <Picker.Item label="English" value={"en"}/>
            </Picker>
        </View>
        <View>
            <TouchableOpacity>
                <Text style={{color: theme.text}}>{t('logout')}</Text>
            </TouchableOpacity>
        </View>
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
    const {isDarkTheme, theme} = useContext(ThemeContext)
    const { isLoggedIn } = useContext(AuthContext)
    const {t} = useTranslation()

    return(
        <Drawer.Navigator 
            screenOptions={{
                headerTitle: '',
                headerStyle: { backgroundColor: theme.navigationBackground },
                headerTintColor: theme.text,
                drawerActiveTintColor: isDarkTheme ? '#fff' : '#000',
                drawerInactiveTintColor: isDarkTheme ? '#aaa' : '#444',
            }} 
            drawerContent={(props) => <CustomDrawerContent {...props}/>}
        >
            <Drawer.Screen 
                name="Home" 
                component={BottomTabs}
                options={{drawerLabel: t('home')}}
            />
            {isLoggedIn ? (
                <>
                <Drawer.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{drawerLabel: t('profile')}}
            /></>
            ) : (
                <>
                <Drawer.Screen 
                name="Auth" 
                component={AuthStack}
                options={{drawerLabel: t('login')}}
            />
                </>
            )}
            
            
        </Drawer.Navigator>
    )
}

export default DrawerNavigator