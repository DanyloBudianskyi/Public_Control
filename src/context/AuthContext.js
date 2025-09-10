import { createContext, use, useState } from "react"

export const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return(
        <AuthContext.Provider value={{isLoggedIn, user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider