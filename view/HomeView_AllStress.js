import {View} from "react-native";
import {Button, Center, HStack, Progress, ScrollView, Text, VStack} from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import emotion_tired from "./images/emotion_tired.png";
import emotion_soso from "./images/emotion_soso.png";
import emotion_happy from "./images/emotion_happy.png";
import emotion_normal from "./images/emotion_normal.png";
import emotion_sad from "./images/emotion_sad.png";
import emotion_angry from "./images/emotion_angry.png";

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

const stressData = {
  '2023.12.29': { before: 3, after: 1, },
  '2023.12.28': { before: 4, after: 1, },
  '2023.12.27': { before: 5, after: 2, },
  '2023.12.26': { before: 2, after: 2, },
  '2023.12.25': { before: 4, after: 3, },
  '2023.12.24': { before: 4, after: 3, },
  '2023.12.23': { before: 4, after: 3, },
  '2023.12.22': { before: 3, after: 3, },
  '2023.12.21': { before: 2, after: 1, },
  '2023.12.20': { before: 1, after: 1, },
};

//const stressData = null
const StressComponent = ({date, before, after}) => {
    return (
        <VStack bg={"white"} shadow={2} space={3} p={5}>
            <HStack justifyContent={"space-between"}>
                <Text>{date}</Text>
                <HStack space={5}>
                  <HStack alignItems={"center"} space={2}>
                    <Ionicons name={"ellipse"} color={"#2785F4"}/>
                    <Text fontSize={'xs'}>힐링 전</Text>
                  </HStack>
                  <HStack alignItems={"center"} space={2}>
                    <Ionicons name={"ellipse"} color={"#FF4370"}/>
                    <Text fontSize={'xs'}>힐링 후</Text>
                  </HStack>
                </HStack>
            </HStack>
            <HStack alignItems={"center"} space={3}>
              <Progress flex={1} colorScheme="blue" shadow={0} value={before} min={0} max={5} height={3}/>
              <Text>{before}</Text>
            </HStack>
          <HStack alignItems={"center"} space={3}>
            <Progress flex={1} colorScheme="pink" shadow={0} value={after} min={0} max={5} height={3}/>
            <Text>{after}</Text>
          </HStack>
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
                      {Object.entries(stressData).map(([date, stressIndex]) => (
                        <StressComponent
                          key={date}
                          date={date}
                          before={stressIndex.before}
                          after={stressIndex.after}
                        />
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
