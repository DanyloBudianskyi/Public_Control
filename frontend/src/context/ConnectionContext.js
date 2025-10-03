import {createContext, useEffect, useState} from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import {pingBackend} from "../api/ping";
import {useTranslation} from "react-i18next";

export const ConnectionContext = createContext()

const ConnectionProvider = ({children}) => {
    const [isConnected, setIsConnected] = useState(false)
    const [backendAvailable, setBackendAvailable] = useState(false)
    const {t} = useTranslation()

    useEffect(() => {
        const checkConnection = async () => {
            const state = await NetInfo.fetch()
            setIsConnected(state.isConnected)
            if(!state){
                Toast.show({
                    type: "error",
                    text1: t('toast.noInternetTitle'),
                    text2: t('toast.noInternetMessage'),
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
                        text1: t('toast.backendUnavailableTitle'),
                        text2: t('toast.backendUnavailableMessage'),
                        position: "bottom"
                    });
                }
                if(state && backendOk){
                    Toast.show({
                        type: "success",
                        text1: t('toast.successTitle'),
                        text2: t('toast.successMessage'),
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