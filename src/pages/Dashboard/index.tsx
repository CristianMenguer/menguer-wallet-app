import React from 'react'
import { Dimensions, Text } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit'

import useAuth from '../../hooks/auth'

import { Container } from './styles'

import Button from '../../components/Button'

const Dashboard: React.FC = () => {

    const { signOut } = useAuth()

    const dataLine = [
        Math.random() * 1000 - 200,
        Math.random() * 1000 - 200,
        Math.random() * 1000 - 200,
        Math.random() * 1000 - 200,
        Math.random() * 1000 - 200,
        Math.random() * 1000 - 200
    ]

    const dataPie = [
        {
            name: "AIB",
            population: 12000,
            color: "rgba(131, 167, 234, 1)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Tesco",
            population: 28000,
            color: "#F00",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "SuperValu",
            population: 11500,
            color: "green",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "PC World",
            population: 38000,
            color: "#ffffff",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: "Aldi",
            population: 11920,
            color: "rgb(0, 0, 255)",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ]

    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        }
    }

    return (
        <Container >

            <Text>Profit/Loss by Month</Text>
            <LineChart
                data={{
                    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                    datasets: [
                        {
                            data: [
                                ...dataLine
                            ]
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                yAxisLabel="€"
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={chartConfig}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />

            <Text>Stocks in your Wallet</Text>
            <PieChart
                data={[...dataPie]}
                width={Dimensions.get("window").width - 48}
                height={175}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"-20"}
                center={[25, 0]}
                absolute
            />

            <Button onPress={() => signOut()} >Sign Out</Button>
        </Container>
    )
}

export default Dashboard
