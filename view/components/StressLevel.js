import React, {useContext, useEffect, useState} from 'react';
import {HStack, Text, VStack} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {VictoryBar, VictoryChart, VictoryGroup} from 'victory-native';
import {VictoryTheme} from 'victory';
import {UserContext} from "../module/UserProvider";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";


export const StressLevel = () => {
  const {userId} = useContext(UserContext)
  let now = moment();
  const [stressIndex, setStressIndex] = useState(0)
  const [stressIndex2, setStressIndex2] = useState(0)
  const [stressIndex3, setStressIndex3] = useState(0)
  const [stressIndex4, setStressIndex4] = useState(0)
  const [createAt1, setCreateAt1] = useState("");
  const [createAt2, setCreateAt2] = useState("");



// stress index 데이터 호출
  const getStressIndexData = async () => {
    const userRef = firestore().collection("Users").doc(userId);
    const reportRef = userRef.collection("Report");

    // 실시간 업데이트
    reportRef
        .orderBy('createAt', 'desc')
        .limit(2)
        .onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            const docs = querySnapshot.docs;
            const recentReport = docs[0].data();

            // 데이터가 있는 경우
            if (recentReport["1st_Report"] && recentReport["2nd_Report"]) {
              setStressIndex(recentReport["1st_Report"].stressIndex || 0);
              setStressIndex2(recentReport["2nd_Report"].stressIndex || 0);
              setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
            } else {
              // 데이터가 없는 경우
              setStressIndex(0);
              setStressIndex2(0);
              setCreateAt1("");
              setStressIndex3(0);
              setStressIndex4(0);
              setCreateAt2("");
            }

            if (docs.length > 1) {
              const secondRecentReport = docs[1].data();
              if (secondRecentReport["1st_Report"] && secondRecentReport["2nd_Report"]) {
                setStressIndex3(secondRecentReport["1st_Report"].stressIndex || 0);
                setStressIndex4(secondRecentReport["2nd_Report"].stressIndex || 0);
                setCreateAt2(moment(secondRecentReport.createAt.toDate()).format("YYYY-MM-DD"));
              } else {
                // 두 번째 데이터가 없는 경우
                setStressIndex3(0);
                setStressIndex4(0);
                setCreateAt2("");
              }
            } else {
              // 데이터가 하나만 있는 경우
              setStressIndex3(0);
              setStressIndex4(0);
              setCreateAt2("");
            }
          } else {
            // 데이터가 없는 경우
            console.log("No reports found");
            setStressIndex(0);
            setStressIndex2(0);
            setStressIndex3(0);
            setStressIndex4(0);
            setCreateAt1("");
            setCreateAt2("");
          }
        }, (error) => {
          console.error("Error fetching data from Firestore:", error);
        });
  };

  useEffect(() => {
    getStressIndexData();
  }, []);


  const Data = {
    before: [
      {date: createAt1, stressLevel: stressIndex},
      {date: createAt2 + " ", stressLevel: stressIndex3},
    ],
    after: [
      {date: createAt1, stressLevel: stressIndex2},
      {date: createAt2 + " ", stressLevel: stressIndex4},
    ],
  };

  return (
    <VStack bgColor={'white'} p={3} shadow={2}>
      <HStack justifyContent={'space-between'}>
        <VStack justifyContent={'space-between'}>
          <HStack alignItems={'center'} space={1}>
            <Ionicons name={'flash'} color={'#FF6B18'} size={20} />
            <Text bold fontSize={'lg'}>
              스트레스 레벨
            </Text>
          </HStack>
          <Text fontSize={'xs'}>오늘 힘든 하루를 보내셨나요?</Text>
        </VStack>
        <VStack space={2}>
          <HStack alignItems={'center'} space={2}>
            <Ionicons name={'ellipse'} color={'#2785F4'} />
            <Text fontSize={'xs'}>힐링 전</Text>
          </HStack>
          <HStack alignItems={'center'} space={2}>
            <Ionicons name={'ellipse'} color={'#FF4370'} />
            <Text fontSize={'xs'}>힐링 후</Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack justifyContent={'center'} alignItems={'center'}>
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
        <VictoryChart
          width={350}
          height={250}
          maxDomain={{y: 5}}
          theme={VictoryTheme.material}>
          <VictoryGroup offset={35} width={250} height={200}>
            <VictoryBar
              barWidth={25}
              labels={({datum}) => `0`+datum.stressLevel}
              style={{
                data: {fill: '#2785F4'},
                labels: {fill: 'black', fontWeight: 'bold'},
              }}
              data={Data.before}
              x={'date'}
              y={'stressLevel'}
              cornerRadius={5}
            />
            <VictoryBar
              barWidth={25}
              labels={({datum}) => `0`+datum.stressLevel}
              style={{
                data: {fill: '#FF4370'},
                labels: {fill: 'black', fontWeight: 'bold'},
              }}
              data={Data.after}
              x={'date'}
              y={'stressLevel'}
              cornerRadius={5}
            />
          </VictoryGroup>
        </VictoryChart>
      </HStack>
    </VStack>
  );
};
