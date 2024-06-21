import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
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
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "./module/UserProvider";

/**
 * Represents the analysis result of a measurement.
 *
 * @class
 */
export const AnalysisResultView = ({route}) => {
  const {beforeEmotion, reportDocId} = route.params;
  // console.log("beforeEmotion :", beforeEmotion)
  // console.log("reportDocId :", reportDocId)

  // const test = useRoute();
  // console.log("bb :", test)

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
  // const {sendData, receivedData} = useBLE();
  const {getAvgHR, getSDNN, getStressIndex, sendMotorStartPacket} = useBLE();

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

  const [stimulationTime, setStimulationTime] = useState()
  const [vibrate, setVibrate] = useState()
  const {userId} = useContext(UserContext)
  const [songNum, setSongNum] = useState()
  const [stimulationTime2, setStimulationTime2] = useState()
  const [stimulationLvl, setStimulationLvl] = useState()

  const getUserData = async () => {
    try {
      const userRef = firestore().collection("Users");
      const docRef = await userRef.doc(userId).get();
      const userData = docRef.data()
      console.log("userData :", userData)

      // setMeasurementTime(userData.Regular_settings?.measurementTime || 1)
      setStimulationTime(userData.Regular_settings?.stimulationTime || 30)
      setVibrate(userData.Regular_settings?.vibrate || 15)
      setSongNum(userData.Manual_settings?.userManualSong || 1)
      setStimulationTime2(userData.Manual_settings?.stimulationTime || 30)
      setStimulationLvl(userData.Manual_settings?.stimulationLvl || 15)

    } catch (error) {
      console.error("Error fetching data from Firestore:", error)
    }
  }

  useEffect(() => {
    getUserData()
    console.log("beforeEmotion :", beforeEmotion)
    console.log("reportDocId :", reportDocId)
    console.log("sdnn value: ", sdnnValue)
    console.log("스트레스 레벨 :", getStressIndex())

  }, []);


  /**
   * Function to handle press event.
   * Navigates to the 'Healing' page.
   *
   * @function handlePress
   * @returns {void}
   */
  const handleHealingPress = async () => {
    navigation.navigate('Healing', {beforeEmotion: beforeEmotion, stressLevel: stressLevel, reportDocId: reportDocId, stimulationTime: stimulationTime, vibrate: vibrate, });
  };

  const handleManualPress = async () => {
    navigation.navigate('Manual',{beforeEmotion: beforeEmotion, reportDocId: reportDocId, ManualSongNum: songNum, ManualTime: stimulationTime2, ManualVibrate: stimulationLvl});
  };

  const EmotionIcon = {
    emotion_happy: <EmotionHappy width={40} height={40} />,
    emotion_normal: <EmotionNormal width={40} height={40} />,
    emotion_soso: <EmotionSoso width={40} height={40} />,
    emotion_tired: <EmotionTired width={40} height={40} />,
    emotion_sad: <EmotionSad width={40} height={40} />,
    emotion_angry: <EmotionAngry width={40} height={40} />,
  };

  const stressLevel = getStressIndex()
  const number = getSDNN()
  const sdnnValue = Math.trunc(number)

  // sdnn 값에 따라 progressColor 설정
  const getProgressColor = (sdnn) => {
    if (sdnn <= 20 || sdnn >= 450) {
      return '#EB5147'; // sdnn값이 450이상 또는 20이하인 경우
    } else if (sdnn >= 80 && sdnn <= 150) {
      return '#2785F4'; // sdnn값이 80~150인 경우
    } else if (sdnn > 20 && sdnn < 450) {
      return '#FF6B18'; // sdnn값이 20초과 450미만인 경우
    } else {
      return '#2785F4'; // 기본값 또는 처리되지 않은 값에 대한 기본 색상
    }
  };



// progressColor를 동적으로 설정
  const progressColor = getProgressColor(number);


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
        {/*<ItemComponent stressIndex={getStressIndex()} sdnn={getSDNN()} hr={getAvgHR()}/>*/}

        <Center pt={5}>
          <SemiCircleProgress
              // percentage={stressIndex === 0 ? 0 : stressIndex === 1 ? 6 : stressIndex === 2 ? 12 : stressIndex === 3 ? 18 : 25}
              // percentage={sdnnValue}
              progressColor={progressColor}
            progressWidth={15}
              // initialPercentage={0}
              minValue={0}
              maxValue={450}
              currentValue={number}
         >
            <Text bold fontSize={'3xl'}>
              {sdnnValue}
            </Text>
            <Text fontSize={'xs'} color={'#ADADAD'}>
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
                {EmotionIcon[beforeEmotion]}
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
