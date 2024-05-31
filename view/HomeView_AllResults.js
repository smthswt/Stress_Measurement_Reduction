import {
  Center, Heading,
  HStack,
  Progress,
  ScrollView, Spinner,
  Text,
  VStack, View
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
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
import EmotionHappy from "./icons/EmotionHappy";
import EmotionNormal from "./icons/EmotionNormal";
import EmotionSoso from "./icons/EmotionSoso";
import EmotionTired from "./icons/EmotionTired";
import EmotionSad from "./icons/EmotionSad";
import EmotionAngry from "./icons/EmotionAngry";
import {UserContext} from "./module/UserProvider";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";

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
  const {userId} = useContext(UserContext)
  let now = moment();
  const [bpm, setbpm] = useState(0)
  const [bpm2, setbpm2] = useState(0)
  const [bpm3, setbpm3] = useState(0)
  const [bpm4, setbpm4] = useState(0)
  const [bpm5, setbpm5] = useState(0)
  const [bpm6, setbpm6] = useState(0)
  const [bpm7, setbpm7] = useState(0)
  const [bpm8, setbpm8] = useState(0)
  const [bpm9, setbpm9] = useState(0)
  const [bpm10, setbpm10] = useState(0)
  const [createAt1, setCreateAt1] = useState("");
  const [createAt2, setCreateAt2] = useState("");
  const [createAt3, setCreateAt3] = useState("");
  const [createAt4, setCreateAt4] = useState("");
  const [createAt5, setCreateAt5] = useState("");
  const [emotion, setemotion] = useState("")
  const [emotion2, setemotion2] = useState("")
  const [emotion3, setemotion3] = useState("")
  const [emotion4, setemotion4] = useState("")
  const [emotion5, setemotion5] = useState("")
  const [emotion6, setemotion6] = useState("")
  const [emotion7, setemotion7] = useState("")
  const [emotion8, setemotion8] = useState("")
  const [emotion9, setemotion9] = useState("")
  const [emotion10, setemotion10] = useState("")
  const [sdnn, setsdnn] = useState(0)
  const [sdnn2, setsdnn2] = useState(0)
  const [sdnn3, setsdnn3] = useState(0)
  const [sdnn4, setsdnn4] = useState(0)
  const [sdnn5, setsdnn5] = useState(0)
  const [sdnn6, setsdnn6] = useState(0)
  const [sdnn7, setsdnn7] = useState(0)
  const [sdnn8, setsdnn8] = useState(0)
  const [sdnn9, setsdnn9] = useState(0)
  const [sdnn10, setsdnn10] = useState(0)
  const [isLoading, setIsLoading] = useState(true);

  const getReportData = async () => {
    const userRef = firestore().collection("Users").doc(userId);
    const reportRef = userRef.collection("Report");

    try {
      // Fetching the most recent 5 reports
      const querySnapshot = await reportRef
          .orderBy('createAt', 'desc')
          .limit(5)
          .get();

      if (!querySnapshot.empty) {
        const docs = querySnapshot.docs;

        // Handling the most recent report data
        const recentReport = docs[0].data();
        setbpm(recentReport["1st_Report"]?.avgHr || 0);
        setbpm2(recentReport["2nd_Report"]?.avgHr || 0);
        setemotion(recentReport["1st_Report"]?.emotion || "");
        setemotion2(recentReport["2nd_Report"]?.emotion || "");
        setsdnn(parseFloat(recentReport["1st_Report"]?.sdnn || 0).toFixed(2));
        setsdnn2(parseFloat(recentReport["2nd_Report"]?.sdnn || 0).toFixed(2));
        setCreateAt1(moment(recentReport.createAt.toDate()).format("MM.DD"));

        // Handling second most recent report data
        if (docs.length > 1) {
          const secondRecentReport = docs[1].data();
          setbpm3(secondRecentReport["1st_Report"]?.avgHr || 0);
          setbpm4(secondRecentReport["2nd_Report"]?.avgHr || 0);
          setemotion3(secondRecentReport["1st_Report"]?.emotion || "");
          setemotion4(secondRecentReport["2nd_Report"]?.emotion || "");
          setsdnn3(parseFloat(secondRecentReport["1st_Report"]?.sdnn || 0).toFixed(2));
          setsdnn4(parseFloat(secondRecentReport["2nd_Report"]?.sdnn || 0).toFixed(2));
          setCreateAt2(moment(secondRecentReport.createAt.toDate()).format("MM.DD"));
        }

        // Handling the third most recent report data
        if (docs.length > 2) {
          const thirdRecentReport = docs[2].data();
          setbpm5(thirdRecentReport["1st_Report"]?.avgHr || 0);
          setbpm6(thirdRecentReport["2nd_Report"]?.avgHr || 0);
          setemotion5(thirdRecentReport["1st_Report"]?.emotion || "");
          setemotion6(thirdRecentReport["2nd_Report"]?.emotion || "");
          setsdnn5(parseFloat(thirdRecentReport["1st_Report"]?.sdnn || 0).toFixed(2));
          setsdnn6(parseFloat(thirdRecentReport["2nd_Report"]?.sdnn || 0).toFixed(2));
          setCreateAt3(moment(thirdRecentReport.createAt.toDate()).format("MM.DD"));
        }

        // Handling the fourth most recent report data
        if (docs.length > 3) {
          const fourthRecentReport = docs[3].data();
          setbpm7(fourthRecentReport["1st_Report"]?.avgHr || 0);
          setbpm8(fourthRecentReport["2nd_Report"]?.avgHr || 0);
          setemotion7(fourthRecentReport["1st_Report"]?.emotion || "");
          setemotion8(fourthRecentReport["2nd_Report"]?.emotion || "");
          setsdnn7(parseFloat(fourthRecentReport["1st_Report"]?.sdnn || 0).toFixed(2));
          setsdnn8(parseFloat(fourthRecentReport["2nd_Report"]?.sdnn || 0).toFixed(2));
          setCreateAt4(moment(fourthRecentReport.createAt.toDate()).format("MM.DD"));
        }

        // Handling the fifth most recent report data
        if (docs.length > 4) {
          const fifthRecentReport = docs[4].data();
          setbpm9(fifthRecentReport["1st_Report"]?.avgHr || 0);
          setbpm10(fifthRecentReport["2nd_Report"]?.avgHr || 0);
          setemotion9(fifthRecentReport["1st_Report"]?.emotion || "");
          setemotion10(fifthRecentReport["2nd_Report"]?.emotion || "");
          setsdnn9(parseFloat(fifthRecentReport["1st_Report"]?.sdnn || 0).toFixed(2));
          setsdnn10(parseFloat(fifthRecentReport["2nd_Report"]?.sdnn || 0).toFixed(2));
          setCreateAt5(moment(fifthRecentReport.createAt.toDate()).format("MM.DD"));
        }


      } else {
        console.log("No reports found");
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };




  // const getReportData = async () => {
            //   const userRef = firestore().collection("Users").doc(userId);
            //   const reportRef = userRef.collection("Report");
            //
            //   // 실시간 업데이트
            //   reportRef
            //       .orderBy('createAt', 'desc')
            //       .limit(5)
            //       .onSnapshot((querySnapshot) => {
            //         if (!querySnapshot.empty) {
            //           const recentReport = querySnapshot.docs[0].data();
            //           const secondRecentReport = querySnapshot.docs[1].data();
            //           const thirdRecentReport = querySnapshot.docs[2].data();
            //           const fourthRecentReport = querySnapshot.docs[3].data();
            //           const fifthRecentReport = querySnapshot.docs[4].data();
            //           // console.log("Recent Report1:", parseFloat(recentReport["1st_Report"].sdnn).toFixed(2));
            //           console.log("Recent Report1:", recentReport["1st_Report"]);
            //           console.log("Recent Report2:", recentReport["2nd_Report"]);
            //           console.log("Recent Report3:", secondRecentReport["1st_Report"]);
            //           console.log("Recent Report4:", secondRecentReport["2nd_Report"]);
            //           console.log("Recent Report5:", thirdRecentReport["1st_Report"]);
            //           console.log("Recent Report6:", thirdRecentReport["2nd_Report"]);
            //           console.log("Recent Report7:", fourthRecentReport["1st_Report"]);
            //           console.log("Recent Report8:", fourthRecentReport["2nd_Report"]);
            //           console.log("Recent Report9:", fifthRecentReport["1st_Report"]);
            //           console.log("Recent Report10:", fifthRecentReport["2nd_Report"]);
            //
            //           //5일치 레포트 bpm 수치
            //           setbpm(recentReport["1st_Report"].avgHr);
            //           setbpm2(recentReport["2nd_Report"].avgHr);
            //           setbpm3(secondRecentReport["1st_Report"].avgHr);
            //           setbpm4(secondRecentReport["2nd_Report"].avgHr);
            //           setbpm5(thirdRecentReport["1st_Report"].avgHr);
            //           setbpm6(thirdRecentReport["2nd_Report"].avgHr);
            //           setbpm7(fourthRecentReport["1st_Report"].avgHr);
            //           setbpm8(fourthRecentReport["2nd_Report"].avgHr);
            //           setbpm9(fifthRecentReport["1st_Report"].avgHr);
            //           setbpm10(fifthRecentReport["2nd_Report"].avgHr);
            //
            //           //5일치 감정 이모지
            //           setemotion(recentReport["1st_Report"].emotion);
            //           setemotion2(recentReport["2nd_Report"].emotion);
            //           setemotion3(secondRecentReport["1st_Report"].emotion);
            //           setemotion4(secondRecentReport["2nd_Report"].emotion);
            //           setemotion5(thirdRecentReport["1st_Report"].emotion);
            //           setemotion6(thirdRecentReport["2nd_Report"].emotion);
            //           setemotion7(fourthRecentReport["1st_Report"].emotion);
            //           setemotion8(fourthRecentReport["2nd_Report"].emotion);
            //           setemotion9(fifthRecentReport["1st_Report"].emotion);
            //           setemotion10(fifthRecentReport["2nd_Report"].emotion);
            //
            //           //5일치 sdnn
            //           setsdnn(parseFloat(recentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn(parseFloat(recentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn2(parseFloat(recentReport["2nd_Report"].sdnn).toFixed(2));
            //           setsdnn3(parseFloat(secondRecentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn4(parseFloat(secondRecentReport["2nd_Report"].sdnn).toFixed(2));
            //           setsdnn5(parseFloat(thirdRecentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn6(parseFloat(thirdRecentReport["2nd_Report"].sdnn).toFixed(2));
            //           setsdnn7(parseFloat(fourthRecentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn8(parseFloat(fourthRecentReport["2nd_Report"].sdnn).toFixed(2));
            //           setsdnn9(parseFloat(fifthRecentReport["1st_Report"].sdnn).toFixed(2));
            //           setsdnn10(parseFloat(fifthRecentReport["2nd_Report"].sdnn).toFixed(2));
            //
            //
            //           console.log("create at:", recentReport.createAt, secondRecentReport.createAt);
            //           // moment 객체로 변환하여 상태로 설정
            //           setCreateAt1(moment(recentReport.createAt.toDate()).format("MM.DD"));
            //           setCreateAt2(moment(secondRecentReport.createAt.toDate()).format("MM.DD"));
            //           setCreateAt3(moment(thirdRecentReport.createAt.toDate()).format("MM.DD"));
            //           setCreateAt4(moment(fourthRecentReport.createAt.toDate()).format("MM.DD"));
            //           setCreateAt5(moment(fifthRecentReport.createAt.toDate()).format("MM.DD"));
            //
            //           setIsLoading(false);
            //         } else {
            //           console.log("No reports found");
            //         }
            //       }, (error) => {
            //         console.error("Error fetching data from Firestore:", error);
            //       });
            // };

  // const getReportData = async () => {
  //   const userRef = firestore().collection("Users").doc(userId);
  //   const reportRef = userRef.collection("Report");
  //
  //   // 실시간 업데이트
  //   reportRef
  //       .orderBy('createAt', 'desc')
  //       .limit(5)
  //       .onSnapshot((querySnapshot) => {
  //         const numReports = querySnapshot.size;
  //         querySnapshot.forEach((doc, index) => {
  //           const reportData = doc.data();
  //           const dataIndex = index + 1;
  //           if (dataIndex <= 5) {
  //             // 상태 설정
  //             setReportData(reportData, dataIndex);
  //           }
  //         });
  //         setIsLoading(false);
  //       }, (error) => {
  //         console.error("Error fetching data from Firestore:", error);
  //       });
  // };
  //
  // const setReportData = (reportData, dataIndex) => {
  //   const avgHrKey = `${dataIndex}st_Report`;
  //   const emotionKey = `${dataIndex}st_Report`;
  //
  //   // bpm 수치 설정
  //   setbpm(reportData["1st_Report"]?.avgHr || 0);
  //   setbpm2(reportData["2nd_Report"]?.avgHr || 0);
  //   setbpm3(reportData["1st_Report"]?.avgHr || 0);
  //   setbpm4(reportData["2nd_Report"]?.avgHr || 0);
  //   setbpm5(reportData["1st_Report"]?.avgHr || 0);
  //   setbpm6(reportData["2nd_Report"]?.avgHr || 0);
  //   setbpm7(reportData["1st_Report"]?.avgHr || 0);
  //   setbpm8(reportData["2nd_Report"]?.avgHr || 0);
  //   setbpm9(reportData["1st_Report"]?.avgHr || 0);
  //   setbpm10(reportData["2nd_Report"]?.avgHr || 0);
  //
  //   // 감정 이모지 설정
  //   setemotion(reportData[emotionKey]?.emotion || "");
  //   setemotion2(reportData[emotionKey]?.emotion || "");
  //   setemotion3(reportData[emotionKey]?.emotion || "");
  //   setemotion4(reportData[emotionKey]?.emotion || "");
  //   setemotion5(reportData[emotionKey]?.emotion || "");
  //   setemotion6(reportData[emotionKey]?.emotion || "");
  //   setemotion7(reportData[emotionKey]?.emotion || "");
  //   setemotion8(reportData[emotionKey]?.emotion || "");
  //   setemotion9(reportData[emotionKey]?.emotion || "");
  //   setemotion10(reportData[emotionKey]?.emotion || "");
  //
  //   // sdnn 설정
  //   setsdnn(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn2(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn3(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn4(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn5(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn6(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn7(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn8(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn9(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //   setsdnn10(parseFloat(reportData[avgHrKey]?.sdnn).toFixed(2) || 0);
  //
  //   // createAt 설정
  //   setCreateAt(dataIndex, moment(reportData.createAt.toDate()).format("MM.DD"));
  // };
  //
  // const setCreateAt = (dataIndex, value) => {
  //   switch (dataIndex) {
  //     case 1:
  //       setCreateAt1(value);
  //       break;
  //     case 2:
  //       setCreateAt2(value);
  //       break;
  //     case 3:
  //       setCreateAt3(value);
  //       break;
  //     case 4:
  //       setCreateAt4(value);
  //       break;
  //     case 5:
  //       setCreateAt5(value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    getReportData();
  }, []);

  const LoadingSpinner = () => {
    return (
        <Center flex={1} marginTop={10}>
          <Spinner color={"blue.500"} accessibilityLabel="Loading posts" size='lg'/>
          <Heading color="blue.500" fontSize="md" mt={2}> {/* mt를 사용하여 위쪽 여백 추가 */}
            Loading...
          </Heading>
        </Center>
    );
  };


  // const mockBpmData = [
  //   {date: '2023-12-09', bpm: 80},
  //   {date: '2023-12-10', bpm: 85},
  //   {date: '2023-12-11', bpm: 78},
  //   {date: '2023-12-12', bpm: 79},
  //   {date: '2023-12-13', bpm: 90},
  //   {date: '2023-12-14', bpm: 88},
  //   {date: '2023-12-15', bpm: 110},
  //   {date: '2023-12-16', bpm: 115},
  //   {date: '2023-12-17', bpm: 92},
  //   {date: '2023-12-18', bpm: 84},
  //   {date: '2023-12-19', bpm: 86},
  // ];

  //bpm 데이터 max = 1st Report Data / min = 2nd Report Data
  const Data = {
    max: [
      {date: " " + createAt1, bpm: bpm},
      {date: " " + createAt2 + " ", bpm: bpm3},
      {date: createAt3 + " ", bpm: bpm5},
      {date: createAt4, bpm: bpm7},
      {date: createAt5 + "  " , bpm: bpm9},
    ],
    min: [
      {date: " " + createAt1, bpm: bpm2},
      {date: " " + createAt2 + " ", bpm: bpm4},
      {date: createAt3 + " ", bpm: bpm6},
      {date: createAt4, bpm: bpm8},
      {date: createAt5 + "  ", bpm: bpm10},
    ],
  };

  const emotionData = {
    [createAt5 + "  "] : {
      before: emotion9,
      after: emotion10,
    },
    [createAt4 + " "] : {
      before: emotion7,
      after: emotion8,
    },
    [" " + createAt3 + " "] : {
      before: emotion5,
      after: emotion6,
    },
    [" " + createAt2] : {
      before: emotion3,
      after: emotion4,
    },
    ["  " + createAt1] : {
      before: emotion,
      after: emotion2,
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

  const stressData = {
    before: [
      { date: createAt5 + "  ", stressIndex: sdnn9 },
      { date: createAt4 + " ", stressIndex: sdnn7 },
      { date: " " + createAt3 + " ", stressIndex: sdnn5 },
      { date: " " + createAt2, stressIndex: sdnn3 },
      { date: "  " + createAt1, stressIndex: sdnn }
    ],
    after: [
      { date: createAt5 + "  ", stressIndex: sdnn10 },
      { date: createAt4 + " ", stressIndex: sdnn8 },
      { date: " " + createAt3 + " ", stressIndex: sdnn6 },
      { date: " " + createAt2, stressIndex: sdnn4 },
      { date: "  " + createAt1, stressIndex: sdnn2 }
    ]
  };

  const combinedStressData = [];

// 날짜를 기준으로 before와 after를 매핑하여 combinedStressData에 추가
  stressData.before.forEach(beforeItem => {
    const afterItem = stressData.after.find(item => item.date === beforeItem.date);
    if (afterItem) {
      combinedStressData.push({
        date: beforeItem.date,
        before: beforeItem.stressIndex,
        after: afterItem.stressIndex
      });
    }
  });


  const StressComponent = ({date, before, after}) => {
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
            value={before}
            min={0}
            max={1000}
            _filledTrack={{bg: "#2785F4"}}
          />
          <Text>{before}</Text>
        </HStack>
        <HStack
          justifyContent={'space-between'}
          space={5}
          alignItems={'center'}>
          <Progress
            flex={1}
            shadow={0}
            value={after}
            min={0}
            max={1000}
            _filledTrack={{bg: "#FF4370"}}
          />
          <Text>{after}</Text>
        </HStack>
      </VStack>
    );
  };



  return (
      <View flex={1}>

        {isLoading ? (
            <LoadingSpinner />
        ) : (

    <ScrollView>
      <VStack p={3} space={3}>
        <VStack space={5}>

            <VStack bg={'white'} shadow={2}>
              <Text bold pl={3} pt={3}>
                BPM
              </Text>
              <VictoryChart
                maxDomain={{y: 160}}
                height={300}
                domainPadding={10}
                theme={VictoryTheme.material}>
                <VictoryLegend
                  x={280}
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
                    data={Data.max}
                    x={'date'}
                    y={'bpm'}
                    labelComponent={<VictoryLabel dy={30} />}
                  />
                  <VictoryBar
                    barWidth={8}
                    labels={({datum}) => datum.y}
                    style={{data: {fill: '#FF4370'}, labels: {fill: 'white'}}}
                    data={Data.min}
                    x={'date'}
                    y={'bpm'}
                    labelComponent={<VictoryLabel dy={30} />}
                  />
                </VictoryGroup>
              </VictoryChart>
            </VStack>

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
              {/* combinedStressData를 매핑하여 StressComponent 렌더링 */}
              {combinedStressData.map((item, index) => (
                  <StressComponent
                      key={index}
                      date={item.date}
                      before={item.before}
                      after={item.after}
                  />
              ))}
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
        )}
          </View>
  );
};
