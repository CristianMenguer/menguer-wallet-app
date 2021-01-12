import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import useAuth from '../../hooks/auth'

const Dashboard: React.FC = () => {

    const { signOut } = useAuth()

    return (
        <View>
            <TouchableOpacity onPress={() => signOut()} >
                <Text>Dashboard</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Dashboard
