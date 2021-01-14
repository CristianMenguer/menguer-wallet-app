import React, { useEffect, useState } from 'react'
import { Text, ScrollView } from 'react-native'


import { Container, Box } from './styles'

import Header from '../../components/Header'
import Company from '../../entities/Company'
import { GetCompaniesDB } from '../../models/Company'

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

    const [textValue, setTextValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [companies, setCompanies] = useState<Company[]>([])
    const [data, setData] = useState([{
        value: 'Banana',
    }, {
        value: 'Mango',
    }, {
        value: 'Pear',
    }])

    useEffect(() => {
        GetCompaniesDB()
            .then(response => {
                setCompanies(response)
                //
                const allDrop = data
                response.map(company => {
                    allDrop.push()
                })
                setData(allDrop)
                //
            })
    }, [])

    function _onChangeText(text: string) {
        setTextValue(text)
        setIsLoading(true)
        console.log(text)
    }


    return (
        <>
            <Header />
            <Container >
                <ScrollView style={{
                    width: '100%'
                }} >

                    <Box >

                        {!!companies && companies.length > 0 && (
                            companies.map(company => (
                                <Text key={company.id_api} >{company.name}</Text>
                            ))
                        )}
                    </Box>

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
                </ScrollView>
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
