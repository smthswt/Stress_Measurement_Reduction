import React, {useContext, useEffect, useState} from 'react';
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
  ScrollView, Spinner,
  Text,
  VStack,
    View,
} from 'native-base';
import {ItemComponent} from './ItemComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {VictoryTheme} from 'victory';
import {VictoryBar, VictoryChart, VictoryGroup} from 'victory-native';
import EmotionHappy from "./icons/EmotionHappy";
import EmotionNormal from "./icons/EmotionNormal";
import EmotionSoso from "./icons/EmotionSoso";
import EmotionTired from "./icons/EmotionTired";
import EmotionSad from "./icons/EmotionSad";
import EmotionAngry from "./icons/EmotionAngry";
import {UserContext} from "./module/UserProvider";
import {Alert} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Rnfs from "react-native-fs";
import Share from "react-native-share";
import moment from "moment";

  /**
   * Represents the analysis result of a measurement.
   *
   * @class
   */

  const BeforeAfterResultComparison = ({route}) => {
    const {beforeEmotion, reportDocId, afterEmotion } = route.params
    // console.log(route.params)
    // console.log("beforeEmotion :", beforeEmotion)
    /**
     * UseNavigation function
     *
     * This function retrieves a navigation object to navigate through an application.
     *
     * @returns {object} - The navigation object.
     */
    const navigation = useNavigation();
    const {userId} = useContext(UserContext)

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

    /**
     * Represents the SDNN variable.
     *
     * @typedef {number} SDNN
     */

    /**
     * The HR variable represents the human resources department of a company.
     * It stores information related to employees, such as their names, job titles, and contact information.
     *
     * @typedef {Object} HR
     */
    let now = moment();
    const [momentDate, setMomentDate] = useState(moment(createAt));

    const [isLoading, setIsLoading] = useState(true);
    const [createAt, setCreateAt] = useState(moment())
    const [createAt2, setCreateAt2] = useState(moment())
    const [hrList, setHrList] = useState([])
    const [hrList2, setHrList2] = useState([])
    const [rrList, setRrList] = useState([])
    const [rrList2, setRrList2] = useState([])

    //csv파일로 레포트 공유 - 이메일, 카톡 전송
    const handleSaveCSVFile = async () => {

      const before_hrList = hrList;
      const before_rrList = rrList;
      const after_hrList = hrList2;
      const after_rrList = rrList2;

      const data = before_hrList.map((hr, index) => ({
        id: index + 1,
        hr: before_hrList[index],
        rr: before_rrList[index],
        hrAfter: after_hrList[index],
        rrAfter: after_rrList[index],
      }));

      function arrayToCSV(data) {
        const headers = 'Index, HR, RR, HR After, RR After';
        const csvRowArray = data.map(row => Object.values(row).join(','));
        return [headers].concat(csvRowArray).join('\r\n');
      }

          const path = Rnfs.DocumentDirectoryPath + `/RENST_${momentDate.format('YYYYMMDDTHHmmss')}.csv`;
          console.log(path);
          Rnfs.writeFile(path, arrayToCSV(data), 'utf8')
              .then((success) => {
                console.log('Save Success');
              })
              .catch((error) => {
                console.log(error.message);
              });

          Share.open({url: 'file://' + path, type: 'text/csv'})
              .then(() => console.log('Shared!'))
              .catch(error => {

                /**
                 * react-native-share 라이브러리가 공유 작업 후에 User did not share 에러를 반환하는 경우가 종종 발생합니다.
                 * 이는 라이브러리의 알려진 문제이며, 실제로 공유 작업이 성공적으로 완료되어도 종종 발생합니다.
                 * 이 문제의 주요 원인은 공유된 앱(이 경우 Gmail)이 공유 작업이 성공적으로 완료되었음을 'react-native-share' 에 올바르게 알리지 못하는 것으로 보입니다.
                 * 이로 인해 'react-native-share' 는 공유 작업이 취소되었다고 가정하고 'User did not share' 에러를 반환합니다.
                 * 이 문제를 해결하는 한 가지 방법은 User did not share 에러를 무시하거나 특정 조건에 따라 무시하는 것이 될 수 있습니다.
                 */

                if (error.message === 'User did not share')
                  console.log('Sharing might have been successful despite the error');
                else
                  console.error(error);
              });
        };


    /**
     * Send a request to retrieve analytics data.
     *
     * @function sendGetAnalysisData
     * @returns {void}
     */
    // const sendGetAnalysisData = () => {
    //   const message = 'GetAnalysisData';
    //   // sendData(
    //   //   'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f',
    //   //   'ed890871-07e9-4967-81b1-22ce3df7728e',
    //   //   message,
    //   // );
    // };


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

        const [bpm, setBpm] = useState(0)
        const [sdnn, setSdnn] = useState(0)
        const [stressLevel, setStressLevel] = useState(0)
        const [bpm2, setBpm2] = useState(0)
        const [sdnn2, setSdnn2] = useState(0)
        const [stressLevel2, setStressLevel2] = useState(0)
    const [emotion, setEmotion] = useState("")
    const [emotion2, setEmotion2] = useState("")



    useEffect(() => {
      const fetchData = async () => {
        try {
          const userRef = firestore().collection("Users").doc(userId);
          const reportSnapshot = await userRef.collection("Report").doc(reportDocId).get();
          console.log(reportDocId)
          console.log("reportData :", reportSnapshot);
          // const secondReportSnapshot = await userRef.collection("2nd_Report").orderBy('createAt', 'desc').limit(1).get();

          if (reportSnapshot.exists) {
            const reportData = reportSnapshot.data();
            console.log("report Data :", reportData)

            setEmotion(beforeEmotion);
            setEmotion2(afterEmotion);
            setBpm(reportData["1st_Report"].avgHr);
            setBpm2(reportData["2nd_Report"].avgHr);
            setSdnn(reportData["1st_Report"].sdnn);
            setSdnn2(reportData["2nd_Report"].sdnn);
            setStressLevel(reportData["1st_Report"].stressIndex);
            setStressLevel2(reportData["2nd_Report"].stressIndex);
            setCreateAt(moment(reportData.createAt));
            setCreateAt2(moment(reportData.createAt));
            setHrList(reportData["1st_Report"].hrList);
            setHrList2(reportData["2nd_Report"].hrList);
            setRrList(reportData["1st_Report"].rrList);
            setRrList2(reportData["2nd_Report"].rrList);
          } else {
            console.log("힐링 전 또는 후 데이터가 없습니다.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

        // useEffect(() => {
        //   // console.log(Emotions);
        //   getReportData()
        // }, []);

    useEffect(() => {
      console.log("emotion :", emotion,"-", emotion2);
    }, [emotion, emotion2]);

    const finalData = {
      before: [
        {category: 'BPM', value: bpm},
        {category: 'SDNN', value: sdnn},
        {category: '스트레스 레벨', value: stressLevel},
      ],
      after: [
        {category: 'BPM', value: bpm2},
        {category: 'SDNN', value: sdnn2},
        {category: '스트레스 레벨', value: stressLevel2},
      ],
    };


    const handleConfirm = () => {
      console.log('확인, 홈으로 이동')
      navigation.navigate('TabScreens', { screen: 'Home' });
    }

    const LoadingSpinner = () => {
      return (
          <Center flex={1}>
            <Spinner color={"blue.500"} accessibilityLabel="Loading posts" size='lg'/>
            <Heading color="blue.500" fontSize="md" mt={2}> {/* mt를 사용하여 위쪽 여백 추가 */}
              Loading...
            </Heading>
          </Center>
      );
    };

    return (
      <View flex={1}>

        {isLoading ? (
            <LoadingSpinner />
        ) : (

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
                {EmotionIcon[emotion]}
                <Text>{EmotionName[emotion]}</Text>
                <Text color={'#616161'}>힐링 전</Text>
              </VStack>
              <Ionicons name={'arrow-forward'} color={'#ADAEB3'} size={20} />
              <VStack alignItems={'center'}>
                {EmotionIcon[emotion2]}
                <Text>{EmotionName[emotion2]}</Text>
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

            <ScrollView horizontal>
            <HStack justifyContent={'center'} alignItems={'center'}>
              <VictoryChart
                width={200}
                height={220}
                theme={VictoryTheme.material}>
                <VictoryGroup offset={25} width={250} height={200} >
                  <VictoryBar
                    barWidth={20}
                    style={{data: {fill: '#2785F4'}}}
                    data={[finalData.before[0]]}
                    x={'category'}
                    y={'value'}

                  />
                  <VictoryBar
                    barWidth={20}
                    style={{data: {fill: '#FF4370'}}}
                    data={[finalData.after[0]]}
                    x={'category'}
                    y={'value'}
                  />
                </VictoryGroup>
              </VictoryChart>
              <VictoryChart
                  width={200}
                  height={220}
                  theme={VictoryTheme.material}>
                <VictoryGroup offset={25} width={250} height={200}>
                  <VictoryBar
                      barWidth={20}
                      style={{data: {fill: '#2785F4'}}}
                      data={[finalData.before[1]]}
                      x={'category'}
                      y={'value'}
                  />
                  <VictoryBar
                      barWidth={20}
                      style={{data: {fill: '#FF4370'}}}
                      data={[finalData.after[1]]}
                      x={'category'}
                      y={'value'}
                  />
                </VictoryGroup>
              </VictoryChart>
              <VictoryChart
                  width={200}
                  height={220}
                  theme={VictoryTheme.material}>
                <VictoryGroup offset={25} width={250} height={200}>
                  <VictoryBar
                      barWidth={20}
                      style={{data: {fill: '#2785F4'}}}
                      data={[finalData.before[2]]}
                      x={'category'}
                      y={'value'}
                  />
                  <VictoryBar
                      barWidth={20}
                      style={{data: {fill: '#FF4370'}}}
                      data={[finalData.after[2]]}
                      x={'category'}
                      y={'value'}
                  />
                </VictoryGroup>
              </VictoryChart>
            </HStack>
            </ScrollView>

            <Divider width={'90%'} mb={2} />
            <VStack width={'100%'}>
              <VStack>
                <Text fontWeight={'bold'} color={'#2785F4'}>
                  힐링 전
                </Text>
                <ItemComponent hr={bpm} sdnn={sdnn} stressIndex={stressLevel} createAt={createAt}/>
              </VStack>
              <VStack>
                <Text fontWeight={'bold'} color={'#FF4370'}>
                  힐링 후
                </Text>
                <ItemComponent hr={bpm2} sdnn={sdnn2} stressIndex={stressLevel2} createAt={createAt2}/>
              </VStack>
            </VStack>
          </VStack>
          <Button p={3} bgColor={'#2785F4'} onPress={handleConfirm}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
              확인
            </Text>
          </Button>
          <Button p={3} onPress={handleSaveCSVFile}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>
              CSV
            </Text>
          </Button>
        </VStack>
            </ScrollView>
        )}
      </View>
    );
  };

export { BeforeAfterResultComparison };