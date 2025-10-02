import {createContext, useEffect, useState} from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import {pingBackend} from "../api/ping";

export const ConnectionContext = createContext()

const ConnectionProvider = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [backendAvailable, setBackendAvailable] = useState(false)

    useEffect(() => {
        const checkConnection = async () => {
            const state = await NetInfo.fetch()
            setIsConnected(state.isConnected)
            if(!state){
                Toast.show({
                    type: "error",
                    text1: "Нет интернета",
                    text2: "Приложение работает оффлайн",
                    position: "bottom"
                })
                return
            }
            try {
                const backendOk = await pingBackend();
                setBackendAvailable(backendOk);
                if (!backendOk) {
                    Toast.show({
                        type: "error",
                        text1: "Бэкенд недоступен",
                        text2: "Приложение работает оффлайн",
                        position: "bottom"
                    });
                }
                if(state && backendOk){
                    Toast.show({
                        type: "success",
                        text1: "Успех",
                        text2: "Приложение успешно подключилось к серверу",
                        position: "bottom"
                    });
                }
            }catch (err){
                setBackendAvailable(false);
                Toast.show({
                    type: "error",
                    text1: "Ошибка при проверке бэкенда",
                });
            }
        }
        checkConnection()
    }, []);

    return(
        <ConnectionContext.Provider value={{ isConnected, backendAvailable }}>
            {children}
        </ConnectionContext.Provider>
    )
}

export default ConnectionProvider