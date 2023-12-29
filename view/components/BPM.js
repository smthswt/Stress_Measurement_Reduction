import React from 'react';
import {Box, Divider, HStack, Text, VStack} from "native-base";
import {BarChart, LineChart} from "react-native-chart-kit";
import {View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend} from "victory-native";
import {VictoryTheme} from "victory";

const mockData = {
    before: [
        {date: "2023.11.09", bpm: 64},
        {date: "2023.11.11", bpm: 89},
    ],
    after: [
        {date: "2023.11.09", bpm: 119},
        {date: "2023.11.11", bpm: 64},
    ],
}

const firstdata = {
    labels : ["64", "119"],
    datasets: [
        {
            data: [64,119],
            colors: [
                (opacity = 1) => `#2785F4`,
                (opacity=1) => `#FF4370`
            ]
        }
    ]
}

const seconddata = {
    labels : ["89", "64"],
    datasets: [
        {
            data: [89,64],
            colors: [
                (opacity = 1) => `#2785F4`,
                (opacity=1) => `#FF4370`
            ]
        }
    ]
}

export const BPM = () => {
    return (
        <VStack bgColor={'white'} shadow={2}>
            <HStack justifyContent={'space-between'} p={3}>
            <VStack justifyContent={'space-between'}>
                <HStack alignItems={"center"} space={1}>
                    <Ionicons name={"heart"} color={"#FF4370"} size={20}></Ionicons>
                    <Text bold fontSize={'lg'}>BPM</Text>
                </HStack>
                <Text fontSize={'xs'}>BPM 측정 전 후 비교 그래프에요.</Text>
            </VStack>
            <VStack space={2}>
                <HStack alignItems={"center"} space={2}>
                    <Ionicons name={"ellipse"} color={"#2785F4"}/>
                    <Text fontSize={'xs'}>힐링 전</Text>
                </HStack>
                <HStack alignItems={"center"} space={2}>
                    <Ionicons name={"ellipse"} color={"#FF4370"}/>
                    <Text fontSize={'xs'}>힐링 후</Text>
                </HStack>
            </VStack>

            </HStack>
            <HStack justifyContent={"center"} alignItems={"center"}>
                {/*
                    <VStack flex={1} justifyContent={"center"} alignItems={"center"}>
                        <Text bold>2023.11.09</Text>
                        <BarChart data={firstdata} width={150} height={200}
                                  chartConfig={{
                                      backgroundColor: "#FFFFFF",
                                      backgroundGradientTo:"#FFFFFF",
                                      backgroundGradientFromOpacity:0,
                                      backgroundGradientFrom:"#FFFFFF",
                                      backgroundGradientToOpacity:0,
                                      color: (opacity = 1) => `#000000`,
                                      barPercentage: 0.7,
                                      barRadius:5
                                  }}
                                  withHorizontalLabels={false}
                                  withVerticalLabels={true}
                                  withInnerLines={true}
                                  fromZero={true}
                                  withCustomBarColorFromData={true}
                                  showBarTops={false}
                                  flatColor={true}
                                  style={{marginLeft:-50}}/>
                    </VStack>
                    <VStack flex={1} justifyContent={"center"} alignItems={"center"}>
                        <Text bold>2023.11.11</Text>
                        <BarChart data={seconddata} width={150} height={200}
                                  chartConfig={{
                                      backgroundColor: "#FFFFFF",
                                      backgroundGradientTo:"#FFFFFF",
                                      backgroundGradientFrom:"#FFFFFF",
                                      backgroundGradientFromOpacity:0,
                                      backgroundGradientToOpacity:0,
                                      color: (opacity = 1) => `#000000`,
                                      barPercentage: 0.7,
                                      barRadius:5
                                  }}
                                  withHorizontalLabels={true}
                                  withVerticalLabels={true}
                                  withInnerLines={true}
                                  fromZero={true}
                                  withCustomBarColorFromData={true}
                                  showBarTops={false}
                                  flatColor={true}
                                  showValuesOnTopOfBars={false}
                                  style={{marginLeft:0}}/>
                    </VStack>
                    */}
                <VictoryChart width={350} height={250} maxDomain={{y:120}} theme={VictoryTheme.material}>
                    <VictoryGroup offset={35} width={250} height={200}>
                        <VictoryBar
                            barWidth={25}
                            labels={({ datum }) => datum.bpm}
                            style={{ data: { fill: "#2785F4" },labels: { fill: "black", fontWeight:"bold"} }}
                            data={mockData.before}
                            x={"date"}
                            y={"bpm"}
                            cornerRadius={5}

                        />
                        <VictoryBar
                            barWidth={25}
                            labels={({ datum }) => datum.bpm}
                            style={{ data: { fill: "#FF4370" },labels: { fill: "black", fontWeight:"bold"} }}
                            data={mockData.after}
                            x={"date"}
                            y={"bpm"}
                            cornerRadius={5}
                        />
                    </VictoryGroup>
            </VictoryChart>
            </HStack>

        </VStack>
    )
}
