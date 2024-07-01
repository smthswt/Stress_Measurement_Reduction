import {
  AlertDialog,
  Button,
  Center,
  Heading,
  Progress,
  Text,
  VStack,
  Image,
  Modal,
  HStack, Actionsheet, Box, useDisclose,
} from 'native-base';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useBLE} from './module/BLEProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CircleProgressAnimation} from './components/CircleProgressAnimation';
import WalkingPeopleIcon from './icons/WalkingPeopleIcon';
import EmotionHappy from "./icons/EmotionHappy";
import EmotionNormal from "./icons/EmotionNormal";
import EmotionSoso from "./icons/EmotionSoso";
import EmotionTired from "./icons/EmotionTired";
import EmotionSad from "./icons/EmotionSad";
import EmotionAngry from "./icons/EmotionAngry";
import {ImageBackground} from "react-native";
import {UserContext} from "./module/UserProvider";
import firestore from "@react-native-firebase/firestore";
import {useDispatch, useSelector} from "react-redux";
import {fetchReports} from "../data/store";
import moment from "moment";
import DeviceFirstImage from "./images/deviceConnectFirst.png";

// @ts-ignore
// @ts-ignore
/**
 * A React component that displays the Electrocardiogram Measurement view.
 *
 * @returns {JSX.Element} The Electrocardiogram Measurement view component.
 */
