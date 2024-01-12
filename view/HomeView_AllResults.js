import {View} from 'react-native';
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
  VStack,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import CalendarPicker from 'react-native-calendar-picker';
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
import Svg, {Circle} from 'react-native-svg';
import EmotionHappy from "./icons/EmotionHappy";
import EmotionNormal from "./icons/EmotionNormal";
import EmotionSoso from "./icons/EmotionSoso";
import EmotionTired from "./icons/EmotionTired";
import EmotionSad from "./icons/EmotionSad";
import EmotionAngry from "./icons/EmotionAngry";

/**
 * Component for displaying settings view.
 *
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} The rendered settings view.
 */
export const HomeView_AllResults = ({navigation}) => {
  const [finalStartDate, setFinalStartDate] = useState('');
  const [finalEndDate, setFinalEndDate] = useState('');
  const [bpmData, setBpmData] = useState(null);

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
  ];

  const mockData = {
    max: [
      {date: '12.15', bpm: 110},
      {date: '12.16', bpm: 115},
      {date: '12.17', bpm: 92},
      {date: '12.18', bpm: 84},
      {date: '12.19', bpm: 86},
    ],
    min: [
      {date: '12.15', bpm: 98},
      {date: '12.16', bpm: 105},
      {date: '12.17', bpm: 81},
      {date: '12.18', bpm: 82},
      {date: '12.19', bpm: 83},
    ],
  };

  const emotionData = {
    12.15: {
      before: 'emotion_tired',
      after: 'emotion_soso',
    },
    12.16: {
      before: 'emotion_tired',
      after: 'emotion_happy',
    },
    12.17: {
      before: 'emotion_normal',
      after: 'emotion_happy',
    },
    12.18: {
      before: 'emotion_sad',
      after: 'emotion_normal',
    },
    12.19: {
      before: 'emotion_angry',
      after: 'emotion_soso',
    },
  };

  const EmotionComponent = ({date, before, after}) => {
    const getEmotionComponent = (emotion) => {
      switch (emotion) {
        case 'emotion_happy':
          return <EmotionHappy width={46} height={40} />;
        case 'emotion_normal':
          return <EmotionNormal width={40} height={40} />;
        case 'emotion_soso':
          return <EmotionSoso width={40} height={40} />;
        case 'emotion_tired':
          return <EmotionTired width={40} height={40} />;
        case 'emotion_sad':
          return <EmotionSad width={40} height={40} />;
        case 'emotion_angry':
          return <EmotionAngry width={40} height={40} />;
        default:
          return null;
      }
    };

    return (
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text color={'#ADADAD'}>{date}</Text>
        <HStack space={10} alignItems={'center'}>
          <VStack space={1} alignItems={'center'}>
            {getEmotionComponent(before)}
            <Text color={'#2785F4'}>힐링 전</Text>
          </VStack>
          <Text color={'#ADADAD'}>-----{`>`}</Text>
          <VStack space={1} alignItems={'center'}>
            {getEmotionComponent(after)}
            <Text color={'#FF4370'}>힐링 후</Text>
          </VStack>
        </HStack>
      </HStack>
    );
  };

  const stressData = [
    {date: '2023.12.15', stressIndex: 45},
    {date: '2023.12.16', stressIndex: 50},
    {date: '2023.12.17', stressIndex: 80},
    {date: '2023.12.18', stressIndex: 75},
    {date: '2023.12.19', stressIndex: 95},
  ];

  const StressComponent = ({date, stressIndex}) => {
    return (
      <VStack space={2}>
        <Text>{date}</Text>
        <HStack
          justifyContent={'space-between'}
          space={5}
          alignItems={'center'}>
          <Progress
            flex={1}
            shadow={0}
            value={stressIndex}
            min={0}
            max={200}
            _filledTrack={{bg: "#2785F4"}}
          />
          <Text>{stressIndex}</Text>
        </HStack>
        <HStack
          justifyContent={'space-between'}
          space={5}
          alignItems={'center'}>
          <Progress
            flex={1}
            shadow={0}
            value={stressIndex}
            min={0}
            max={200}
            _filledTrack={{bg: "#FF4370"}}
          />
          <Text>{stressIndex}</Text>
        </HStack>
      </VStack>
    );
  };

  const fetchDataFromMock = (startDate, endDate) => {
    const filteredData = mockBpmData.filter(
      data => data.date >= startDate && data.date <= endDate,
    );
    setBpmData(filteredData);
    //console.log(bpmData)
  };

  useEffect(() => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0]; // Today's date in 'YYYY-MM-DD' format
    today.setDate(today.getDate() - 4); // Subtract 4 days to get 5 days ago
    const startDate = today.toISOString().split('T')[0];

    setFinalStartDate(startDate);
    setFinalEndDate(endDate);

    fetchDataFromMock(startDate, endDate);
    //console.log(startDate)
  }, []);

  return (
    <ScrollView>
      <VStack p={3} space={3}>
        <VStack space={5}>
          {bpmData && (
            <VStack bg={'white'} shadow={2}>
              <Text bold pl={3} pt={3}>
                BPM
              </Text>
              <VictoryChart
                maxDomain={{y: 120}}
                height={300}
                domainPadding={10}
                theme={VictoryTheme.material}>
                <VictoryLegend
                  x={250}
                  centerTitle
                  orientation="vertical"
                  gutter={20}
                  style={{title: {fontSize: 15}}}
                  colorScale={['#2785F4', '#FF4370']}
                  data={[{name: '힐링 전'}, {name: '힐링 후'}]}
                />
                <VictoryGroup offset={12}>
                  <VictoryBar
                    barWidth={8}
                    labels={({datum}) => datum.y}
                    style={{data: {fill: '#2785F4'}, labels: {fill: 'white'}}}
                    data={mockData.max}
                    x={'date'}
                    y={'bpm'}
                    labelComponent={<VictoryLabel dy={30} />}
                  />
                  <VictoryBar
                    barWidth={8}
                    labels={({datum}) => datum.y}
                    style={{data: {fill: '#FF4370'}, labels: {fill: 'white'}}}
                    data={mockData.min}
                    x={'date'}
                    y={'bpm'}
                    labelComponent={<VictoryLabel dy={30} />}
                  />
                </VictoryGroup>
              </VictoryChart>
            </VStack>
          )}
          <VStack bg={'white'} shadow={2} p={3}>
            <Text bold>감정</Text>

            <VStack space={3}>
              {Object.entries(emotionData).map(([date, emotions]) => (
                <EmotionComponent
                  key={date}
                  date={date}
                  before={emotions.before}
                  after={emotions.after}
                />
              ))}
            </VStack>

          </VStack>
          <VStack bg={'white'} shadow={2} p={3}>
            <HStack justifyContent={'space-between'}>
              <Text bold>스트레스</Text>
              <VStack space={2}>
                <HStack alignItems={'center'} space={2}>
                  <Ionicons name={'ellipse'} color={'#2785F4'} />
                  <Text color={'#616161'} fontSize={'xs'}>
                    힐링 전
                  </Text>
                </HStack>
                <HStack alignItems={'center'} space={2}>
                  <Ionicons name={'ellipse'} color={'#FF4370'} />
                  <Text color={'#616161'} fontSize={'xs'}>
                    힐링 후
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <VStack space={3} mt={3}>
              {stressData.map(item => (
                <StressComponent
                    key={item.date}
                  date={item.date}
                  stressIndex={item.stressIndex}
                />
              ))}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};
