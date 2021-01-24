import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import Modal from 'react-native-modal'
import PieChart from 'react-native-pie'
import { BarChart } from 'react-native-chart-kit'

import {
    Container, TitleBalance, Box, BoxTouch, BoxTitle, BoxInfo,
    BoxTile, AddTransactionButton, TabButtons, TabButtonItem,
    TabButtonItemText, CloseModalButton, ViewModal, ModalTile
} from './styles'

import Header from '../../components/Header'
import useWallet from '../../hooks/wallet'
import Loader from '../../components/Loader'
import Watchlist from '../../entities/Watchlist'

interface PieChartData {
    code: string
    name: string
    percentage: number
    color: string
}

interface PieChartSectionData {
    percentage: number
    color: string
}

const Dashboard: React.FC = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()

    const { loadMyPosition, myDataInfo } = useWallet()

    const [isModalWalletVisible, setModalWalletVisible] = useState(false)
    const [isModalRankingPVisible, setModalRankingPVisible] = useState(false)
    const [isModalRankingNVisible, setModalRankingNVisible] = useState(false)
    const [profitLossIndex, setProfitLossIndex] = useState(0)
    const [rankingPositiveIndex, setRankingPositiveIndex] = useState(0)
    const [rankingNegativeIndex, setRankingNegativeIndex] = useState(0)
    const [myData, setMyData] = useState({} as MyDataInfo)
    const [rankingPositive, setRankingPositive] = useState([] as OpenPosition[])
    const [rankingNegative, setRankingNegative] = useState([] as OpenPosition[])
    const [pieChartData, setPieChartData] = useState([] as PieChartData[])
    const [pieChartSectionData, setPieChartSectionData] = useState([] as PieChartSectionData[])

    const colorsGraphic = [
        '#ff9000',
        '#0540F2',
        '#02732A',
        '#312e38',
        '#F5BB00',
        '#F24130',
        '#F2E205',
        '#7AFF0D',
        '#7D4EBF',
        '#48454D'
    ]

    const chartConfig = {
        backgroundColor: "#F5F5F5",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        color: (opacity = 1) => `rgba(49, 46, 56, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(49, 46, 56, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "60",
            strokeWidth: "20",
            stroke: "#ffa726"
        }
    }

    useEffect(() => {

        if (!isFocused)
            return
        //
        if (!myDataInfo || !myDataInfo.openPosition || !myDataInfo.openPosition.length || myDataInfo.openPosition.length < 1)
            return
        //
        const rankingP = [] as OpenPosition[]
        const rankingN = [] as OpenPosition[]
        const pieData = [] as PieChartData[]
        const pieSectionData = [] as PieChartSectionData[]
        //
        myDataInfo.openPosition.map(pos => {
            //
            rankingP.push(pos)
            rankingN.push(pos)
            //
            pieData.push({
                percentage: pos.percentage,
                color: colorsGraphic[pieData.length],
                code: pos.code,
                name: pos.name
            })
            //
            pieSectionData.push({
                percentage: pos.percentage,
                color: colorsGraphic[pieSectionData.length],
            })
            //
        })
        //
        setPieChartData(pieData)
        setPieChartSectionData(pieSectionData)
        //
        rankingP.sort((a, b) => (a.resultNow > b.resultNow) ? -1 : 1)
        while (rankingP.length > 3)
            rankingP.pop()
        //
        setRankingPositive(rankingP)
        //
        rankingN.sort((a, b) => (a.resultNow > b.resultNow) ? 1 : -1)
        while (rankingN.length > 3)
            rankingN.pop()
        //
        setRankingNegative(rankingN)
        //
        setMyData(myDataInfo)
        //
    }, [isFocused, myDataInfo])

    useEffect(() => {
        if (!isFocused || !myData || !myData.openPosition || myData.openPosition.length < 1)
            return
        //
        const myDataTemp = Object.assign({}, myData)
        let totalInvested = 0
        //
        if (profitLossIndex === 1) {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.totalWeek
            })
            //
        } else if (profitLossIndex === 2) {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.totalMonth
            })
            //
        } else if (profitLossIndex === 3) {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.total30D
            })
            //
        } else if (profitLossIndex === 4) {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.totalYear
            })
            //
        } else if (profitLossIndex === 5) {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.total12M
            })
            //
        } else {
            myDataTemp.openPosition.map(pos => {
                totalInvested += pos.totalPaid
            })
            //
        }
        //
        myDataTemp.profitLossAmout = myDataTemp.totalBalance - totalInvested
        myDataTemp.profitLossPerc = ((myDataTemp.totalBalance / totalInvested) - 1) * 100
        //
        setMyData(myDataTemp)
        //
    }, [isFocused, profitLossIndex])

    useEffect(() => {
        if (!isFocused || !myDataInfo || !myDataInfo.openPosition || !myDataInfo.openPosition.length || myDataInfo.openPosition.length < 1)
            return
        //
        const rankingP = [] as OpenPosition[]
        myDataInfo.openPosition.map(pos => rankingP.push(pos))
        //
        if (rankingPositiveIndex === 0)
            rankingP.sort((a, b) => (a.resultNow > b.resultNow) ? -1 : 1)
        //
        if (rankingPositiveIndex === 1)
            rankingP.sort((a, b) => (a.resultWeek > b.resultWeek) ? -1 : 1)
        //
        if (rankingPositiveIndex === 2)
            rankingP.sort((a, b) => (a.resultMonth > b.resultMonth) ? -1 : 1)
        //
        if (rankingPositiveIndex === 3)
            rankingP.sort((a, b) => (a.result30D > b.result30D) ? -1 : 1)
        //
        if (rankingPositiveIndex === 4)
            rankingP.sort((a, b) => (a.resultYear > b.resultYear) ? -1 : 1)
        //
        if (rankingPositiveIndex === 5)
            rankingP.sort((a, b) => (a.result12M > b.result12M) ? -1 : 1)
        //
        while (rankingP.length > 3)
            rankingP.pop()
        //
        setRankingPositive(rankingP)

    }, [isFocused, rankingPositiveIndex])

    useEffect(() => {
        if (!isFocused || !myDataInfo || !myDataInfo.openPosition || !myDataInfo.openPosition.length || myDataInfo.openPosition.length < 1)
            return
        //
        const rankingN = [] as OpenPosition[]
        myDataInfo.openPosition.map(pos => rankingN.push(pos))
        //
        if (rankingNegativeIndex === 0)
            rankingN.sort((a, b) => (a.resultNow > b.resultNow) ? 1 : -1)
        //
        if (rankingNegativeIndex === 1)
            rankingN.sort((a, b) => (a.resultWeek > b.resultWeek) ? 1 : -1)
        //
        if (rankingNegativeIndex === 2)
            rankingN.sort((a, b) => (a.resultMonth > b.resultMonth) ? 1 : -1)
        //
        if (rankingNegativeIndex === 3)
            rankingN.sort((a, b) => (a.result30D > b.result30D) ? 1 : -1)
        //
        if (rankingNegativeIndex === 4)
            rankingN.sort((a, b) => (a.resultYear > b.resultYear) ? 1 : -1)
        //
        if (rankingNegativeIndex === 5)
            rankingN.sort((a, b) => (a.result12M > b.result12M) ? 1 : -1)
        //
        while (rankingN.length > 3)
            rankingN.pop()
        //
        setRankingNegative(rankingN)

    }, [isFocused, rankingNegativeIndex])

    if (!myData || !myData.totalBalance)
        return <Loader message='Loading Dashboard' />

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

                    <TitleBalance>Total Balance: R$ {myData.totalBalance.toFixed(2)}</TitleBalance>

                    <BoxTouch onPress={() => {
                        setModalWalletVisible(true)
                    }} >
                        <BoxTile >
                            <BoxTitle>My Wallet</BoxTitle>
                            <AddTransactionButton onPress={() => navigation.navigate('AddTransaction')} >
                                <Icon name='plus-circle' size={20} color='#312e38' />
                            </AddTransactionButton>
                        </BoxTile>
                        {!!myData.openPosition && myData.openPosition.length > 0 && (
                            myData.openPosition.map(position => (
                                <BoxInfo key={position.code} >{position.name} ({position.percentage.toFixed(2)}%)</BoxInfo>
                            ))
                        )}
                    </BoxTouch>

                    <Box >
                        <BoxTile >
                            <BoxTitle>Profit/Loss</BoxTitle>
                            <TabButtons >
                                <TabButtonItem isSelected={profitLossIndex === 0} onPress={() => setProfitLossIndex(0)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 0} >Total</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 1} onPress={() => setProfitLossIndex(1)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 2} onPress={() => setProfitLossIndex(2)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 2} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 3} onPress={() => setProfitLossIndex(3)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 3} >30D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 4} onPress={() => setProfitLossIndex(4)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 4} >Y</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={profitLossIndex === 5} onPress={() => setProfitLossIndex(5)} >
                                    <TabButtonItemText isSelected={profitLossIndex === 5} >12M</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        <BoxInfo textSize={20} >{!!myData.profitLossPerc ? myData.profitLossPerc.toFixed(2) : 0}%</BoxInfo>
                        <BoxInfo textSize={20} >R$ {!!myData.profitLossAmout ? myData.profitLossAmout.toFixed(2) : 0}</BoxInfo>
                    </Box>

                    <BoxTouch onPress={() => {
                        setModalRankingPVisible(true)
                    }} >
                        <BoxTile >
                            <BoxTitle>Ranking +</BoxTitle>
                            <TabButtons >
                                <TabButtonItem isSelected={rankingPositiveIndex === 0} onPress={() => setRankingPositiveIndex(0)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 0} >Total</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 1} onPress={() => setRankingPositiveIndex(1)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 2} onPress={() => setRankingPositiveIndex(2)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 2} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 3} onPress={() => setRankingPositiveIndex(3)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 3} >30D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 4} onPress={() => setRankingPositiveIndex(4)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 4} >Y</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingPositiveIndex === 5} onPress={() => setRankingPositiveIndex(5)} >
                                    <TabButtonItemText isSelected={rankingPositiveIndex === 5} >12M</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        {!!rankingPositive && rankingPositive.map(pos => (
                            <BoxInfo key={pos.code} >{pos.name} ({
                                (rankingPositiveIndex === 1 ? pos.resultWeek :
                                    (rankingPositiveIndex === 2 ? pos.resultMonth :
                                        (rankingPositiveIndex === 3 ? pos.result30D :
                                            (rankingPositiveIndex === 4 ? pos.resultYear :
                                                (rankingPositiveIndex === 5 ? pos.result12M :
                                                    pos.resultNow
                                                )))))
                                    .toFixed(2)}%)</BoxInfo>
                        ))}

                    </BoxTouch>

                    <BoxTouch onPress={() => {
                        setModalRankingNVisible(true)
                    }} >
                        <BoxTile >
                            <BoxTitle>Ranking -</BoxTitle>
                            <TabButtons >
                                <TabButtonItem isSelected={rankingNegativeIndex === 0} onPress={() => setRankingNegativeIndex(0)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 0} >Total</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 1} onPress={() => setRankingNegativeIndex(1)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 1} >W</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 2} onPress={() => setRankingNegativeIndex(2)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 2} >M</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 3} onPress={() => setRankingNegativeIndex(3)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 3} >30D</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 4} onPress={() => setRankingNegativeIndex(4)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 4} >Y</TabButtonItemText>
                                </TabButtonItem>
                                <TabButtonItem isSelected={rankingNegativeIndex === 5} onPress={() => setRankingNegativeIndex(5)} >
                                    <TabButtonItemText isSelected={rankingNegativeIndex === 5} >12M</TabButtonItemText>
                                </TabButtonItem>
                            </TabButtons>
                        </BoxTile>
                        {!!rankingNegative && rankingNegative.map(pos => (
                            <BoxInfo key={pos.code} >{pos.name} ({
                                (rankingNegativeIndex === 1 ? pos.resultWeek :
                                    (rankingNegativeIndex === 2 ? pos.resultMonth :
                                        (rankingNegativeIndex === 3 ? pos.result30D :
                                            (rankingNegativeIndex === 4 ? pos.resultYear :
                                                (rankingNegativeIndex === 5 ? pos.result12M :
                                                    pos.resultNow
                                                )))))
                                    .toFixed(2)}%)</BoxInfo>
                        ))}
                    </BoxTouch>

                    <Box >
                        <BoxTile >
                            <BoxTitle>Watchlist</BoxTitle>
                            <AddTransactionButton onPress={() => navigation.navigate('AddWatchlist')} >
                                <Icon name='edit' size={20} color='#312e38' />
                            </AddTransactionButton>
                        </BoxTile>
                        <View style={{
                            minHeight: 100,
                        }} >
                            {!!myData.watchlist && myData.watchlist.length > 0 && (
                                myData.watchlist.map((watch: Watchlist) => (
                                    <BoxInfo key={watch.code} >{watch.name} ({watch.code})</BoxInfo>
                                ))
                            )}
                        </View>
                    </Box>

                    <View style={{ height: 24 }} ></View>
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
                    borderColor: '#ff9000',

                }}
                onBackButtonPress={() => setModalWalletVisible(false)}
                onSwipeComplete={() => setModalWalletVisible(false)}
                swipeDirection='up'
                animationIn='zoomInDown'
                animationOut='zoomOutUp'
                backdropColor='black'
                backdropOpacity={0.75}
                backdropTransitionInTiming={1250}
                backdropTransitionOutTiming={1250}
            >
                <ModalTile >
                    <CloseModalButton onPress={() => setModalWalletVisible(false)} >
                        <Icon name='x-circle' size={20} color='#312e38' />
                    </CloseModalButton>
                </ModalTile>

                <ViewModal >

                    <PieChart
                        radius={80}
                        innerRadius={40}
                        sections={[
                            ...pieChartSectionData
                        ]}
                        dividerSize={5}
                        strokeCap={'butt'}
                    />
                    {!!pieChartData && pieChartData.length > 0 && (
                        pieChartData.map(position => (
                            <BoxInfo textColor={position.color} key={position.code} >{position.name} ({position.percentage.toFixed(2)}%)</BoxInfo>
                        ))
                    )}
                </ViewModal>
            </Modal>

            <Modal
                isVisible={isModalRankingPVisible}
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
                    borderColor: '#ff9000',

                }}
                onBackButtonPress={() => setModalRankingPVisible(false)}
                onSwipeComplete={() => setModalRankingPVisible(false)}
                swipeDirection='up'
                animationIn='zoomInDown'
                animationOut='zoomOutUp'
                backdropColor='black'
                backdropOpacity={0.75}
                backdropTransitionInTiming={1250}
                backdropTransitionOutTiming={1250}
            >
                <ModalTile >
                    <CloseModalButton onPress={() => setModalRankingPVisible(false)} >
                        <Icon name='x-circle' size={20} color='#312e38' />
                    </CloseModalButton>
                </ModalTile>

                <ViewModal >

                    <BoxInfo >Ranking Positive</BoxInfo>

                    <BarChart
                        data={{
                            labels: [...(rankingPositive.map(pos => { return pos.code }))],
                            datasets: [
                                {
                                    data: [...(rankingPositive.map(pos => {
                                        return (rankingPositiveIndex === 0 ? pos.resultNow :
                                            (
                                                rankingPositiveIndex === 1 ? pos.resultWeek :
                                                    (
                                                        rankingPositiveIndex === 2 ? pos.resultMonth :
                                                            (
                                                                rankingPositiveIndex === 3 ? pos.result30D :
                                                                    (
                                                                        rankingPositiveIndex === 4 ? pos.resultYear :
                                                                            (
                                                                                rankingPositiveIndex === 5 ? pos.result12M : 0
                                                                            )
                                                                    )
                                                            )
                                                    )
                                            )
                                        )
                                    }))]
                                }
                            ]
                        }}
                        width={Math.round(Dimensions.get('screen').width * 0.85)}
                        height={280}
                        yAxisLabel='%'
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        yAxisSuffix=''
                    />

                </ViewModal>
            </Modal>

            <Modal
                isVisible={isModalRankingNVisible}
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
                    borderColor: '#ff9000',

                }}
                onBackButtonPress={() => setModalRankingNVisible(false)}
                onSwipeComplete={() => setModalRankingNVisible(false)}
                swipeDirection='up'
                animationIn='zoomInDown'
                animationOut='zoomOutUp'
                backdropColor='black'
                backdropOpacity={0.75}
                backdropTransitionInTiming={1250}
                backdropTransitionOutTiming={1250}
            >
                <ModalTile >
                    <CloseModalButton onPress={() => setModalRankingNVisible(false)} >
                        <Icon name='x-circle' size={20} color='#312e38' />
                    </CloseModalButton>
                </ModalTile>

                <ViewModal >

                    <BoxInfo >Ranking Negative</BoxInfo>

                    <BarChart
                        data={{
                            labels: [...(rankingNegative.map(pos => { return pos.code }))],
                            datasets: [
                                {
                                    data: [...(rankingNegative.map(pos => {
                                        return (rankingNegativeIndex === 0 ? pos.resultNow :
                                            (
                                                rankingNegativeIndex === 1 ? pos.resultWeek :
                                                    (
                                                        rankingNegativeIndex === 2 ? pos.resultMonth :
                                                            (
                                                                rankingNegativeIndex === 3 ? pos.result30D :
                                                                    (
                                                                        rankingNegativeIndex === 4 ? pos.resultYear :
                                                                            (
                                                                                rankingNegativeIndex === 5 ? pos.result12M : 0
                                                                            )
                                                                    )
                                                            )
                                                    )
                                            )
                                        )
                                    }))]
                                }
                            ]
                        }}
                        width={Math.round(Dimensions.get('screen').width * 0.85)}
                        height={280}
                        yAxisLabel='%'
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        yAxisSuffix=''
                    />

                </ViewModal>
            </Modal>
        </>
    )
}

export default Dashboard
