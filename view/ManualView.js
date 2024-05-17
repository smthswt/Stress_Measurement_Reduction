import {
  Actionsheet,
  AlertDialog,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Progress,
  Text,
  useDisclose,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useBLE} from './module/BLEProvider';
import {CircleProgressAnimation} from './components/CircleProgressAnimation';
import {MusicCircleProgressAnimation} from './components/MusicCircleProgressAnimation';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import deviceImage from './images/Renst_ISO.png';
import healingbackground from "./images/healingbackground.png";
import {Alert, ImageBackground} from "react-native";
import {UserContext} from "./module/UserProvider";
import SQLite from "react-native-sqlite-storage";
import firestore from "@react-native-firebase/firestore";
import TrackPlayer from "react-native-track-player";

/**
 * The HealingView component represents the view for a massage healing process.
 *
 * The component provides functionality for sending commands to an Arduino device,
 * displaying a countdown timer, and handling the stoppage of the healing process.
 *
 * @component
 * @example
 * // Example usage of HealingView component
 * const App = () => {
 *     return (
 *         <HealingView />
 *     );
 * }
 *
 * @returns {JSX.Element} The HealingView component.
 */

export const ManualView = ({route}) => {
  /**
   * Retrieves the navigation object used for navigating within the application.
   *
   * @returns {object} The navigation object.
   */
  const navigation = useNavigation();
  const {beforeEmotion, reportDocId } = route.params
  // const beforeEmotion = route.params.beforeEmotion;
  // console.log(route.params)
  // console.log("beforeEmotion :", beforeEmotion)

  /**
   * Sends data.
   *
   * @param {String} data - The data to be sent to Arduino.
   * @returns {boolean} Returns true if sending data to Arduino is successful,
   *                    otherwise returns false.
   *
   * @throws {TypeError} If the data parameter is not a string.
   *
   * @example
   * sendData('Hello Arduino');
   */
  const {sendMotorStartPacket, sendMotorStopPacket} = useBLE();

  /**
   * Represents the total time in seconds.
   *
   * @type {number}
   */
  const totalTime = 30;

  /**
   * A React useRef hook for storing a reference to the cancel function.
   *
   * @type {React.RefObject<null>}
   */
  const cancelRef = React.useRef(null);

  /**
   * A React useRef hook that stores a reference to a message element.
   *
   * @type {React.MutableRefObject<HTMLElement|null>}
   */
  const messageRef = React.useRef(null);

  const [seconds, setSeconds] = useState(totalTime);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [songTitle, setSongTitle] = useState("")

  // useEffect(() => {
  //   sendHealingStart();
  // }, [sendHealingStart]);

  // const MusicFilePath = require('android/app/src/main/res/morning-garden-acoustic-chill-15013.mp3');

  const musicPlay = async () => {
    const userRef = firestore().collection("Users").doc(userId);
    const selectedMusicRef = userRef.collection("Manual_Music");
    const musicSnapshot = await selectedMusicRef.where("itemId", '==', 1).get();

    const promises = musicSnapshot.docs.map(async doc => {
      // 문서의 데이터를 콘솔에 출력
      console.log("data :", doc.data());

      const song = doc.data().song;
      setSongTitle(song)
      const uri = doc.data().copyfilePath;
      console.log("Song :", song);
      console.log("Uri :", uri);

      console.log("음원 재생 시작");
      await TrackPlayer.reset();
      await TrackPlayer.add({
        title: song,
        url: uri,
      });
      await TrackPlayer.play();
      console.log("Music playing...");
    })
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendHealingStart = async () => {
    const message = 'HealingStart';
    console.log(message);
    startAnimation();
    await musicPlay();
    await sendMotorStartPacket(1, 20);

    // sendData(
    //   'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
    //   'ed890871-07e9-4967-81b1-22ce3df7728e',
    //   message,
    // );
  };

  const sendHealingStop = async () => {
    const message = 'HealingStop';
    console.log(message)
    await TrackPlayer.pause();
    await sendMotorStopPacket();
    // sendData(
    //   'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
    //   'ed890871-07e9-4967-81b1-22ce3df7728e',
    //   message,
    // );
  };

  const [isRemeasureOpen, setIsRemeasureOpen] = useState(false);

  const onOpenHealingStopMessageBox = () => {
    setIsMessageOpen(true);
  };

  const onCloseHealingStopMessageBox = () => {
    setIsMessageOpen(false);
  };

  const handleHealingStop = async () => {
    await sendHealingStop();
    setIsMessageOpen(false);
    setIsCounting(false)
    const timer = setTimeout(() => {
      navigation.navigate('TabScreens', {screen: 'Home'});
      clearTimeout(timer);

      // setIsRemeasureOpen(true);
    }, 500);
  };

  const startAnimationRef = useRef(null);

  const [healingStart, setHealingStart] = useState(false);

  const startAnimation = () => {
    if (startAnimationRef.current) {
      startAnimationRef.current();
    }
    setHealingStart(true);
    setIsCounting(true);
  };

  const animationDuration = 30; // Duration in seconds (same as MusicCircleProgressAnimation)
  const [isCounting, setIsCounting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(animationDuration);

  useEffect(() => {
    let intervalId;

    if (isCounting && secondsLeft > 0) {
      intervalId = setInterval(() => {
        setSecondsLeft(prevSeconds => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    }

    if (secondsLeft <= 0) {
      setIsCounting(false)
      setIsRemeasureOpen(true);
    }

    return () => clearInterval(intervalId);
  }, [isCounting, secondsLeft]);

  const progressValue =
    ((animationDuration - secondsLeft) / animationDuration) * 100; // Calculate progress percentage

  const deviceImage = require('./images/Renst_ISO.png');

  const MovetoRemeasure = async () => {
    await TrackPlayer.pause();
    await sendMotorStopPacket();

    setIsRemeasureOpen(false)
    const timer = setTimeout(() => {
      //2차 재측정으로 이동
      navigation.navigate('RemeasureStart', {beforeEmotion: beforeEmotion, reportDocId: reportDocId});
      clearTimeout(timer);
    },);
  };

  const healingbackground = require("./images/healingbackground.png")

  const {userId} = useContext(UserContext)
  const [name, setName] = useState(null)

  const getUserData = async () => {
    try {
      const userRef = firestore().collection("Users");
      const docRef = await userRef.doc(userId).get();
      const userData = docRef.data()
      console.log("userData :", userData)

      setName(userData.name)

    } catch (error) {
      console.error("Error fetching data from Firestore:", error)
    }
  }


  useEffect(() => {
    getUserData()
  }, []);



  return (
    <>
      <ImageBackground source={healingbackground} style={{height:'100%', width:'100%'}}>
      <VStack p={5} h={'100%'} justifyContent={'space-between'}>
        <Center height={'10%'}>
          <Heading color={'white'}>Manual 모드</Heading>
          <Text color={'white'}>힘든 하루를 보낸 {name}님을 위한 모드에요.</Text>
        </Center>
        <VStack space={3} height={'75%'} justifyContent={'flex-end'} >
          <VStack bg={'white'} shadow={2} height={"80%"}>
            <MusicCircleProgressAnimation
              startAnimationRef={startAnimationRef}
            />
            <HStack
              justifyContent={'space-between'}
              alignItems={'center'}
              p={5}>
              <HStack alignItems={'center'} space={2}>
                <Ionicons name={'musical-notes'} color={'#2785F4'} />
                <Text>음원</Text>
              </HStack>
              <Text>{songTitle}</Text>
            </HStack>
            <VStack space={1}>
              {healingStart && (
                <Center>
                  <Text>{secondsLeft}초 남았습니다</Text>
                </Center>
              )}
              <Progress
                colorScheme={'blue'}
                mb={5}
                ml={5}
                mr={5}
                value={progressValue}
              />
            </VStack>
          </VStack>
          {!healingStart && (
            <Button p={'5'} onPress={sendHealingStart} bgColor={'#2785F4'}>
              <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
                Manual 모드 시작
              </Text>
            </Button>
          )}
          {healingStart && (
            <Button
              p={'5'}
              onPress={onOpenHealingStopMessageBox}
              bgColor={'#2785F4'}>
              <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
                Manual 모드 중지
              </Text>
            </Button>
          )}
        </VStack>
      </VStack>
      <AlertDialog
        leastDestructiveRef={messageRef}
        isOpen={isMessageOpen}
        onClose={onCloseHealingStopMessageBox}>
        <AlertDialog.Content p={'2%'}>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            Manual 모드를 중지하시겠습니까?
          </AlertDialog.Header>
          <Center mt={3} mb={3}>
            <HStack space={3}>
              <Button
                flex={1}
                colorScheme="danger"
                variant={'outline'}
                onPress={() => setIsMessageOpen(false)}>
                취소
              </Button>
              <Button flex={1} colorScheme="danger" onPress={handleHealingStop}>
                확인
              </Button>
            </HStack>
          </Center>
        </AlertDialog.Content>
      </AlertDialog>
      <Actionsheet
        isOpen={isRemeasureOpen}
        onClose={() => {
          setIsRemeasureOpen(false);
        }}>
        <Actionsheet.Content>
          <Box w="100%" p={4} justifyContent="center">
            <Center>
              <Heading>다시 측정하기</Heading>
              <Text>측정 후 Manual 모드를 이용한 재측정이 필요해요!</Text>
              <Image source={deviceImage} alt={'deviceImage'} />
              <Button width={'100%'} p={'5'} bgColor={'#2785F4'} onPress={MovetoRemeasure}>
                <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
                  힐링 후 측정하기
                </Text>
              </Button>
            </Center>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
      </ImageBackground>
    </>
  );
};
