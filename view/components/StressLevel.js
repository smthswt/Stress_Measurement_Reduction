import React from 'react';
import {HStack, Text, VStack} from "native-base";
import {LineChart} from "react-native-chart-kit";
import {View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {VictoryBar, VictoryChart, VictoryGroup} from "victory-native";
import {VictoryTheme} from "victory";

const mockData = {
    before: [
        {date: "2023.11.09", stressLevel: 3},
        {date: "2023.11.11", stressLevel: 4},
    ],
    after: [
        {date: "2023.11.09", stressLevel: 5},
        {date: "2023.11.11", stressLevel: 3},
    ],
}
export const StressLevel = () => {
    return (
        <VStack bgColor={'white'} p={3} shadow={2}>
            <HStack justifyContent={'space-between'}>
            <VStack justifyContent={'space-between'}>
                <HStack alignItems={"center"} space={1}>
                    <Ionicons name={"flash"} color={"#FF6B18"} size={20}></Ionicons>
                    <Text bold fontSize={'lg'}>스트레스 레벨</Text>
                </HStack>
                <Text fontSize={'xs'}>오늘 힘든 하루를 보내셨나요?</Text>
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
                <VictoryChart width={350} height={250} maxDomain={{y:5}} theme={VictoryTheme.material}>
                    <VictoryGroup offset={35} width={250} height={200}>
                        <VictoryBar
                            barWidth={25}
                            labels={({ datum }) => datum.stressLevel}
                            style={{ data: { fill: "#2785F4" },labels: { fill: "black", fontWeight:"bold"} }}
                            data={mockData.before}
                            x={"date"}
                            y={"stressLevel"}
                            cornerRadius={5}

                        />
                        <VictoryBar
                            barWidth={25}
                            labels={({ datum }) => datum.stressLevel}
                            style={{ data: { fill: "#FF4370" },labels: { fill: "black", fontWeight:"bold"} }}
                            data={mockData.after}
                            x={"date"}
                            y={"stressLevel"}
                            cornerRadius={5}
                        />
                    </VictoryGroup>
                </VictoryChart>
            </HStack>

        </VStack>
    )
}
