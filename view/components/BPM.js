import React, {useContext, useEffect, useState} from 'react';
import {Box, Divider, HStack, Text, VStack} from 'native-base';
import {BarChart, LineChart} from 'react-native-chart-kit';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLegend,
} from 'victory-native';
import {VictoryTheme} from 'victory';
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "../module/UserProvider";
import moment from "moment/moment";


export const BPM = () => {
  const {userId} = useContext(UserContext)
  let now = moment();
  const [bpm, setbpm] = useState(0)
  const [bpm2, setbpm2] = useState(0)
  const [bpm3, setbpm3] = useState(0)
  const [bpm4, setbpm4] = useState(0)
  const [createAt1, setCreateAt1] = useState("");
  const [createAt2, setCreateAt2] = useState("");



// bpm 데이터 호출
  const getBPMData = async () => {
      const userRef = firestore().collection("Users").doc(userId);
      const reportRef = userRef.collection("Report");

      // 실시간 업데이트
      reportRef
          .orderBy('createAt', 'desc')
          .limit(2)
          .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) {
              const recentReport = querySnapshot.docs[0].data();
              const secondRecentReport = querySnapshot.docs[1].data();
              console.log("Recent Report1:", recentReport["1st_Report"].avgHr);
              console.log("Recent Report2:", recentReport["2nd_Report"].avgHr);
              console.log("Recent Report3:", secondRecentReport["1st_Report"].avgHr);
              console.log("Recent Report4:", secondRecentReport["2nd_Report"].avgHr);
              setbpm(recentReport["1st_Report"].avgHr);
              setbpm2(recentReport["2nd_Report"].avgHr);
              setbpm3(secondRecentReport["1st_Report"].avgHr);
              setbpm4(secondRecentReport["2nd_Report"].avgHr);
              console.log("create at:", recentReport.createAt, secondRecentReport.createAt);
              // moment 객체로 변환하여 상태로 설정
              setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
              setCreateAt2(moment(secondRecentReport.createAt.toDate()).format("YYYY-MM-DD"));
            } else {
              console.log("No reports found");
            }
          }, (error) => {
            console.error("Error fetching data from Firestore:", error);
          });
    };

  useEffect(() => {
    getBPMData();
  }, []);

  const Data = {
    before: [
      {date: createAt1, bpm: bpm},
      {date: createAt2 + " ", bpm: bpm3},
    ],
    after: [
      {date: createAt1, bpm: bpm2},
      {date: createAt2 + " ", bpm: bpm4},
    ],
  };


  return (
    <VStack bgColor={'white'} shadow={2}>
      <HStack justifyContent={'space-between'} p={3}>
        <VStack justifyContent={'space-between'}>
          <HStack alignItems={'center'} space={1}>
            <Ionicons name={'heart'} color={'#FF4370'} size={20} />
            <Text bold fontSize={'lg'}>
              BPM
            </Text>
          </HStack>
          <Text fontSize={'xs'}>BPM 측정 전 후 비교 그래프에요.</Text>
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
          maxDomain={{y: 160}}
          theme={VictoryTheme.material}>
          <VictoryGroup offset={35} width={250} height={200}>
            <VictoryBar
              barWidth={25}
              labels={({datum}) => datum.bpm}
              style={{
                data: {fill: '#2785F4'},
                labels: {fill: 'black', fontWeight: 'bold'},
              }}
              data={Data.before}
              x={'date'}
              y={'bpm'}
              cornerRadius={5}
            />
            <VictoryBar
              barWidth={25}
              labels={({datum}) => datum.bpm}
              style={{
                data: {fill: '#FF4370'},
                labels: {fill: 'black', fontWeight: 'bold'},
              }}
              data={Data.after}
              x={'date'}
              y={'bpm'}
              cornerRadius={5}
            />
          </VictoryGroup>
        </VictoryChart>
      </HStack>
    </VStack>
  );
};
