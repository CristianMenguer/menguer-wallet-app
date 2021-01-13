import React, { useEffect } from 'react'
import { ScrollView, Text } from 'react-native'
import { LineChart, PieChart } from 'react-native-chart-kit'

import { Container, Box } from './styles'

import Header from '../../components/Header'
import Company from '../../entities/Company'
import { AddCompanyDB, LoadCompanyByCodeDB } from '../../models/Company'
import { startDb } from '../../database'

const Dashboard: React.FC = () => {

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

    useEffect(() => {
        async function test() {
            let fromDB = await LoadCompanyByCodeDB('CSAN3')
            console.log('\n\nbefore: ')
            console.log(fromDB)
            if (!fromDB || !fromDB.id_api || fromDB.id_api < 1) {
                const company: Company = {
                    id_api: 1,
                    code: 'CSAN3',
                    code_rdz: 'CSAN',
                    economic_sector: 'PETRÓLEO, GÁS E BIOCOMBUSTÍVEIS',
                    name: 'COSAN',
                    segment: 'PETRÓLEO, GÁS E BIOCOMBUSTÍVEIS',
                    subsector: 'PETRÓLEO, GÁS E BIOCOMBUSTÍVEIS',
                    created_at: new Date(),
                    updated_at: new Date()

                }

                await AddCompanyDB(company)

                fromDB = await LoadCompanyByCodeDB('CSAN3')
                console.log('\n\nafter: ')
                console.log(fromDB)
            }
        }

        async function test2() {
            const db = await startDb()
            console.log(db)
        }

        test()

    }, [])

    return (
        <>
            <Header />
            <Container >
                <Text>Total Balance: R$ 999.64</Text>

                <Box >
                    <Text>My Wallet</Text>
                    <Text>Amazon 50% (R$ 499.82)</Text>
                    <Text>Disney 25% (R$ 249.91)</Text>
                    <Text>Facebook 25% (R$ 249.91)</Text>
                </Box>

                <Box >
                    <Text>D | W | 30D | M | 12M | Y</Text>
                    <Text>Profit/Loss</Text>
                    <Text>98%</Text>
                    <Text>R$ 4.11</Text>
                </Box>

                <Box >
                    <Text>D | W | 30D | M | 12M | Y</Text>
                    <Text>My Ranking +</Text>
                    <Text>Disney +45%</Text>
                    <Text>Facebook +23%</Text>
                    <Text>Amazon +6%</Text>
                </Box>

                <Box >
                    <Text>D | W | 30D | M | 12M | Y</Text>
                    <Text>My Ranking -</Text>
                    <Text>Disney -45%</Text>
                    <Text>Facebook -23%</Text>
                    <Text>Amazon -6%</Text>
                </Box>

            </Container>
        </>
    )


    // return (
    //     <Container >

    //         <Text>Profit/Loss by Month</Text>
    //         <LineChart
    //             data={{
    //                 labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    //                 datasets: [
    //                     {
    //                         data: [
    //                             ...dataLine
    //                         ]
    //                     }
    //                 ]
    //             }}
    //             width={Dimensions.get("window").width} // from react-native
    //             height={220}
    //             yAxisLabel="€"
    //             yAxisSuffix=""
    //             yAxisInterval={1} // optional, defaults to 1
    //             chartConfig={chartConfig}
    //             bezier
    //             style={{
    //                 marginVertical: 8,
    //                 borderRadius: 16
    //             }}
    //         />

    //         <Text>Stocks in your Wallet</Text>
    //         <PieChart
    //             data={[...dataPie]}
    //             width={Dimensions.get("window").width - 48}
    //             height={175}
    //             chartConfig={chartConfig}
    //             accessor={"population"}
    //             backgroundColor={"transparent"}
    //             paddingLeft={"-20"}
    //             center={[25, 0]}
    //             absolute
    //         />

    //         <Button onPress={() => signOut()} >Sign Out</Button>
    //     </Container>
    // )
}

export default Dashboard
