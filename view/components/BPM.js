import React from 'react';
import {Box, Divider, HStack, Text, VStack} from "native-base";
import {LineChart} from "react-native-chart-kit";
import {Dimensions, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const data={
    labels: ["09:00", "12:00", "15:00", "18:00", "21:00"],
        datasets: [
        {
            data: [
                48,90,80,112,68
            ]
        }
    ]
}
export const BPM = () => {
    return (
        <VStack bgColor={'white'} p={3} shadow={2}>
            <HStack justifyContent={'space-between'}>
            <VStack justifyContent={'space-between'}>
                <HStack alignItems={"center"} space={1}>
                    <Ionicons name={"heart"} color={"#FF4370"} size={20}></Ionicons>
                    <Text bold fontSize={'lg'}>BPM</Text>
                </HStack>
                <Text fontSize={'xs'}>오늘 하루 BPM이에요!</Text>
            </VStack>
            <HStack space={2}>
                <VStack alignItems={"center"}>
                    <Text bold fontSize={"lg"}>112</Text>
                    <Text fontSize={'xs'}>최고 BPM</Text>
                </VStack>
                <Divider thickness="1" orientation="vertical" />
                <VStack alignItems={"center"}>
                    <Text bold fontSize={"lg"}>48</Text>
                    <Text fontSize={'xs'}>최저 BPM</Text>
                </VStack>
            </HStack>

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
                               color: (opacity = 1) => `#FF4370`,
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
