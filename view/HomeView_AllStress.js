import {View} from "react-native";
import {Button, Center, Heading, HStack, Progress, ScrollView, Spinner, Text, VStack} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {UserContext} from "./module/UserProvider";
import moment from "moment/moment";
import firestore from "@react-native-firebase/firestore";

/**
 * Component for displaying settings view.
 *
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} The rendered settings view.
 */


const StressComponent = ({ date, before, after }) => {
    return (
        <VStack bg={"white"} shadow={2} space={3} p={5}>
            <HStack justifyContent={"space-between"}>
                <Text>{moment(date).format("MM.DD")}</Text>
                <HStack space={5}>
                    <HStack alignItems={"center"} space={2}>
                        <Ionicons name={"ellipse"} color={"#2785F4"} />
                        <Text fontSize={'xs'}>힐링 전</Text>
                    </HStack>
                    <HStack alignItems={"center"} space={2}>
                        <Ionicons name={"ellipse"} color={"#FF4370"} />
                        <Text fontSize={'xs'}>힐링 후</Text>
                    </HStack>
                </HStack>
            </HStack>
            <HStack alignItems={"center"} space={3}>
                <Progress flex={1} shadow={0} value={before} min={0} max={1000} height={3} _filledTrack={{ bg: "#2785F4" }} />
                <Text>{before}</Text>
            </HStack>
            <HStack alignItems={"center"} space={3}>
                <Progress flex={1} shadow={0} value={after} min={0} max={1000} height={3} _filledTrack={{ bg: "#FF4370" }} />
                <Text>{after}</Text>
            </HStack>
        </VStack>
    );
};

export const HomeView_AllStress = ({ navigation }) => {
    const handleAnalysisStart = () => {
        navigation.navigate("AnalysisStart");
    };

    const { userId } = useContext(UserContext);
    const [sdnns, setSdnns] = useState([]);
    const [createAts, setCreateAts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getReportData = async () => {
        const userRef = firestore().collection("Users").doc(userId);
        const reportRef = userRef.collection("Report");

        reportRef
            .orderBy('createAt', 'desc')
            .limit(10) // Initially, set the limit to 10
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const reports = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            ...data,
                            createAt: data.createAt.toDate()
                        };
                    });

                    const newSdnns = [];
                    const newCreateAts = [];

                    reports.forEach(report => {
                        if (report["1st_Report"] && report["2nd_Report"]) {
                            newSdnns.push(parseFloat(report["1st_Report"].sdnn).toFixed(2));
                            newSdnns.push(parseFloat(report["2nd_Report"].sdnn).toFixed(2));
                            newCreateAts.push(report.createAt);
                        }
                    });

                    setSdnns(newSdnns);
                    setCreateAts(newCreateAts);
                    setIsLoading(false);

                    console.log("report fetch max 10");
                } else {
                    console.log("No reports found");
                    setIsLoading(false);
                }
            }, (error) => {
                console.error("Error fetching data from Firestore:", error);
            });
    };

    useEffect(() => {
        getReportData();
    }, []);


    const stressData = createAts.reduce((acc, date, index) => {
        const key = date.toISOString();
        if (!acc[key]) {
            acc[key] = { before: 0, after: 0 };
        }
        acc[key].before += parseFloat(sdnns[index * 2]) || 0;
        acc[key].after += parseFloat(sdnns[index * 2 + 1]) || 0;
        return acc;
    }, {});

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


    return (
        <>
            {Object.keys(stressData).length > 0 ? (
                <ScrollView>
                    <VStack p={3} space={3}>
                        {Object.entries(stressData).map(([date, stressIndex]) => (
                            <StressComponent
                                key={date}
                                date={date}
                                before={stressIndex.before}
                                after={stressIndex.after}
                            />
                        ))}
                    </VStack>
                </ScrollView>
            ) : (
                <View flex={1}>

                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (

                <VStack height={'100%'} justifyContent={"center"} alignItems={"center"} space={8}>
                    <Ionicons name="alert-circle-outline" size={120} color={"#59BCFF"} />
                    <Text textAlign={"center"} bold>
                        최근 측정한 정보가 없어요 {"\n"} 측정 후에 정보를 정리해서 보여드릴게요.
                    </Text>
                    <Button variant={'outline'} bg={"#2785F4"} pl={5} pr={5} onPress={handleAnalysisStart}>
                        <Text bold color={"white"}>측정하기</Text>
                    </Button>
                </VStack>
            )}
                </View>
            )}
        </>
    );
};
