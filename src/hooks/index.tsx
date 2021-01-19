import React from 'react'

import { AuthProvider } from './auth'
import { LoadDataProvider } from './loadData'
import { WalletProvider } from './wallet'

const AppProvider: React.FC = ({ children }) => (
    <AuthProvider >
        <LoadDataProvider >
            <WalletProvider >
                {children}
            </WalletProvider>
        </LoadDataProvider>
    </AuthProvider>
)

export default AppProvider
