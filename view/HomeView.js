import React, {useContext, useEffect, useRef, useState} from "react";
import {
    Box,
    Button,
    Center,
    HStack,
    Image,
    NativeBaseProvider,
    Pressable,
    ScrollView,
    Text,
    VStack
} from "native-base";
import {useBLE} from "./module/BLEProvider";
import {DeviceConnectState} from "./components/DeviceConnectState";
import {View, Animated, Alert} from "react-native";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeBarWave from "./icons/HomeBarWave";
import AllResultsIcon from "./icons/AllResultsIcon";
import AllStressIcon from "./icons/AllStressIcon";
import {Easing} from "react-native-reanimated";
import SQLite from "react-native-sqlite-storage";
import {UserContext} from "./module/UserProvider";
import ECGIcon from "./icons/ECGIcon";
import firestore from '@react-native-firebase/firestore';
/**
 * Represents a component that displays a message when analysis data is not found.
 *
 * @returns {ReactElement} The rendered component.
 */
const AnalysisDataNotFound = () => (
    <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
        <Center>
            <Text fontWeight={'bold'}>측정 데이터가 없습니다.</Text>
        </Center>
    </Box>
);

/**
 * HomeScreen component representing the home screen of the application.
 *
 * @param navigation - The navigation object used to navigate between screens.
 * @returns JSX element representing the home screen.
 */
const db = SQLite.openDatabase(
    {
        name: 'RENST.db',
        location: 'default',
    },
    () => {},
    error => {
        console.error('Error opening database: ', error);
    }
)

const getData = async () => {
    try {
        const testCollection = await firestore().collection('Test')
        const testDocument = await testCollection.doc("4nxV8Dmw6lkuPqI94ard").get();
        console.log("test:", testDocument.data())


        const testData = await firestore().collection('Test').doc('1').get();
        console.log(testData.data())
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
    }
};



