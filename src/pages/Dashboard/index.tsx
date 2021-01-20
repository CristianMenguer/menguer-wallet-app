import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import Modal from 'react-native-modal'

import { Container, TitleBalance, Box, BoxTouch, BoxTitle, BoxInfo, BoxTile, AddTransactionButton, TabButtons, TabButtonItem, TabButtonItemText } from './styles'

import Header from '../../components/Header'
import Company from '../../entities/Company'
import useWallet from '../../hooks/wallet'
import { colors } from '../../constants/colors'

const Dashboard: React.FC = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const { loadMyPosition, myDataInfo } = useWallet()


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
    const [isModalWalletVisible, setModalWalletVisible] = useState(false)
    const [profitLossIndex, setProfitLossIndex] = useState(0)
    const [rankingPositiveIndex, setRankingPositiveIndex] = useState(0)
    const [rankingNegativeIndex, setRankingNegativeIndex] = useState(0)
    const [companies, setCompanies] = useState<Company[]>([])
    const [myWallet, setMyWallet] = useState<OpenPosition[]>([])
    const [data, setData] = useState([{
        value: 'Banana',
    }, {
        value: 'Mango',
    }, {
        value: 'Pear',
    }])

    useEffect(() => {
        if (!isFocused)
            return
        //
        // loadMyPosition()
        //     .then(myData => {
        //         console.log('myData:')
        //         console.log(myData)
        //         const wallet = myWallet
        //         while (wallet.length > 0)
        //             wallet.shift()
        //         //
        //         if (!!myData && myData.openPosition.length > 0) {
        //             myData.openPosition.map(position => {
        //                 const newPos = position
        //                 newPos.totalNow = newPos.totalPaid + (Math.trunc(newPos.totalPaid * (Math.random() - 0.35)))
        //                 wallet.push(newPos)
        //             })

        //             setMyWallet(wallet)
        //         }
        //     })
    }, [isFocused])


    return (
        <>
            <Header />
            <Container >
                <ScrollView
                    style={{
                        width: '100%',
                        paddingTop: 12,
                        paddingHorizontal: 8,
                        paddingBottom: 16,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 16,
                    }}
                >

                    <TitleBalance>Total Balance: R$ {myDataInfo.totalBalance}</TitleBalance>

                    <Box >
                        <BoxTile >
                            <BoxTitle>My Wallet</BoxTitle>
                            <AddTransactionButton onPress={() => navigation.navigate('AddTransaction')} >
                                <Icon name='plus-circle' size={20} color='#312e38' />
                            </AddTransactionButton>
                        </BoxTile>
                        {!!myWallet && myWallet.length > 0 && (
                            myWallet.map(position => (
                                <BoxInfo key={position.code} >{position.name} (Paid: R$ {position.totalPaid}) (Now: R$ {position.totalNow})</BoxInfo>
                            ))

                        )}
                    </Box>

                    <BoxTouch onPress={() => {
                        setModalWalletVisible(true)
                    }} >
                        <BoxTile >
                            <BoxTitle>Profit/Loss</BoxTitle>
                            <TabButtons >
                                {/* profitLossIndex */}
                                <TabButtonItem isSelected={profitLossIndex === 0} onPress={() => setProfitLossIndex(0)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 0} >D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 1} onPress={() => setProfitLossIndex(1)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 2} onPress={() => setProfitLossIndex(2)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 2} >30</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 3} onPress={() => setProfitLossIndex(3)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 3} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 4} onPress={() => setProfitLossIndex(4)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 4} >12M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 5} onPress={() => setProfitLossIndex(5)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 5} >Y</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        <BoxInfo>98%</BoxInfo>
                        <BoxInfo>R$ 4.11</BoxInfo>
                    </BoxTouch>

                    <Box >
                        <BoxTile >
                            <BoxTitle>My Ranking +</BoxTitle>
                            <TabButtons >
                                <TabButtonItem isSelected={rankingPositiveIndex === 0} onPress={() => setRankingPositiveIndex(0)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 0} >D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 1} onPress={() => setRankingPositiveIndex(1)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 2} onPress={() => setRankingPositiveIndex(2)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 2} >30</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 3} onPress={() => setRankingPositiveIndex(3)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 3} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 4} onPress={() => setRankingPositiveIndex(4)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 4} >12M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 5} onPress={() => setRankingPositiveIndex(5)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 5} >Y</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        <BoxInfo>Disney +45%</BoxInfo>
                        <BoxInfo>Facebook +23%</BoxInfo>
                        <BoxInfo>Amazon +6%</BoxInfo>
                    </Box>

                    <Box >
                        <BoxTile >
                            <BoxTitle>My Ranking -</BoxTitle>
                            <TabButtons >
                                <TabButtonItem isSelected={rankingNegativeIndex === 0} onPress={() => setRankingNegativeIndex(0)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 0} >D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 1} onPress={() => setRankingNegativeIndex(1)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 2} onPress={() => setRankingNegativeIndex(2)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 2} >30</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 3} onPress={() => setRankingNegativeIndex(3)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 3} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 4} onPress={() => setRankingNegativeIndex(4)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 4} >12M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 5} onPress={() => setRankingNegativeIndex(5)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 5} >Y</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        <BoxInfo>Disney -45%</BoxInfo>
                        <BoxInfo>Facebook -23%</BoxInfo>
                        <BoxInfo>Amazon -6%</BoxInfo>
                    </Box>

                </ScrollView>
            </Container>

            <Modal
                isVisible={isModalWalletVisible}
                style={{
                    backgroundColor: 'white',
                    maxHeight: '50%',
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 200,
                    borderRadius: 20,
                    borderWidth: 2,
                    borderColor: colors.orange,

                }}
                onBackButtonPress={() => setModalWalletVisible(false)}
                onBackdropPress={() => setModalWalletVisible(false)}
                swipeDirection='left'
                animationIn='zoomInDown'
                animationOut='zoomOutUp'
                backdropColor='black'
                backdropOpacity={0.75}
                backdropTransitionInTiming={750}
                backdropTransitionOutTiming={750}
            >
                <View style={{ flex: 1, justifyContent: 'center',alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setModalWalletVisible(false)} >
                        <Text>Close Modal!</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
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
