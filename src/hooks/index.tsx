import React from 'react'

import { AuthProvider } from './auth'
import { LoadDataProvider } from './loadData'

const AppProvider: React.FC = ({ children }) => (
    <AuthProvider >
        <LoadDataProvider >
            {children}
        </LoadDataProvider>
    </AuthProvider>
)

export default AppProvider
