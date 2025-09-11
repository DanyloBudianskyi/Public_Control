import { View, Text, StyleSheet } from "react-native";
import useCurrentLocation from "../hooks/useCurrentLocation";
import MapView from "react-native-maps";

const MapScreen = () => {
    const {location, errorMsg, loading} = useCurrentLocation()

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
                />
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