import { useState } from "react";
import { View, Text, Linking, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { fetchReports, insertReport } from "../database";
import { Picker } from "@react-native-picker/picker";

const ReportScreen = () => {
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState(null)
    const [photoUri, setPhotoUri] = useState(null)

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
        <View>
            <View>
                <Text>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe violation"
                />
            </View>
            <View>
                <Text>Category</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                >
                    <Picker.Item label="Шумове порушення" value="noise"/>
                    <Picker.Item label="Порушення правил паркування" value="parking"/>
                    <Picker.Item label="Забруднення території" value="littering"/>
                    <Picker.Item label="Порушення тиші в нічний час" value="night_noise"/>
                    <Picker.Item label="Порушення правил дорожнього руху" value="traffic"/>
                </Picker>
            </View>
            <View>
                <TouchableOpacity onPress={pickImage}>
                    <Text>Take a photo</Text>
                </TouchableOpacity>
                {photoUri && <Image source={{uri: photoUri}} style={styles.image}/>}
            </View>
            <View>
                <TouchableOpacity onPress={saveReport}>
                    <Text>Save</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: { width: 200, height: 200, marginTop: 8 },
});

export default ReportScreen