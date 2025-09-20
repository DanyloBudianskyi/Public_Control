import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList  } from "@react-navigation/drawer";
import { View, Text, Switch, TouchableOpacity, StyleSheet } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";
import { useContext, useState } from "react";
import { ThemeContext } from "../../App";
import { changeLanguage } from "../i18n";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { AuthContext } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import BottomTabs from "./BottomTabs";
import {Dropdown} from "react-native-element-dropdown";

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
        contentContainerStyle={{
            backgroundColor: theme.navigationBackground,
            flex: 1,
            paddingVertical: 20
        }}
    >
        <DrawerItemList {...props}/>
        <View style={[styles.section, styles.row]}>
            <Text style={[styles.label, {color: theme.text}]}>{isDarkTheme ? t('darkTheme') : t('lightTheme')}</Text>
            <Switch value={isDarkTheme} onValueChange={() => setIsDarkTheme(!isDarkTheme)}/>
        </View>
        <View style={[styles.section]}>
            <Text style={[styles.label, {color: theme.text}]}>{t('language')}:</Text>
            <Dropdown
                style={styles.dropdown}
                selectedTextStyle={{ color: theme.text }}  // выбранный текст
                data={[
                    { label:"Українська", value:"uk" },
                    { label: 'English', value: 'en' },
                ]}
                labelField="label"
                valueField="value"
                value={lng}
                onChange={item => handleLanguageChange(item.value)}
                placeholder={t('language')}
            />
        </View>
        <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutBtn}>
                <Text style={styles.logoutText}>{t('logout')}</Text>
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
                drawerLabelStyle: {fontSize: 16}
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

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        paddingTop: 12,

    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    logoutSection: {
        flex: 1,
        justifyContent: "flex-end",
    },
    logoutBtn: {
        paddingVertical: 10,
        alignItems: "center",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#D32F2F"
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: 8,
        padding: 8,
    }
})

export default DrawerNavigator