export const HomeView = ({navigation, route}) => {
    /**
     * Represents a boolean variable indicating the connection status.
     *
     * @type {boolean}
     */
    const {isConnected} = useBLE();

    useEffect(() => {
        getData()
        console.log("getData working")
    }, []);

    /**
     * This function handles the analysis start event by navigating to the "AnalysisStart" screen.
     *
     * @function
     * @name handleAnalysisStart
     * @returns {void}
     */
    const handleAnalysisStart = () => {
        navigation.navigate("AnalysisStart", {params:{name:name}});
    };

    /**
     * Represents a component to display a message when the device is not found.
     * @function DeviceNotFound
     * @returns {JSX.Element} - The rendered component.
     */
    const DeviceNotFound = () => (
        <Button bg={'gray.400'} onPress={handleAnalysisStart} p={'5'} disabled={true}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>디바이스가 연결되어야 측정 할 수 있습니다.</Text>
        </Button>
    );

    /**
     * Represents a component for a device connected state.
     *
     * @return {Component} A component with a button for analysis start.
     */
    const DeviceConnected = () => (
        <Button onPress={handleAnalysisStart} pl={5} pr={5} bg={'white'}>
            <Text fontWeight={'bold'} color={'#2785F4'}>측정하기</Text>
        </Button>
    );

    const handleMovetoViewAllResults = () => {
        navigation.navigate("측정 결과 확인")
    }

    const handleMovetoViewAllStress = () => {
        navigation.navigate("스트레스 정보")
    }

    const AllResults = () => {
        return (
            <HStack space={2} justifyContent={"space-between"}>
                <Pressable flex={1} onPress={handleMovetoViewAllResults}>
                    {({
                          isHovered,
                          isFocused,
                          isPressed
                      }) => {
                         return <VStack alignItems={"center"} justifyContent={"center"} bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"}
                                        style={{
                                            transform: [{
                                                scale: isPressed ? 0.96 : 1
                                            }]
                                        }} shadow={2} pt={5}
                                        pb={5} >
                             <Box h={100} alignContent={"center"}>
                                 <AllResultsIcon width={118} height={"100%"}/>
                             </Box>
                             <Text bold fontSize={"lg"}>측정 결과 확인</Text>
                             <Text fontSize={'xs'} textAlign={"center"}>측정 결과를{"\n"}비교하여 확인해보세요.</Text>
                         </VStack>
                    }}
                </Pressable>
                <Pressable flex={1} onPress={handleMovetoViewAllStress}>
                    {({
                          isHovered,
                          isFocused,
                          isPressed,
                    }) => {
                        return <VStack alignItems={"center"} justifyContent={"center"} bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"}
                                       style={{
                                           transform: [{
                                               scale: isPressed ? 0.96 : 1
                                           }]
                                       }} shadow={2} pt={5}
                                       pb={5} >
                            <Box h={100} alignContent={"center"}>
                                <AllStressIcon width={118} height={"100%"}/>
                            </Box>
                            <Text bold fontSize={"lg"}>스트레스 정보</Text>
                            <Text fontSize={'xs'} textAlign={"center"}>최근 검사한 스트레스{"\n"}수치를 한눈에 볼 수 있어요.</Text>
                        </VStack>
                    }}
                </Pressable>
            </HStack>
        )
    }

    const fadeValue = useRef(new Animated.Value(0)).current;
    const scaleValue =  useRef(new Animated.Value(0.8)).current
    const fadeInOutAnimation = () => {
        Animated.parallel([
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1.2,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Animated.parallel([
                Animated.timing(fadeValue, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 0.8,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                fadeInOutAnimation(); // Repeat the animation
            });
        });
    };

    useEffect(() => {
        fadeInOutAnimation();
    }, []);

    const {userId} = useContext(UserContext)
    console.log(userId)
    const [name, setName] = useState(null)

    //FIRESTORE로 변경할때 참고할 코드 해당 userid가 1인 문서필드의 데이터 가져오기.
    // getUserInfo sqlite를 파이어베이스로 교체.
    // 특정 필드의 값이 1인 문서들을 가져오기
    // firestore().collection('your_collection_name')
    //     .where('your_field_name', '==', 1)
    //     .get()
    //     .then(querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //             // 각 문서의 데이터를 사용할 수 있습니다.
    //             console.log(doc.id, ' => ', doc.data());
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Error fetching documents: ', error);
    //     });



    const getUserInfo = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM users WHERE id = ?',
                [userId],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const user = rows.item(0);
                        setName(user.name);
                        console.log(user);
                    } else {
                        Alert.alert('Login Failed', 'Invalid username or password');
                    }
                },
            );
        });
    }

    useEffect(() => {
        getUserInfo()
    }, []);

    const ECGwidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(ECGwidth, {
                toValue: 340, // Move the icon completely off the screen to the left
                duration: 5000, // Adjust the duration as needed
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, [ECGwidth]);

    return (
        <ScrollView style={{flex: 1}}>
                <VStack space={1} h={'100%'} justifyContent={'space-between'}>
                    <DeviceConnectState/>
                    <VStack h={200} bgColor={"#2785F4"} justifyContent={'flex-start'} p={2}>
                        <HStack pl={5} pr={5} pt={2} justifyContent={'space-between'} alignItems={'flex-end'} >
                            <Box>
                                <Text color={'white'} fontSize={'lg'} bold>{name}님</Text>
                                <Text color={'white'} fontSize={'lg'}>안녕하세요</Text>
                            </Box>
                            <>
                                {isConnected ? DeviceConnected() : DeviceConnected()}
                            </>
                        </HStack>
                    </VStack>
                    <VStack p={5}>
                            <VStack space={5} p={1}>
                                <VStack bg={"white"} height={120} mt={-100} shadow={2} pt={2} pb={2}>
                                    <Box flex={2}>
                                        <Text textAlign={"center"} bold>심박수 측정이 필요합니다!</Text>
                                    </Box>
                                    <VStack justifyContent={"center"} flex={5}>
                                        <Box width={"100%"} alignItems={"center"} justifyContent={"center"} style={{position:"absolute"}}>
                                            <Animated.View
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius:50,
                                                    backgroundColor: "#D6E8FD", // Change the background color as needed
                                                    opacity: fadeValue,
                                                    transform: [{ scale: scaleValue }]
                                                }}
                                            />
                                        </Box>
                                        <Animated.View style={{ overflow:'hidden', width: ECGwidth, position:"absolute", opacity:0.2}}>
                                            <ECGIcon width={340} height={50}/>
                                        </Animated.View>

                                        <Box alignItems={"center"} justifyContent={"center"} width={"100%"}>
                                            <Ionicons name={"heart"} size={25} color={"#2785F4"}/>
                                        </Box>
                                    </VStack>
                                </VStack>
                                <BPM/>
                                <StressLevel/>
                                <AllResults/>
                            </VStack>
                    </VStack>
                </VStack>
        </ScrollView>
    );
}
