import {View} from "react-native";
import {
    Actionsheet,
    Button,
    Center,
    HStack,
    Image,
    Modal,
    Pressable,
    Progress,
    ScrollView,
    Text,
    VStack
} from "native-base";
import React, {useEffect, useState} from "react";
import CalendarPicker from "react-native-calendar-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend} from 'victory-native';

/**
 * Component for displaying settings view.
 *
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} The rendered settings view.
 */
export const HomeView_AllResults = ({navigation}) => {

    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedEndDate, setSelectedEndDate] = useState('')
    const [finalStartDate, setFinalStartDate] = useState('')
    const [finalEndDate, setFinalEndDate] = useState('')
    const [bpmData, setBpmData] = useState(null)

    const mockBpmData = [
        {date: '2023-12-09', bpm: 80},
        {date: '2023-12-10', bpm: 85},
        {date: '2023-12-11', bpm: 78},
        {date: '2023-12-12', bpm: 79},
        {date: '2023-12-13', bpm: 90},
        {date: '2023-12-14', bpm: 88},
        {date: '2023-12-15', bpm: 110},
        {date: '2023-12-16', bpm: 115},
        {date: '2023-12-17', bpm: 92},
        {date: '2023-12-18', bpm: 84},
        {date: '2023-12-19', bpm: 86},
    ]

    const mockData = {
        max: [
            {date: '12.15', bpm: 110},
            {date: '12.16', bpm: 115},
            {date: '12.17', bpm: 92},
            {date: '12.18', bpm: 84},
            {date: '12.19', bpm: 86},
            {date: '12.20', bpm: 88},
            {date: '12.21', bpm: 85},
        ],
        min: [
            {date: '12.15', bpm: 98},
            {date: '12.16', bpm: 105},
            {date: '12.17', bpm: 81},
            {date: '12.18', bpm: 82},
            {date: '12.19', bpm: 83},
            {date: '12.20', bpm: 81},
            {date: '12.21', bpm: 75},

        ]
    }

    const emotion_happy = require('../view/images/emotion_happy.png')
    const emotion_normal = require('../view/images/emotion_normal.png')
    const emotion_soso = require('../view/images/emotion_soso.png')
    const emotion_tired = require('../view/images/emotion_tired.png')
    const emotion_sad = require('../view/images/emotion_sad.png')
    const emotion_angry = require('../view/images/emotion_angry.png')

    const emotionData = [
        { date:'12.15', name: 'emotion_happy', source: emotion_happy },
        { date:'12.16', name: 'emotion_tired', source: emotion_tired },
        { date:'12.17', name: 'emotion_normal', source: emotion_normal },
        { date:'12.18', name: 'emotion_sad', source: emotion_sad },
        { date:'12.19', name: 'emotion_soso', source: emotion_soso },
    ]

    const EmotionComponent = ({date, emotion_name, emotion_source}) => {
        return (
            <VStack alignItems={"center"} space={2}>
                <Image alt={emotion_name} source={emotion_source}></Image>
                <Text color={"#ADADAD"}>{date}</Text>
            </VStack>
        )
    }

    const stressData = [
        {date: '2023-12-15', stressIndex: 45},
        {date: '2023-12-16', stressIndex: 50},
        {date: '2023-12-17', stressIndex: 80},
        {date: '2023-12-18', stressIndex: 75},
        {date: '2023-12-19', stressIndex: 95},
    ]

    const StressComponent = ({date, stressIndex}) => {
        return (
            <VStack space={1} height={9}>
                <HStack justifyContent={"space-between"}>
                    <Text>{date}</Text>
                    <Text >{stressIndex}</Text>
                </HStack>
                <Progress flex={1} colorScheme="blue" shadow={0} value={stressIndex} min={0} max={200}/>
            </VStack>
        )
    }

    const fetchDataFromMock = (startDate, endDate) => {
        const filteredData = mockBpmData.filter(
            (data) => data.date >= startDate && data.date <= endDate
        )
        setBpmData(filteredData)
        //console.log(bpmData)
    }

    useEffect(() => {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0]; // Today's date in 'YYYY-MM-DD' format
        today.setDate(today.getDate() - 4); // Subtract 4 days to get 5 days ago
        const startDate = today.toISOString().split('T')[0];

        setFinalStartDate(startDate);
        setFinalEndDate(endDate);

        fetchDataFromMock(startDate, endDate)
            //console.log(startDate)

    }, []);

    console.log(bpmData && bpmData.map((data) => data.bpm))

    const [showCalendar, setShowCalendar] = useState(false)

    const onDateChange = (date, type) => {
        //function to handle the date change
        if (type === "END_DATE") {
            setSelectedEndDate(date);
        } else {
            setSelectedEndDate(null);
            setSelectedStartDate(date);
        }
    };

    const actionClose = () => {
        if(selectedEndDate && selectedStartDate) {
            setFinalEndDate(selectedEndDate.toISOString().split('T')[0].replace(/-/g, '/'))
            setFinalStartDate(selectedStartDate.toISOString().split('T')[0].replace(/-/g, '/'))
            fetchDataFromMock(selectedStartDate, selectedEndDate)
        }

        setShowCalendar(false)
    }

    return (
        <ScrollView>
        <VStack p={3} space={3}>
            <Pressable>
                <Button onPress={() => setShowCalendar(true)} width={'60%'} bg={"#2785F4"}>
                    <HStack alignItems={'center'} space={2}>
                        <Ionicons name={"calendar-sharp"} color={"white"} size={15}/>
                        <Text color={"white"} bold>{finalStartDate ? finalStartDate.toString().split('T')[0].replace(/-/g, '/') : ""} - {finalEndDate ? finalEndDate.toString().split('T')[0].replace(/-/g, '/') : ""}</Text>
                        <Ionicons name={"chevron-down"} color={"white"} size={15}/>
                    </HStack>
                </Button>
            </Pressable>
            <Actionsheet isOpen={showCalendar} onClose={actionClose}>
                <Actionsheet.Content>
                    <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    minDate={new Date(2023, 11, 1)}
                    maxDate={new Date(2050, 6, 3)}
                    selectedDayColor="#2785F4"
                    onDateChange={onDateChange}
                    />
                    <VStack>
                        <Text> {selectedStartDate ? selectedStartDate.toISOString().split('T')[0].replace(/-/g, '/') : ""} - {selectedEndDate ? selectedEndDate.toISOString().split('T')[0].replace(/-/g, '/') : ""}
                        </Text>
                    </VStack>
                </Actionsheet.Content>
            </Actionsheet>
            <VStack space={5}>
            {bpmData &&
            <VStack bg={"white"} shadow={2} p={3}>
                <Text bold>BPM</Text>
                <VictoryChart domainPadding={10}>
                    <VictoryLegend x={250}
                                   centerTitle
                                   orientation="horizontal"
                                   gutter={20}
                                   style={{ title: {fontSize: 15 },}}
                                   colorScale={[ "#2785F4", "#FF4370"]}
                                   data={[
                                       { name: "최고" }, { name: "최저" }
                                   ]}
                    />
                    <VictoryGroup offset={12}>
                        <VictoryBar
                            barWidth={8}
                            labels={({ datum }) => datum.y}
                            style={{ data: { fill: "#2785F4" },labels: { fill: "white" } }}
                            data={mockData.max}
                            x={"date"}
                            y={"bpm"}
                            labelComponent={<VictoryLabel dy={30}/>}
                        />
                        <VictoryBar
                            barWidth={8}
                            labels={({ datum }) => datum.y}
                            style={{ data: { fill: "#FF4370" },labels: { fill: "white" } }}
                            data={mockData.min}
                            x={"date"}
                            y={"bpm"}
                            labelComponent={<VictoryLabel dy={30}/>}
                        />
                    </VictoryGroup>
                </VictoryChart>
            </VStack>}
            <VStack bg={"white"} shadow={2} p={3}>
                <Text bold>감정</Text>
                <HStack justifyContent={"space-between"} mt={3}>
                    {emotionData.map((item) => (
                        <EmotionComponent date={item.date} emotion_name={item.name} emotion_source={item.source}></EmotionComponent>
                    ))}
                </HStack>
            </VStack>
            <VStack bg={"white"} shadow={2} p={3}>
                <Text bold>스트레스</Text>
                <VStack space={3} mt={3}>
                    {stressData.map((item) => (
                        <StressComponent date={item.date} stressIndex={item.stressIndex}></StressComponent>
                    ))}
                </VStack>
            </VStack>
            </VStack>
        </VStack>
        </ScrollView>
    )
};
