import {View, Text, StyleSheet, FlatList} from "react-native";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MapView, {Marker} from "react-native-maps";
import {useEffect, useState} from "react";
import {fetchReports} from "../database";

const MapScreen = () => {
    const {location, errorMsg, loading} = useCurrentLocation()
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchData = async  () => {
            const data = await fetchReports()
            console.log(data)
            setReports(data)
        }
        fetchData()
    }, []);

    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.535,
                        longitudeDelta: 0.535
                    }}
                >
                    {reports.map(item => (
                        <Marker key={item.id} coordinate={{latitude: item.latitude, longitude: item.longitude}}/>
                    ))}
                </MapView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: "100%",
        height: "100%"
    }
})

export default MapScreen