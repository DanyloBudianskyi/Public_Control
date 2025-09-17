import {useRoute} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {fetchReportsByDate} from "../database";
import {FlatList, View, Text, StyleSheet} from "react-native";

const InfoScreen = () => {
    const route = useRoute()
    const {selectedDate} = route.params
    const [reports, setReports] = useState([])

    useEffect(() => {
        const loadReports = async () => {
            const data = await fetchReportsByDate(selectedDate);
            setReports(data);
        }
        loadReports();
    }, [selectedDate]);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Reports for {selectedDate}</Text>
            {reports.length === 0 ? (
                <Text>No reports for this day.</Text>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.reportItem}>
                            <Text>{item.description}</Text>
                            <Text>Category: {item.category}</Text>
                            <Text>Time: {item.time}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    reportItem: { padding: 12, borderBottomWidth: 1, borderColor: "#ccc" },
});


export  default  InfoScreen