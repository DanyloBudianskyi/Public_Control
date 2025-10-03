import {useRoute} from "@react-navigation/native";
import {useContext, useEffect, useState} from "react";
import {FlatList, View, Text, StyleSheet, Image} from "react-native";
import {getReportsByDate} from "../api/reportApi";
import {useTranslation} from "react-i18next";
import {ThemeContext} from "../context/ThemeContext";
import {ConnectionContext} from "../context/ConnectionContext";

const InfoScreen = () => {
    const {t} = useTranslation()
    const route = useRoute()
    const {selectedDate} = route.params
    const [reports, setReports] = useState([])
    const [errorMessage, setErrorMessage] = useState('');
    const {theme} = useContext(ThemeContext)
    const {isConnected, backendAvailable} = useContext(ConnectionContext)

    const fetchReports = async () => {
        try {
            const response = await getReportsByDate(selectedDate)
            setReports(response.data)
            setErrorMessage('')
        } catch (err) {
            if (err.response) {
                const errorMessage = typeof err.response.data === 'string'
                    ? err.response.data
                    : err.response.data.message || 'Щось пішло не так';
                setErrorMessage(`Помилка: ${err.response.status} - ${errorMessage}`);

            }else {
                setErrorMessage('Непередбачена помилка');
            }
            console.log(errorMessage)
        }
    }

    useEffect(() => {
        if(!isConnected) {
            setErrorMessage(t('errors.networkError'))
            setReports([])
            return
        }
        if(!backendAvailable) {
            setErrorMessage(t('errors.backendError'))
            setReports([])
            return
        }
        fetchReports()
    }, [selectedDate]);

    return(
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            {errorMessage ? (
                <Text style={{color: 'red', marginBottom: 8}}>{errorMessage}</Text>
            ) : (
                <>
                    <Text style={[styles.title, {color: theme.text}]}>{t('reportFor')} {selectedDate}</Text>
                    {reports.length === 0 ? (
                        <Text>No reports for this day.</Text>
                    ) : (
                        <FlatList
                            data={reports}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.reportItem}>
                                    {item.photoUrl && (
                                        <Image
                                            source={{uri: item.photoUrl}}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                    )}
                                    <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
                                    <Text style={[styles.meta, { color: theme.subText }]}>{t('category')}: {t(`reports.${item.category}`)}</Text>
                                    <Text style={[styles.meta, { color: theme.subText }]}>{t('time')}: {new Date(item.createdAt).toLocaleString()}</Text>
                                    <Text style={[styles.meta, { color: theme.subText }]}>{t('createdBy')}: {item.user.lastName} {item.user.name}</Text>
                                </View>
                            )}
                        />
                    )}
                </>)}


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12
    },
    reportItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ccc"
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


export  default  InfoScreen