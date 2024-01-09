import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useBLE} from './module/BLEProvider';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Link,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import {ItemComponent} from './ItemComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import SemiCircleProgress from './components/SemiCirle';
import Emotion_happy from '../view/images/emotion_happy.svg';
import {Screen} from 'react-native-screens';
import {VictoryTheme} from 'victory';
import {VictoryBar, VictoryChart, VictoryGroup} from 'victory-native';
import EmotionHappy from "./icons/EmotionHappy";
import EmotionNormal from "./icons/EmotionNormal";
import EmotionSoso from "./icons/EmotionSoso";
import EmotionTired from "./icons/EmotionTired";
import EmotionSad from "./icons/EmotionSad";
import EmotionAngry from "./icons/EmotionAngry";

/**
 * Represents the analysis result of a measurement.
 *
 * @class
 */
export const BeforeAfterResultComparison = ({route}) => {
  const Emotions = route.params;
  console.log(Emotions);
  /**
   * UseNavigation function
   *
   * This function retrieves a navigation object to navigate through an application.
   *
   * @returns {object} - The navigation object.
   */
  const navigation = useNavigation();

  /**
   * Sends data to Arduino.
   * @param {Object} data - The data to be sent to Arduino.
   * @returns {boolean} - True if the data was successfully sent to Arduino, false otherwise.
   */
  const {sendData, receivedData} = useBLE();

  /**
   * Represents the stress index of a given object.
   *
   * @typedef {number} StressIndex
   */
  const [stressIndex, setStressIndex] = useState(null);

  /**
   * Represents the SDNN variable.
   *
   * @typedef {number} SDNN
   */
  const [SDNN, setSDNN] = useState(null);

  /**
   * The HR variable represents the human resources department of a company.
   * It stores information related to employees, such as their names, job titles, and contact information.
   *
   * @typedef {Object} HR
   */
  const [HR, setHR] = useState(null);

  /**
   * Send a request to retrieve analytics data.
   *
   * @function sendGetAnalysisData
   * @returns {void}
   */
  const sendGetAnalysisData = () => {
    const message = 'GetAnalysisData';
    sendData(
      'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
      'ed890871-07e9-4967-81b1-22ce3df7728e',
      message,
    );
  };

  useEffect(() => {
    sendGetAnalysisData();
  }, []);

  useEffect(() => {
    if (receivedData === null || receivedData === '') {
      return;
    }

    console.log('AnalysisResult Received Data: ' + receivedData);

    const handleData = data => {
      const jsonObject = JSON.parse(data);

      let message = jsonObject.message;
      let stressIndex = jsonObject.StressIndex;
      let sdnn = jsonObject.SDNN;
      let hr = jsonObject.HR;

      setStressIndex(stressIndex);
      setSDNN(sdnn);
      setHR(hr);

      console.info(
        'Message: ' +
          message +
          ', Stress Index: ' +
          stressIndex +
          ', SDNN: ' +
          sdnn +
          ', HR: ' +
          hr,
      );
    };

    handleData(receivedData);
  }, [receivedData]);

  /**
   * Function to handle press event.
   * Navigates to the 'Healing' page.
   *
   * @function handlePress
   * @returns {void}
   */

  const handleSeeAllResults = () => {
    navigation.navigate('AnalysisViewScreens', {screen: 'AllRecordsList'});
  };

  const EmotionIcon = {
    emotion_happy: <EmotionHappy width={40} height={40} />,
    emotion_normal: <EmotionNormal width={40} height={40} />,
    emotion_soso: <EmotionSoso width={40} height={40} />,
    emotion_tired: <EmotionTired width={40} height={40} />,
    emotion_sad: <EmotionSad width={40} height={40} />,
    emotion_angry: <EmotionAngry width={40} height={40} />,
  };

  const EmotionName = {
    emotion_happy: '행복해요',
    emotion_normal: '보통이에요',
    emotion_soso: '그저그래요',
    emotion_tired: '피곤해요',
    emotion_sad: '슬퍼요',
    emotion_angry: '화나요',
  }


  const mockData = {
    before: [
      {category: 'BPM', value: 80},
      {category: 'SDNN', value: 20},
      {category: '스트레스 레벨', value: 4},
    ],
    after: [
      {category: 'BPM', value: 75},
      {category: 'SDNN', value: 15},
      {category: '스트레스 레벨', value: 2},
    ],
  };

  const handleConfirm = () => {
    navigation.navigate('TabScreens', {screen: 'Home'});
  };

  return (
    <ScrollView>
      <VStack space={5} h={'100%'} m={5}>
        <VStack
          space={1}
          justifyContent={'space-between'}
          p={5}
          bgColor={'white'}
          shadow={2}
          alignItems={'center'}>
          <Text bold fontSize={'md'}>
            감정 변화
          </Text>
          <HStack alignItems={'center'} space={10}>
            <VStack alignItems={'center'}>
              {EmotionIcon[Emotions.beforeEmotion]}
              <Text>{EmotionName[Emotions.beforeEmotion]}</Text>
              <Text color={'#616161'}>힐링 전</Text>
            </VStack>
            <Ionicons name={'arrow-forward'} color={'#ADAEB3'} size={20} />
            <VStack alignItems={'center'}>
              {EmotionIcon[Emotions.afterEmotion]}
              <Text>{EmotionName[Emotions.afterEmotion]}</Text>
              <Text color={'#616161'}>힐링 후</Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack
          space={1}
          justifyContent={'space-between'}
          p={5}
          bgColor={'white'}
          shadow={2}
          alignItems={'center'}>
          <VStack alignItems={'center'}>
            <Text bold fontSize={'md'}>
              측정 결과
            </Text>
            <Text color={'#ADADAD'}>힐링 전 - 힐링 후</Text>
          </VStack>
          <Box justifyContent={'center'} alignItems={'center'}>
            <VictoryChart
              width={350}
              height={220}
              theme={VictoryTheme.material}>
              <VictoryGroup offset={25} width={250} height={200}>
                <VictoryBar
                  barWidth={20}
                  style={{data: {fill: '#2785F4'}}}
                  data={mockData.before}
                  x={'category'}
                  y={'value'}
                />
                <VictoryBar
                  barWidth={20}
                  style={{data: {fill: '#FF4370'}}}
                  data={mockData.after}
                  x={'category'}
                  y={'value'}
                />
              </VictoryGroup>
            </VictoryChart>
          </Box>
          <Divider width={'90%'} mb={2} />
          <VStack width={'100%'}>
            <VStack>
              <Text fontWeight={'bold'} color={'#2785F4'}>
                힐링 전
              </Text>
              <ItemComponent hr={80} sdnn={20} stressIndex={4} />
            </VStack>
            <VStack>
              <Text fontWeight={'bold'} color={'#FF4370'}>
                힐링 후
              </Text>
              <ItemComponent hr={75} sdnn={15} stressIndex={2} />
            </VStack>
          </VStack>
        </VStack>
        <Button p={3} bgColor={'#2785F4'} onPress={handleConfirm}>
          <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
            확인
          </Text>
        </Button>
      </VStack>
    </ScrollView>
  );
};
