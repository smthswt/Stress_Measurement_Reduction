import {View} from "react-native";
import {Button, Center, HStack, Progress, ScrollView, Text, VStack} from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * Component for displaying settings view.
 *
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} The rendered settings view.
 */
{/*
const stressData = [
    {date: '2023-12-10', stressIndex: 120},
    {date: '2023-12-11', stressIndex: 150},
    {date: '2023-12-12', stressIndex: 78},
    {date: '2023-12-13', stressIndex: 99},
    {date: '2023-12-14', stressIndex: 88},
    {date: '2023-12-15', stressIndex: 45},
    {date: '2023-12-16', stressIndex: 50},
    {date: '2023-12-17', stressIndex: 80},
    {date: '2023-12-18', stressIndex: 75},
    {date: '2023-12-19', stressIndex: 95},
]
*/}
const stressData = null
const StressComponent = ({date, stressIndex}) => {
    return (
        <VStack bg={"white"} shadow={2} space={3} p={5}>
            <HStack justifyContent={"space-between"}>
                <Text>{date}</Text>
                <Text >{stressIndex}</Text>
            </HStack>
            <Progress flex={1} colorScheme="blue" shadow={0} value={stressIndex} min={0} max={200}/>
        </VStack>
    )
}

export const HomeView_AllStress = ({navigation}) => {
    const handleAnalysisStart = () => {
        navigation.navigate("AnalysisStart");
    };

    return (
        <>
            {stressData ? (
                <ScrollView>
                    <VStack p={3} space={3}>
                        {stressData.map((item, index) => (
                            <StressComponent key={index} date={item.date} stressIndex={item.stressIndex} />
                        ))}
                    </VStack>
                </ScrollView>
            ) : (
                    <VStack height={'100%'} justifyContent={"center"} alignItems={"center"} space={8}>
                        <Ionicons name="alert-circle-outline" size={120} color={"#59BCFF"}/>
                        <Text textAlign={"center"} bold>
                            최근 검사한 정보가 없어요 {"\n"} 검사 후에 정보를 정리해서 보여드릴게요.
                        </Text>
                        <Button variant={'outline'} bg={"#2785F4"} pl={5} pr={5} onPress={handleAnalysisStart}>
                            <Text bold color={"white"}>검사하기</Text>
                        </Button>
                    </VStack>

            )}
        </>
    )

};
