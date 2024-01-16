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
  Text,
  VStack,
} from 'native-base';
import {ItemComponent} from './ItemComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import SemiCircleProgress from './components/SemiCirle';
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
export const AnalysisResultView = ({route}) => {
  const beforeEmotion = route.params;
  console.log(beforeEmotion)
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
  const handleHealingPress = () => {
    navigation.navigate('Healing', {beforeEmotion:beforeEmotion.beforeEmotion});
  };

  const handleManualPress = () => {
    navigation.navigate('Manual',{beforeEmotion:beforeEmotion.beforeEmotion});
  };

  const EmotionIcon = {
    emotion_happy: <EmotionHappy width={40} height={40} />,
    emotion_normal: <EmotionNormal width={40} height={40} />,
    emotion_soso: <EmotionSoso width={40} height={40} />,
    emotion_tired: <EmotionTired width={40} height={40} />,
    emotion_sad: <EmotionSad width={40} height={40} />,
    emotion_angry: <EmotionAngry width={40} height={40} />,
  };

  return (
    <VStack space={1} h={'100%'} justifyContent={'space-between'}>
      <VStack space={3} pt={10} bgColor={'white'} height={'40%'}>
        <Center>
          <Heading>측정 결과입니다.</Heading>
        </Center>
        <Center>
          <Text textAlign={'center'}>
            마지막으로 검사한 결과와 비교했을 때 {'\n'} 수치가 증가하였습니다.{' '}
          </Text>
        </Center>
        {/*<ItemComponent stressIndex={stressIndex} sdnn={SDNN} hr={HR}/>*/}
        <Center pt={5}>
          <SemiCircleProgress
            percentage={80}
            progressColor={'#2785F4'}
            progressWidth={15}
         >
            <Text bold fontSize={'3xl'}>
              4
            </Text>
            <Text fontSize={'xs'} color={'#ADADAD'}>
              Stress Index
            </Text>
          </SemiCircleProgress>
        </Center>
      </VStack>
      <VStack space={1} justifyContent={'space-between'} p={5} height={'60%'}>
        <VStack space={5}>
          <VStack
            bg={'white'}
            p={4}
            height={70}
            justifyContent={'center'}
            style={{
              elevation: 2, // For Android
            }}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <HStack alignItems={'center'} space={2} flex={1}>
                <Ionicons name={'heart'} color={'#FF4370'} size={20} />
                <Text bold>BPM</Text>
              </HStack>
              <Box flex={2} justifyContent={'center'}>
                <Divider />
              </Box>
              <Text bold flex={1} textAlign={'right'}>
                98
              </Text>
            </HStack>
          </VStack>
          <VStack
            bg={'white'}
            p={4}
            height={70}
            justifyContent={'center'}
            style={{
              elevation: 2, // For Android
            }}>
            <HStack justifyContent={'space-between'}>
              <HStack alignItems={'center'} space={2} flex={1}>
                <Ionicons name={'happy'} color={'#F2B95A'} size={20} />
                <Text bold>감정</Text>
              </HStack>
              <Box flex={2} justifyContent={'center'}>
                <Divider />
              </Box>
              <Box flex={1} alignItems={'flex-end'}>
                {EmotionIcon[beforeEmotion.beforeEmotion]}
              </Box>
            </HStack>
          </VStack>
        </VStack>
        <HStack justifyContent={'space-between'} space={4}>
          <Button
            p={'5'}
            onPress={handleHealingPress}
            bgColor={'#2785F4'}
            flex={1}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
              AI 모드
            </Text>
          </Button>
          <Button
            p={'5'}
            onPress={handleManualPress}
            borderColor={'#2785F4'}
            variant={'outline'}
            flex={1}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'#2785F4'}>
              Manual 모드
            </Text>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
