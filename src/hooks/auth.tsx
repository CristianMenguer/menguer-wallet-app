import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

// Interfaces used in the authentication process
interface AuthState {
    token: string
    user: object
}

interface SignInCredential {
    email: string
    password: string
}

interface AuthContextData {
    user: object
    signIn(credential: SignInCredential): Promise<void>
    signOut(): Promise<void>
    isLoadingAuth: boolean
}

// creates the context of authentication
const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    // these "variables" are available everywhere in the application
    // they are "global"
    const [data, setData] = useState<AuthState>({} as AuthState)
    const [isLoadingAuth, setLoadingAuth] = useState(true)

    // when first run, it tries to retrieve the data from local storage
    // it will found it the user is already signed in
    useEffect(() => {
        async function loadAsyncStorage() {
            const [token, user] = await AsyncStorage.multiGet([
                '@MenguerWallet:token',
                '@MenguerWallet:user'
            ])

            if (token[1] && user[1]) {
                setData({
                    token: token[1],
                    user: JSON.parse(user[1])
                })
                //
                api.defaults.headers.authorization = `Bearer ${token[1]}`
            }

            setLoadingAuth(false)
        }

        loadAsyncStorage()

    }, [])

    // receives the e-mail and password typed by the user and tries to
    // start a session in the API, getting a token
    // It also saves to the local storage
    const signIn = useCallback(async ({ email, password }) => {

        const response = await api.post('session', {
            email,
            password
        })

        const { token, user } = response.data

        await AsyncStorage.multiSet([
            ['@MenguerWallet:token', token],
            ['@MenguerWallet:user', JSON.stringify(user)]
        ])

        api.defaults.headers.authorization = `Bearer ${token}`

        setData({ token, user })

    }, [])

    // removes the user data from local storage and sign out
    const signOut = useCallback(async () => {

        await AsyncStorage.multiRemove([
            '@MenguerWallet:token',
            '@MenguerWallet:user'
        ])

        setData({} as AuthState)

    }, [])

    // returns the provider
    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, isLoadingAuth }} >
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(): AuthContextData {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('useAuth must be used within an AuthProvider!')
    }

    return context

}

export default useAuth
