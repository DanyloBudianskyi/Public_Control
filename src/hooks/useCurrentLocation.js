import { useEffect, useState } from "react"
import * as Location from 'expo-location'
import { Alert, Linking } from "react-native"

const useCurrentLocation = () => {
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                let {status} = await Location.getForegroundPermissionsAsync()
                if(status !== "granted"){
                    const request = await Location.requestForegroundPermissionsAsync()
                    status = request.status
                }
                if(status !== "granted"){
                    Alert.alert(
                        'Permission required',
                        'Sorry, we need location permissions to make this work! You can enable it in Settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Open Settings', onPress: () => Linking.openSettings() }
                        ]
                    );
                    return;
                }
                const currentLocation = await Location.getCurrentPositionAsync({})
                setLocation(currentLocation)
            } catch(err) {
                setErrorMsg(err.message)
            } finally {
                setLoading(false)
            }
        }
        getCurrentLocation()
    }, [])

    return {location, errorMsg, loading}
}

export default useCurrentLocation