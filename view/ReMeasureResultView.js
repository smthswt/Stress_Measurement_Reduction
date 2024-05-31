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
  Text,
  VStack,
} from 'native-base';
// import {ItemComponent} from './ItemComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
export const RemeasureResultView = ({route}) => {
  // const Emotions = route.params;
  // console.log(Emotions)
  const {beforeEmotion, reportDocId, afterEmotion } = route.params
  console.log(route.params)
  console.log("beforeEmotion :", beforeEmotion)
  /**
   * UseNavigation function
   *
   * This function retrieves a navigation object to navigate through an application.
   *
   * @returns {object} - The navigation object.
   */
  const navigation = useNavigation();
  const {getAvgHR, getSDNN, getStressIndex, sendMotorStartPacket} = useBLE();

  /**
   * Sends data to Arduino.
   * @param {Object} data - The data to be sent to Arduino.
   * @returns {boolean} - True if the data was successfully sent to Arduino, false otherwise.
   */
  // const {sendData, receivedData} = useBLE();

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
    // sendData(
    //   'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
    //   'ed890871-07e9-4967-81b1-22ce3df7728e',
    //   message,
    // );
  };

  useEffect(() => {
    sendGetAnalysisData();
  }, []);


  /**
   * Function to handle press event.
   * Navigates to the 'Healing' page.
   *
   * @function handlePress
   * @returns {void}
   */
  const handleBeforeAfterClick = () => {
    navigation.navigate('RemeasureResultsViewScreens', {
      screen: '힐링 모드 전 후 비교하기',
      params: {beforeEmotion: beforeEmotion, afterEmotion: afterEmotion, reportDocId: reportDocId},
    });
  };

  const EmotionIcon = {
    emotion_happy: <EmotionHappy width={40} height={40} />,
    emotion_normal: <EmotionNormal width={40} height={40} />,
    emotion_soso: <EmotionSoso width={40} height={40} />,
    emotion_tired: <EmotionTired width={40} height={40} />,
    emotion_sad: <EmotionSad width={40} height={40} />,
    emotion_angry: <EmotionAngry width={40} height={40} />,
  };

  const number = getSDNN()
  const sdnnValue = Math.trunc(number)
  console.log("sdnn value: ", sdnnValue)

  // sdnn 값에 따라 progressColor 설정
  const getProgressColor = (sdnn) => {
    if (sdnn <= 20 || sdnn >= 450) {
      return '#EB5147'; // sdnn값이 450이상 또는 20이하인 경우
    } else if (sdnn >= 80 && sdnn <= 150) {
      return '#2785F4'; // sdnn값이 80~150인 경우
    } else if (sdnn > 20 && sdnn < 80) {
      return '#FF6B18'; // sdnn값이 20초과 80미만인 경우
    } else {
      return '#616161'; // 기본값 또는 처리되지 않은 값에 대한 기본 색상
    }
  };


// progressColor를 동적으로 설정
  const progressColor = getProgressColor(number);

  return (
    <VStack space={1} h={'100%'} justifyContent={'space-between'}>
      <VStack space={3} pt={10} bg={'#67ADFF'} height={'40%'}>
        <Center>
          <Heading color={'white'}>힐링 후 측정 결과입니다.</Heading>
          <Text textAlign={'center'} color={'white'} pt={1}>
            일반 모드로 측정한 결과와 비교했을 때 {'\n'} 수치가 하락하였습니다.{' '}
          </Text>
        </Center>
        <Center pt={5}>
          <SemiCircleProgress
              // percentage={stressIndex === 0 ? 0 : stressIndex === 1 ? 6 : stressIndex === 2 ? 12 : stressIndex === 3 ? 18 : 25}
              currentValue={number}
              minValue={0}
              maxValue={450}
            progressColor={progressColor}
            progressWidth={15}
            interiorCircleColor={"#67ADFF"}
            progressShadowColor={'white'}
          >
            <Text bold fontSize={'3xl'}>
              {sdnnValue}
            </Text>
            <Text fontSize={'xs'} color={'white'}>
              Stress Index {getStressIndex()}
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
                {getAvgHR() ? getAvgHR() : "다시 시도 해보세요."}
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
                {EmotionIcon[afterEmotion]}
              </Box>
            </HStack>
          </VStack>
        </VStack>
        <Button p={3} onPress={handleBeforeAfterClick} bgColor={'#2785F4'}>
          <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
            전 후 결과 확인하기
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
};
