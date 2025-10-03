import {Text, View, StyleSheet, FlatList, Image} from "react-native"
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {ThemeContext} from "../context/ThemeContext";
import {getReportsByDate, getReportsByUserId} from "../api/reportApi";
import {useTranslation} from "react-i18next";
import {ConnectionContext} from "../context/ConnectionContext";
import {fetchReports} from "../database";

const ProfileScreen = () => {
    const { user, token } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)
    const { t } = useTranslation()
    const {isConnected, backendAvailable} = useContext(ConnectionContext)

    return(
        <View style={[styles.container, { backgroundColor: theme?.background || "#fff" }]}>
            <Text style={[styles.title, { color: theme?.text || "#000" }]}>{t('profile')}</Text>

            {user ? (
                <View style={styles.userInfo}>
                    <Text style={[styles.label, { color: theme?.subText || "#555" }]}>{t('form.name')}:</Text>
                    <Text style={[styles.value, { color: theme?.text || "#000" }]}>{user.name}</Text>

                    <Text style={[styles.label, { color: theme?.subText || "#555" }]}>{t('form.lastname')}:</Text>
                    <Text style={[styles.value, { color: theme?.text || "#000" }]}>{user.lastName}</Text>

                    <Text style={[styles.label, { color: theme?.subText || "#555" }]}>Email:</Text>
                    <Text style={[styles.value, { color: theme?.text || "#000" }]}>{user.email}</Text>
                </View>
            ) : (
                <Text style={[styles.noUser, { color: theme?.text || "#000" }]}>Користувач не авторизований</Text>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "flex-start",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    userInfo: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 4,
    },
    noUser: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 32,
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 8,
        marginTop: 8,
    },
    description: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6
    },
    meta: {
        fontSize: 14,
        fontStyle: "italic",
        marginBottom: 4
    },
});

export default ProfileScreen