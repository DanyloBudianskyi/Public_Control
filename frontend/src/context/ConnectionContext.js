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
        const interval = setInterval(async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected);

            if (!state.isConnected) {
                setBackendAvailable(false);
                Toast.show({
                    type: "error",
                    text1: t('toast.noInternetTitle'),
                    text2: t('toast.noInternetMessage'),
                    position: "bottom"
                });
                return;
            }

            try {
                const backendOk = await pingBackend();
                if (backendOk !== backendAvailable) { // показываем тост только при изменении
                    setBackendAvailable(backendOk);
                    Toast.show({
                        type: backendOk ? "success" : "error",
                        text1: backendOk ? t('toast.successTitle') : t('toast.backendUnavailableTitle'),
                        text2: backendOk ? t('toast.successMessage') : t('toast.backendUnavailableMessage'),
                        position: "bottom"
                    });
                }
            } catch (err) {
                if (backendAvailable) {
                    setBackendAvailable(false);
                    Toast.show({
                        type: "error",
                        text1: t('toast.backendUnavailableTitle'),
                        text2: t('toast.backendUnavailableMessage'),
                        position: "bottom"
                    });
                }
            }
        }, 15000);

        return () => clearInterval(interval);
    }, [backendAvailable, t]);


    return(
        <ConnectionContext.Provider value={{ isConnected, backendAvailable }}>
            {children}
        </ConnectionContext.Provider>
    )
}

export default ConnectionProvider