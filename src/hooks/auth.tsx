import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

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
    signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>({} as AuthState)

    useEffect(() => {
        async function loadAsyncStorage(): Promise<void> {
            const [token, user] = await AsyncStorage.multiGet([
                '@GoBarber:token',
                '@GoBarber:user'
            ])

            if (token[1] && user[1]) {
                setData({
                    token: token[1],
                    user: JSON.parse(user[1])
                })
            }
        }

        loadAsyncStorage()

    }, [])

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

        setData({ token, user })

    }, [])

    const signOut = useCallback(async () => {

        await AsyncStorage.multiRemove([
            '@MenguerWallet:token',
            '@MenguerWallet:user'
        ])

        setData({} as AuthState)

    }, [])

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }} >
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
