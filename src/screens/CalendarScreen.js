import { useContext, useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { fetchReports } from "../database";
import { ThemeContext } from "../../App";

const CalendarScreen = () => {
    const [reports, setReports] = useState([])

    const {theme} = useContext(ThemeContext)

    const getReports = async () => {
        const data = await fetchReports()
        setReports(data) 
    }

    useEffect(() => {
        getReports()
    }, [])

    return (
        <View style={{backgroundColor: theme.background, flex: 1}}>
            <FlatList
                data={reports}
                renderItem={({item}) => (
                    <View>
                        <Text style={{color: theme.text}}>{item.description}</Text>
                        <Text style={{color: theme.text}}>{item.category}</Text>
                        <Text style={{color: theme.text}}>{item.date} at {item.time}</Text>
                        {item.photoUri ? (
                            <Image 
                                source={{uri: item.photoUri}}
                                style={{ width: 100, height: 100, marginTop: 5 }}
                            /> 
                        ) : null}
                    </View>
                )}
            />
        </View>
    );
}

export default CalendarScreen