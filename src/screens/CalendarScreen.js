import { useEffect, useState } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { fetchReports } from "../database";

const CalendarScreen = () => {
    const [reports, setReports] = useState([])
    const getReports = async () => {
        const data = await fetchReports()
        setReports(data) 
    }

    useEffect(() => {
        getReports()
    }, [])

    return (
        <View>
            <FlatList
                data={reports}
                renderItem={({item}) => (
                    <View>
                        <Text>{item.description}</Text>
                        <Text>{item.category}</Text>
                        <Text>{item.date} {item.time}</Text>
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