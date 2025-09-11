import { useContext, useEffect, useState } from "react";
import { View, Text, Linking, TextInput, TouchableOpacity, Image, StyleSheet, Button } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { fetchReports, insertReport } from "../database";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../App";
import { useTranslation } from "react-i18next";
import useCurrentLocation from "../hooks/useCurrentLocation";

const ReportScreen = () => {
    const {t} = useTranslation()

    const [description, setDescription] = useState("")
    const [category, setCategory] = useState(null)
    const [photoUri, setPhotoUri] = useState(null)
    const [fileName, setFileName] = useState('')
    const {location, errorMsg, loading} = useCurrentLocation()

    const {theme} = useContext(ThemeContext)

    const pickImage = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if(!permission.granted){
            Alert.alert(
                'Permission required',
                'Sorry, we need camera permissions to make this work! You can enable it in Settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
            return;
        } 
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
        })
        if(result.canceled) return

        const asset = result.assets[0]

        setPhotoUri(result.assets[0].uri)

        const originalName = asset.fileName || asset.uri.split('/').pop();
        setFileName(originalName)
        console.log(originalName)
    }

    const saveReport = async () => {
        if(!description || !category){
            alert("Fill all fields")
            return
        }
        if(!photoUri){
            alert("Make a photo")
            return
        }
        if (!location) {
            alert("Location not available yet")
            return
        }
        const now = new Date()
        const date = now.toISOString().split("T")[0]
        const time = now.toLocaleTimeString()
        const latitude = location.coords.latitude
        const longitude = location.coords.longitude

        console.log("Saving report:", { description, category, date, time, photoUri, latitude, longitude });

        await insertReport(description, category, date, time, photoUri, latitude, longitude)
        setDescription('')
        setCategory(null)
        setPhotoUri(null)
        await fetchReports()
    }

    const handleUploadImage = async () => {
        const formData = new FormData();

        const extension = fileName.split('.').pop().toLowerCase();
        let mimeType = 'image/jpeg'; // default

        if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'gif') mimeType = 'image/gif';
        else if (extension === 'heic') mimeType = 'image/heic';
        else if (extension === 'webp') mimeType = 'image/webp';
        console.log('mimeType: ', mimeType)

        formData.append('file', {
            uri: photoUri,
            name: fileName,
            type: mimeType
        })
        formData.append('upload_preset', 'TestTest');

       try{
           const response = await fetch(
               'https://api.cloudinary.com/v1_1/divcq4r4c/upload',
               {method: 'POST', body: formData}
           );
           const data = await response.json();
           if (data.secure_url){
               console.log(data.secure_url)
           }else{
               console.log(data)
           }
       }catch (error){
           console.log(error)
       }
    }

    // useEffect(() => {
    //     const getCurrentLocation = async () => {
    //         const {status} = await Location.requestForegroundPermissionsAsync()
    //         if(status !== "granted"){
    //             setErrorMsg("Permission to access location was denied")
    //             return
    //         }
    //         const currentLocation = await Location.getCurrentPositionAsync({})
    //         setLocation(currentLocation)
    //     }
    //     getCurrentLocation()
    // }, [])


    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View>
                <Text style={[styles.label, {color: theme.text}]}>{t('description')}:</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t('descriptionPlaceholder')}
                    placeholderTextColor={theme.subText}
                    style={[styles.input, {color: theme.text, borderColor: theme.subText}]}
                />

                <Text style={[styles.label, {color: theme.text}]}>{t('category')}:</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                    style={{color: theme.text}}
                >
                    <Picker.Item label={t('reports.noise')} value="noise"/>
                    <Picker.Item label={t('reports.parking')} value="parking"/>
                    <Picker.Item label={t('reports.littering')} value="littering"/>
                    <Picker.Item label={t('reports.night_noise')} value="night_noise"/>
                    <Picker.Item label={t('reports.traffic')} value="traffic"/>
                </Picker>

                <TouchableOpacity style={[styles.button, {backgroundColor: theme.navigationBackground}]} onPress={pickImage}>
                    <Text style={{color: theme.text}}>{t('buttons.makePhoto')}</Text>
                </TouchableOpacity>
                {photoUri && 
                    <View style={{alignItems: 'center'}}>
                        <Image source={{uri: photoUri}} style={styles.image}/>
                        <Button title="Send photo" onPress={handleUploadImage}/>
                    </View>
                }
            </View>
            
            <TouchableOpacity style={[styles.button, {backgroundColor: "#439b37ff"}]} onPress={saveReport}>
                <Text style={{color: theme.text}}>{t('buttons.send')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    image: { 
        width: 200, 
        height: 200, 
        marginTop: 8 
    },
    container: { 
        flex: 1, 
        padding: 16,
        justifyContent: "space-between"
    },
    label: {
        fontSize: 16, 
        fontWeight: "bold",
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    buttonText: {

    }
});

export default ReportScreen