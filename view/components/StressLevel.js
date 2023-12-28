import React from 'react';
import {HStack, Text, VStack} from "native-base";
import {LineChart} from "react-native-chart-kit";
import {View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const data={
    labels: ["11/27", "11/28", "11/29", "11/30", "12/1"],
        datasets: [
        {
            data: [
                2,4,4,5,4
            ]
        }
    ]
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
                <Text fontSize={'xs'}>스트레스 관리가 필요한 레벨이에요.</Text>
            </VStack>
                <VStack alignItems={"center"}>
                    <Text bold fontSize={"lg"}>04</Text>
                    <Text fontSize={'xs'}>현재 스트레스</Text>
                </VStack>
        </HStack>
            <View>
                <LineChart data={data} width={340} height={180} fromZero={true}
                           chartConfig={{
                               //backgroundColor: "white",
                               backgroundGradientFrom: '#FFFFFF',
                               backgroundGradientFromOpacity: 0,
                               backgroundGradientTo: '#FFFFFF',
                               backgroundGradientToOpacity: 0,
                               fillShadowGradient:'#FFFFFF',
                               fillShadowGradientOpacity: 0,
                               color: (opacity = 1) => `#FF6B18`,
                               labelColor: (opacity = 1) => `#ADADAD`,
                               strokeWidth: 1,
                               useShadowColorFromDataset: true,
                               decimalPlaces: 0,
                               propsForBackgroundLines : {
                                   stroke:"#E6E6E7",
                               },
                              }}
                           withVerticalLines={false}
                           style={{margin:2, marginTop:18}}>
                </LineChart>
            </View>
        </VStack>
    )
}
