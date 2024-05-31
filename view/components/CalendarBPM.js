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


export const CalendarBPM = ({selectedDate}) => {
    const {userId} = useContext(UserContext)
    let now = moment();
    const [bpm, setbpm] = useState(0)
    const [bpm2, setbpm2] = useState(0)
    const [bpm3, setbpm3] = useState(0)
    const [bpm4, setbpm4] = useState(0)
    const [createAt1, setCreateAt1] = useState("");
    const [createAt2, setCreateAt2] = useState("");
    const [datesSelected, setDatesSelected] = useState(false)


// bpm 데이터 호출
    const getBPMData = async () => {
        const userRef = firestore().collection("Users").doc(userId);
        const reportRef = userRef.collection("Report");


        // 현재 날짜를 UTC+9 기준으로 변환하여 생성
        let Date = moment().format("YYYY-MM-DD");
        console.log("date:", Date)

        if (selectedDate) {
            // 선택한 날짜가 있을 경우에만 해당 날짜로 설정
            const selectedDateString = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
            Date = moment(selectedDateString, "YYYY-MM-DD").format("YYYY-MM-DD");
        }

        // 현재 날짜를 기준으로 조회
        const querySnapshot = await reportRef
            .where('createAt', '>=', moment(Date).toDate())
            .where('createAt', '<', moment(Date).add(1, 'day').toDate())
            .orderBy('createAt', 'asc')
            .limit(2)
            .get();

        try {
            if (!querySnapshot.empty) {
                const docs = querySnapshot.docs;
                const recentReport = docs[0].data();

                // 데이터가 있는 경우
                if (recentReport["1st_Report"] && recentReport["2nd_Report"]) {
                    setbpm(recentReport["1st_Report"].avgHr || 0);
                    setbpm2(recentReport["2nd_Report"].avgHr || 0);
                    setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
                } else {
                    // 데이터가 없는 경우
                    setbpm(0);
                    setbpm2(0);
                    setCreateAt1("");
                    setbpm3(0);
                    setbpm4(0);
                    setCreateAt2("");
                }

                // 데이터가 하나 이상 있는 경우
                if (docs.length > 1) {
                    const secondRecentReport = docs[1].data();
                    if (secondRecentReport["1st_Report"] && secondRecentReport["2nd_Report"]) {
                        setbpm3(secondRecentReport["1st_Report"].avgHr || 0);
                        setbpm4(secondRecentReport["2nd_Report"].avgHr || 0);
                        setCreateAt2(moment(secondRecentReport.createAt.toDate()).format("YYYY-MM-DD"));
                    } else {
                        // 두 번째 데이터가 없는 경우
                        setbpm3(0);
                        setbpm4(0);
                        setCreateAt2("");
                    }
                } else {
                    // 데이터가 하나만 있는 경우
                    setbpm3(0);
                    setbpm4(0);
                    setCreateAt2("");
                }
            } else {
                // 데이터가 없는 경우
                console.log("No reports found");
                setbpm(0);
                setbpm2(0);
                setbpm3(0);
                setbpm4(0);
                setCreateAt1("");
                setCreateAt2("");
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };


    useEffect(() => {
        getBPMData();
    }, [selectedDate]);

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
