import { useContext, useState } from "react";
import { View, Text, Linking, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { fetchReports, insertReport } from "../database";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../../App";
import { useTranslation } from "react-i18next";

const ReportScreen = () => {
    const {t} = useTranslation()

    const [description, setDescription] = useState("")
    const [category, setCategory] = useState(null)
    const [photoUri, setPhotoUri] = useState(null)

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
        setPhotoUri(result.assets[0].uri)
    }

    const saveReport = async () => {
        if(!description || !category){
            alert("Fill all fields")
        }
        if(!photoUri){
            alert("Make a photo")
        }
        const now = new Date()
        const date = now.toISOString().split("T")[0]
        const time = now.toLocaleTimeString()

        await insertReport(description, category, date, time, photoUri)

        setDescription('')
        setCategory(null)
        setPhotoUri(null)
        await fetchReports()
    }

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
                    </View>
                }
            </View>
            
            <TouchableOpacity style={[styles.button, {backgroundColor: "#317528ff"}]} onPress={saveReport}>
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