export const ECGMeasurementView = ({route}) => {

  /**
   * Retrieves the navigation object used for navigating within the application.
   *
   * @returns {object} The navigation object.
   */
  const navigation = useNavigation();
  /**
   * Sends data to an Arduino device.
   *
   * @param {string} data - The data to be sent to the Arduino device.
   * @throws {Error} If connection to the Arduino device fails.
   * @returns {boolean} True if the data was successfully sent, false otherwise.
   */
      // const {sendData, receivedData} = useBLE();
  const {analysisStart, analysisFinish, getRRList, getHRList, getAvgHR, getSDNN, getStressIndex} = useBLE();

  /**
   * Represents the total time in minutes.
   *
   * @type {number}
   */
      //측정 분석 시간 50초, 테스트할땐 40초
  // const totalTime = measurementTime ? measurementTime : 60 ;

  /**
   * Reference to a message element used in a React component.
   *
   * @type {React.RefObject<HTMLElement>}
   * @name messageRef
   * @description The `messageRef` is a React ref object that can be used to reference
   *              a message element in a React component. It can be used to access and
   *              manipulate the message element programmatically.
   */
  const messageRef = React.useRef(null);

  /**
   * React useRef hook provides a way to hold a mutable value within a functional component.
   * The useRef() function returns an object with a 'current' property that can be used to access and modify the value.
   * This is commonly used to persist a value between renders without causing a re-render of the component.
   *
   * @type {React.MutableRefObject<any>}
   */
  const interval = useRef();

  /**
   * Represents a duration in seconds.
   *
   * @typedef {number} seconds
   */
  // const [seconds, setSeconds] = useState(totalTime);

  /**
   * Determines if the execution of a process is currently paused.
   *
   * @type {boolean}
   * @description The value of this variable should be set to true when the process is paused, and false when it is running.
   * @example
   * // When the process is paused
   * isPaused = true;
   *
   * // When the process is running
   * isPaused = false;
   */
  const [isPaused, setIsPaused] = useState(false);

  /**
   * Determines if a certain variable is open or not.
   *
   * @param {boolean} isOpen - The variable indicating if something is open or not.
   * @returns {boolean} - Returns true if the variable is open, otherwise returns false.
   */
  const [isOpens, setIsOpens] = React.useState(false);

  /**
   * Represents whether a message is open or not.
   *
   * @type {boolean}
   */
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);

  /**
   * Function to handle summit action
   * @function handleSummit
   */

  /**
   * Starts the analysis process.
   *
   * @function startAnalysis
   * @returns {void}
   */
  const {isConnected} = useBLE();

  const startAnalysis = async () => {
    const message = 'AnalysisStart';
    console.log(message);
    await analysisStart();

  };

  /**
   * Logs a message indicating the end of analysis and sends the data to Arduino.
   *
   * @function endAnalysis
   * @returns {void}
   */

  const {userId} = useContext(UserContext) //전역관리
  const dispatch = useDispatch();

  const [name, setName] = useState(null)
  const [measurementTime, setMeasurementTime] = useState()
  const [totalTime, setTotalTime] = useState();
  const [seconds, setSeconds] = useState();
  // const [stimulationTime, setStimulationTime] = useState()
  // const [vibrate, setVibrate] = useState()

  const getUserData = async () => {
    try {
      const userRef = firestore().collection("Users");
      const docRef = await userRef.doc(userId).get();
      const userData = docRef.data()
      console.log("userData :", userData)

      const measurementTime = userData.Regular_settings?.measurementTime || 60;
      setMeasurementTime(measurementTime);
      setTotalTime(measurementTime);
      setSeconds(measurementTime);
      setName(userData.name)

    } catch (error) {
      console.error("Error fetching data from Firestore:", error)
    }
  }


  const endAnalysis = async () => {
    console.log("전역 userId:", userId)
    try {
      const message = 'AnalysisEnd';
      console.log(message);

      const userRef = firestore().collection("Users").doc(userId);
      const reportRef = userRef.collection("Report");

      await analysisFinish();

      let rrList = getRRList();
      let hrList = getHRList();

      console.log(`HR: ${hrList}, Length: ${hrList.length}`);
      console.log(`RR: ${rrList}, Length: ${rrList.length}`);

      let now = moment();
      // createReport(userId, getAvgHR(), getSDNN(), getStressIndex(), hrList, rrList, now.toDate());
      const reportDoc = await reportRef.add({
        name: name,
        createAt: now.toDate(),
        "1st_Report": {
          avgHr: getAvgHR(),
          sdnn: getSDNN(),
          stressIndex: getStressIndex(),
          hrList: hrList,
          rrList: rrList,
        }
      });

      dispatch(fetchReports());
      console.log("측정 종료. 데이터 저장.", reportDoc.id);
      setReportDocId(reportDoc.id)
      // sendData(
      //   'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
      //   'ed890871-07e9-4967-81b1-22ce3df7728e',
      //   message,
      // );
    } catch (error) {
      // 오류 발생 시 처리
      console.error("데이터 저장 중 오류 발생:", error);
      navigation.navigate("TabScreens", {screen: "Home"});
      alert("데이터 저장 중 오류 발생");
    }
  };


  /**
   * Event called when the page is activated
   */

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const fetchDataAndStartAnalysis = async () => {
      try {
        await getUserData();
        // console.log("measurement Time:", measurementTime);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataAndStartAnalysis();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (measurementTime !== undefined) {

      const delayStart = setTimeout(() => {
        startAnalysis();

        interval.current = setInterval(() => {
          setSeconds(prevState => prevState - 1);
        }, 1000);
      }, 500); // 0.5초 후에 실행

      return () => {
        clearTimeout(delayStart);
        clearInterval(interval.current);
      };
    }
  }, [measurementTime]); // Run when measurementTime is updated

  useEffect(() => {
    console.log('Time: ' + seconds);

    if (seconds === totalTime - 10) {
      setShowModal(true);
    }

    if (seconds <= 0) {
      clearInterval(interval.current);
      endAnalysis().then(() => {
        if (isEmotionSelected) {
          setIsOpens(true);
        } else {
          console.log("기분 이모티콘을 선택해주세요.");
        }
      }).catch(error => {
        console.error("endAnalysis 오류:", error);
      });
    }
  }, [seconds]);


  /**
   * Data processing received from BLE
   * Called whenever receivedData is updated.
   */
  //제거?
  // useEffect(() => {
  //   if (receivedData === null || receivedData === '') {
  //     return;
  //   }
  //
  //   console.log('Received Data: ' + receivedData);
  // }, [receivedData]);

  /**
   * This function opens the Stop Analysis message box.
   * Set the variables 'isPaused' and 'isMessageOpen' to true.
   *
   * @function onOpenAnalysisStopMessageBox
   * @returns {void}
   */
      // console.log("mess:", isMessageOpen)
  const onOpenAnalysisStopMessageBox = () => {
        setIsPaused(true);
        setIsMessageOpen(true);
        console.log("측정 중지 버튼 클릭됌.")
      };

  /**
   * Closes the analysis stop message box.
   * @function
   * @name onCloseAnalysisStopMessageBox
   * @returns {void}
   */
  const onCloseAnalysisStopMessageBox = () => {
    setIsMessageOpen(false);
  };

  /**
   * Handles the event when analysis stops.
   * This function should be called when the analysis has finished.
   * It performs some actions like closing message and navigating to the home page.
   *
   * @function handleAnalysisStop
   * @returns {void}
   */
  const handleAnalysisStop = () => {
    setIsMessageOpen(false);
    const timer = setTimeout(() => {
      navigation.navigate("TabScreens", {screen: "Home"});
      clearTimeout(timer);
    }, 500);
  };

  const handleAnalysisStopCancel = () => {
    setIsMessageOpen(false)
  }

  /**
   * Represents the progress value based on the remaining time.
   *
   * @param {number} totalTime - The total time in seconds.
   * @param {number} seconds - The seconds elapsed.
   * @returns {number} - The progress value as a percentage (0-100).
   */
  const progressValue = ((totalTime - seconds) / totalTime) * 100;

  const EmotionIcon = {
    emotion_happy: <EmotionHappy width={40} height={40}/>,
    emotion_normal: <EmotionNormal width={40} height={40}/>,
    emotion_soso: <EmotionSoso width={40} height={40}/>,
    emotion_tired: <EmotionTired width={40} height={40}/>,
    emotion_sad: <EmotionSad width={40} height={40}/>,
    emotion_angry: <EmotionAngry width={40} height={40}/>,
  };

  const emotions = [
    {name: 'emotion_happy', title: '행복해요'},
    {name: 'emotion_tired', title: '피곤해요'},
    {name: 'emotion_normal', title: ' 보통이에요'},
    {name: 'emotion_sad', title: '슬퍼요'},
    {name: 'emotion_soso', title: '그저그래요'},
    {name: 'emotion_angry', title: '화나요'},
  ];
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [reportDocId, setReportDocId] = useState();
  const handleEmotionSelect = emotionName => {
    if (selectedEmotion === emotionName) {
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion(emotionName);
    }
  };
  const renderEmotions = () => {
    const columns = emotions.reduce((acc, emotion, index) => {
      const columnIndex = Math.floor(index / 2); // Split into columns with 2 rows each
      acc[columnIndex] = acc[columnIndex] || [];
      acc[columnIndex].push(
          <VStack key={index} flex={1}>
            <Center>
              <Button
                  onPress={() => handleEmotionSelect(emotion.name)}
                  style={{
                    backgroundColor:
                        selectedEmotion === emotion.name ? '#F5F5F6' : 'transparent',
                    borderRadius: 50,
                  }}>
                {EmotionIcon[emotion.name]}
              </Button>
              <Text fontSize={'xs'}>{emotion.title}</Text>
            </Center>
          </VStack>,
      );
      return acc;
    }, []);

    return columns.map((column, index) => (
        <VStack key={index} space={5} flex={1}>
          {column}
        </VStack>
    ));
  };
  const [isEmotionSelected, setEmotionSelected] = useState(false)

  //감정 선택 확인
  const handleSubmit = () => {
    if (selectedEmotion) {
      console.log('Selected emotion:', selectedEmotion);
      setShowModal(false);
      if (seconds <= 0) {
        setIsOpens(true);
      }
      setEmotionSelected(true)
    }
  };

  //측정 완료 확인
  const handleSummit = () => {
    setIsOpens(false);
    const timer = setTimeout(() => {
      if (selectedEmotion) {
        navigation.navigate('AnalysisViewScreens', {
          screen: 'AnalysisEnd',
          params: {
            beforeEmotion: selectedEmotion,
            reportDocId: reportDocId,
          }
        });
        clearTimeout(timer);
        // 업데이트할 문서의 참조를 가져옵니다.
        const userRef = firestore().collection("Users").doc(userId);
        const reportRef = userRef.collection("Report").doc(reportDocId);

        // 기존 문서 데이터 가져오기
        reportRef.get()
            .then(doc => {
              if (doc.exists) {
                const reportData = doc.data();
                // 기존 데이터와 새로운 감정을 합쳐서 업데이트합니다.
                const updatedReportData = {
                  ...reportData,
                  "1st_Report": {
                    ...reportData["1st_Report"],
                    emotion: selectedEmotion
                  }
                };
                // 문서의 참조에서 업데이트를 수행합니다.
                doc.ref.update(updatedReportData)
                    .then(() => console.log('emotion 값이 성공적으로 업데이트되었습니다.'))
                    .catch(error => console.error('emotion 값 업데이트 중 오류 발생:', error));
              } else {
                console.log("업데이트할 문서를 찾을 수 없습니다.");
              }
            })
            .catch(error => console.error('문서 쿼리 중 오류 발생:', error));
      }
    }, 500);
  };

  const background = require('./images/measurebackground.png')


  return (
      <>
        <ImageBackground source={background} style={{height: "100%", width: "100%"}}>
          <VStack
              space={3}
              h={'100%'}
              justifyContent={'space-between'}
          >
            <Center p={5}><Heading color={'#FFFFFF'}>심전도 측정 중입니다...</Heading></Center>

            <CircleProgressAnimation seconds={totalTime}/>

            <HStack
                space={1}
                bg={'#FFFFFF'}
                m={5}
                p={5}
                shadow={2}
                justifyContent={'space-between'}>
              <Text>
                심전도 측정 시 몸을 움직이거나 말하면 {'\n'} 정확한 검사를 할 수
                없습니다.
              </Text>
              <HStack>
                <WalkingPeopleIcon width={41} height={'100%'}/>
                <Ionicons name={'close-circle'} color={'#EB5147'}/>
              </HStack>
            </HStack>
            <VStack space={1} bg={'#FFFFFF'} p={5} shadow={2} m={5} mt={0}>
              {seconds >= 0 &&
                  <Center>
                    <Text>{seconds}초 남았습니다.</Text>
                  </Center>
              }
              {seconds < 0 &&
                  <Center>
                    <Text>0초 남았습니다.</Text>
                  </Center>
              }
              <Progress value={progressValue} colorScheme={'blue'}/>
              <Button
                  onPress={onOpenAnalysisStopMessageBox}
                  bgColor={'#2785F4'}
                  mt={2}>
                <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
                  측정중지
                </Text>
              </Button>
            </VStack>
          </VStack>
        </ImageBackground>

        {/*Popup select emotion when time reaches 20s, consider using ActionSheet instead*/}
        <Modal isOpen={showModal} size="full">
          <Modal.Content
              borderTopLeftRadius={20}
              borderTopRightRadius={20}
              bg="white"
              p={4}
              style={{position: 'absolute', bottom: 0, borderRadius: 0}}>
            <Modal.Body>
              <Center mb={5}>
                <Text textAlign="center" bold fontSize="2xl">
                  현재 기분이 어떠신가요?
                </Text>
              </Center>
              <Center>
                <HStack pb={5}>{renderEmotions()}</HStack>
              </Center>
              <Button
                  bgColor={'#2785F4'}
                  onPress={() => {
                    handleSubmit();
                  }}
                  isDisabled={!selectedEmotion}
                  _disabled={{bgColor: '#a9a9a9'}}>
                {!selectedEmotion && (
                    <Text color="white">감정을 선택해주세요.</Text>
                )}
                {selectedEmotion && <Text color="white">선택완료</Text>}
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {/*측정 완료 다이얼로그*/}
        <AlertDialog leastDestructiveRef={messageRef} isOpen={isOpens}>
          <AlertDialog.Content p={'2%'}>
            <VStack space={3} p={3}>
              <Center>
                <Ionicons
                    name={'checkmark-circle-outline'}
                    size={100}
                    color={'#59BCFF'}
                />
              </Center>
              <Center>
                <Text fontSize={'xl'} fontWeight={'bold'}>
                  측정이 완료되었습니다.
                </Text>
              </Center>
              <Button onPress={handleSummit} w={'100%'} bgColor={'#2785F4'}>
                <Text fontSize={'lg'} fontWeight={'bold'} color={'white'}>
                  확인
                </Text>
              </Button>
            </VStack>
          </AlertDialog.Content>
        </AlertDialog>

        {/*측정 중지 확인 다이얼로그*/}
        <AlertDialog
            leastDestructiveRef={messageRef}
            isOpen={isMessageOpen}
            onClose={onCloseAnalysisStopMessageBox}>
          <AlertDialog.Content p={'2%'}>

            <Center>
            <VStack space={2} py={3}>
              <Text fontSize={'xl'} fontWeight={'bold'}>
                현재 측정을 중지하시겠습니까?</Text>

              <Text color={"#EB5147"}>측정 중인 정보는 기록되지 않아요.</Text>
            </VStack>
            </Center>

            <HStack width={"100%"} p={3} space={5}>
              <Button
                  flex={1}
                  borderColor={"#2785F4"}
                  variant={"outline"}
                  onPress={handleAnalysisStopCancel}
              >
                <Text color={"#2785F4"}>취소</Text>
              </Button>
              <Button
                  flex={1}
                  borderColor={"#2785F4"} backgroundColor={"#2785F4"}
                  onPress={handleAnalysisStop}>
                <Text color={"white"}>중지하기</Text>
              </Button>
            </HStack>
          </AlertDialog.Content>
        </AlertDialog>
      </>

  );
};
