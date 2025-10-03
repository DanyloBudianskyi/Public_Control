import { useContext, useEffect, useState } from "react";
import {View, Text, Linking, TextInput, TouchableOpacity, Image, StyleSheet, Button, Alert} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {fetchReports, fetchUnsyncedReports, insertReport, markReportAsSynced} from "../database";
import {ThemeContext} from  "../context/ThemeContext"
import { useTranslation } from "react-i18next";
import useCurrentLocation from "../hooks/useCurrentLocation";
import {Dropdown} from "react-native-element-dropdown";
import {AuthContext} from "../context/AuthContext";
import {createReport} from "../api/reportApi";
import {useNavigation} from "@react-navigation/native";
import {ConnectionContext} from "../context/ConnectionContext";

const generateFileName = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `photo_${timestamp}_${random}.jpg`;
};

const ReportScreen = () => {
    const {t} = useTranslation()
    const {theme} = useContext(ThemeContext)

    const reportData = [
        { label: t('reports.noise'), value: 'noise' },
        { label: t('reports.parking'), value: 'parking' },
        { label: t('reports.littering'), value: 'littering' },
        { label: t('reports.night_noise'), value: 'night_noise' },
        { label: t('reports.traffic'), value: 'traffic' },
    ];

    const [description, setDescription] = useState("")
    const [category, setCategory] = useState(reportData[0].value)
    const [photoUrl, setPhotoUrl] = useState(null)
    const [photoBase64, setPhotoBase64] = useState(null);
    const {location, errorMsg, loading} = useCurrentLocation()
    const {token} = useContext(AuthContext)
    const {isConnected, backendAvailable} = useContext(ConnectionContext)
    const navigation = useNavigation()

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
            base64: true
        })
        if(result.canceled) return

        const asset = result.assets[0]

        setPhotoUrl(result.assets[0].uri)
        setPhotoBase64(asset.base64)
    }

    const sendReport = async () => {
        if(!token){
            Alert.alert('Помилка', 'Потрібно авторизуватись');
            console.log(token)
            return;
        }
        if(!description || !category){
            alert("Fill all fields")
            return
        }
        if(!photoBase64){
            alert("Make a photo")
            return
        }
        if (!location) {
            alert("Location not available yet")
            return
        }
        const latitude = location.coords.latitude
        const longitude = location.coords.longitude
        try {
            const localReportId = await insertReport(description, category, photoBase64, latitude, longitude);
            if(isConnected && backendAvailable && token){
                const uploadedUrl = await handleUploadImage(photoBase64, generateFileName());
                if (!uploadedUrl) {
                    alert("Не вдалося завантажити фото");
                    return;
                }

                await createReport(
                    {description, category, photoUrl: uploadedUrl ,latitude, longitude},
                    token
                )

                await markReportAsSynced(localReportId);
            }

            setDescription('');
            setCategory(reportData[0].value);
            setPhotoUrl(null);
            setPhotoBase64(null);

            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })

        } catch (e){
            console.log("token:", token)
            console.log(">>>>>>>>>>>", e)
            Alert.alert('Помилка', 'Не владося створит пост')
        }
    }

    const handleUploadImage = async (base64Data, fileNameParam) => {
        const formData = new FormData();
        const extension = (fileNameParam || 'photo.jpg').split('.').pop().toLowerCase();

        let mimeType = 'image/jpeg';

        if (extension === 'png') mimeType = 'image/png';
        else if (extension === 'gif') mimeType = 'image/gif';
        else if (extension === 'heic') mimeType = 'image/heic';
        else if (extension === 'webp') mimeType = 'image/webp';

        formData.append('file', {
            uri: `data:${mimeType};base64,${base64Data}`,
            type: mimeType,
            name: fileNameParam
        });
        formData.append('upload_preset', 'TestTest');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/divcq4r4c/upload', { method: 'POST', body: formData });
            const data = await response.json();
            return data.secure_url || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };


    useEffect(() => {
        const syncReports = async () => {
            if(!isConnected || !backendAvailable || !token) return

            const unsyncedReports = await fetchUnsyncedReports()
            if(unsyncedReports.length !== 0){
                for(let report of unsyncedReports){
                    try {
                        const uploadedUrl = await handleUploadImage(report.photoBase64, generateFileName());
                        if (!uploadedUrl) {
                            alert("Не вдалося завантажити фото");
                            return;
                        }
                        await createReport(
                            {
                                description: report.description,
                                category: report.category,
                                photoUrl: uploadedUrl,
                                latitude: report.latitude,
                                longitude: report.longitude
                            },token
                        )
                        await markReportAsSynced(report.id)
                    } catch (err) {
                        console.log("sync fail", err);
                    }
                }
            }
        }
        syncReports()
    }, []);

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

                <Dropdown
                    style={{
                        borderWidth: 1,
                        borderColor: theme.subText,
                        borderRadius: 8,
                        padding: 8,
                    }}
                    placeholderStyle={{ color: theme.text }}
                    selectedTextStyle={{ color: theme.text }}
                    data={reportData}
                    labelField="label"
                    valueField="value"
                    value={category}
                    onChange={item => setCategory(item.value)}
                />

                <TouchableOpacity style={[styles.button, {backgroundColor: theme.navigationBackground}]} onPress={pickImage}>
                    <Text style={{color: theme.text}}>{t('buttons.makePhoto')}</Text>
                </TouchableOpacity>
                {photoUrl &&
                    <View style={{alignItems: 'center'}}>
                        <Image source={{uri: photoUrl}} style={styles.image}/>
                    </View>
                }
            </View>

            <TouchableOpacity style={[styles.button, {backgroundColor: "#439b37ff"}]} onPress={sendReport}>
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