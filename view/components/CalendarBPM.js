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


export const CalendarBPM = ({date, bpmm, bpmm2, dateSelected}) => {
    const {userId} = useContext(UserContext)
    let now = moment();
    const [bpm, setbpm] = useState(0)
    const [bpm2, setbpm2] = useState(0)
    const [createAt1, setCreateAt1] = useState("");
    const [datesSelected, setDatesSelected] = useState(false)


// bpm 데이터 호출
    const getBPMData = async () => {
        const userRef = firestore().collection("Users").doc(userId);
        const reportRef = userRef.collection("Report");

        // 실시간 업데이트
        reportRef
            .orderBy('createAt', 'desc')
            .limit(1)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const recentReport = querySnapshot.docs[0].data();
                    console.log("Recent Report1:", recentReport["1st_Report"].avgHr);
                    console.log("Recent Report2:", recentReport["2nd_Report"].avgHr);
                    setbpm(recentReport["1st_Report"].avgHr);
                    setbpm2(recentReport["2nd_Report"].avgHr);

                    console.log("create at:", recentReport.createAt);
                    // moment 객체로 변환하여 상태로 설정
                    setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
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
        ],
        after: [
            {date: createAt1, bpm: bpm2},
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
