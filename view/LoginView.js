import {Alert, ImageBackground, View} from "react-native";
import {
    Text,
    VStack,
    Heading,
    Center,
    Button,
    Input,
    FormControl,
    Pressable,
    Icon,
    HStack, Link, Divider, Checkbox
} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
// import SQLite from 'react-native-sqlite-storage';
import {UserContext} from "./module/UserProvider";
import TrackPlayer from "react-native-track-player";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import {setConnectDevice, setConnectionStatus} from "../data/store";
import {useDispatch} from "react-redux";
import {useBLE} from "./module/BLEProvider";
import { getDBConnection, createTable, saveUserCredentials, getUserCredentials, deleteUserCredentials } from "../data/sqlitedb";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login_background = require('./images/Loginbg.png')



/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @param route
 * @returns {ReactElement} - The rendered component.
 */
export const LoginView = ({ navigation, route }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUserId} = useContext(UserContext)
    const [errors, setErrors] = useState({})

    const [show, setShow] = React.useState(false);
    const [rememberMe, setRememberMe] = useState(false);


    const validate = () => {
        let valid = true
        const errors = {}

        if (!username || username.trim() === '') {
            errors.username = 'Username is required';
            valid = false;
        }

        if (!password || password.trim() === '') {
            errors.password = 'Password is required';
            valid = false;
        }

        setErrors(errors)
        return valid
    };

    useEffect(() => {
        if (route.params && route.params.username) {
            setUsername(route.params.username);
        }
    }, [route.params]);

    useEffect(() => {
        // TrackPlayer를 초기화하는 코드
        TrackPlayer.setupPlayer()
            .catch(error => {
                console.log("Error in TrackPlayer setup:", error)
            });

        return () => {
            console.log("setupPlayer 실행")
        };
    }, []);

    const checkAutoLogin = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem('autoUsername');
            const savedPassword = await AsyncStorage.getItem('autoPassword');
            console.log("saveduserpassword:", savedUsername, savedPassword);

            if (savedUsername && savedPassword) {
                const isLoggedIn = await handleAutoLogin(savedUsername, savedPassword);
                if (isLoggedIn) {
                    setTimeout(() => {
                        navigation.navigate('TabScreens', { screen: 'Home', params: { name: savedUsername } });
                    }, 100);
                    console.log("자동 로그인 설정 유");
                } else {
                    console.log("자동 로그인 설정 무.");
                }
            } else {
                console.log("자동 로그인 설정 무.");
            }
        } catch (error) {
            console.error('Failed to load saved login info: ', error);
            console.log("checkAutoLogin error render to Login");
        }
    };

    useEffect(() => {
        checkAutoLogin()
    }, [])


    const handleAutoLogin = async (username, password) => {
        try {
            const userRef = firestore().collection('Users').where('userId', '==', username);
            const snapshot = await userRef.get();
            console.log("snapshot:", snapshot);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const userData = userDoc.data();
                console.log('userDoc:', userDoc);
                console.log("userData:", userData);

                if (userData.password === password) {
                    const userId = userDoc.id;
                    setUserId(userId);
                    console.log("userDocId:", userId);

                    const fetchData = async () => {
                        const userRef = firestore().collection("Users").doc(userId);
                        const unsubscribe = userRef.collection("Ble_Devices").onSnapshot(async snapshot => {
                            const devicesData = snapshot.docs.map(doc => doc.data());
                            console.log("Device list:", devicesData);

                            const deviceList = devicesData.map(device => ({
                                id: device.id,
                                name: device.name,
                                date: moment(device.registrationDate.toDate()),
                            }));

                            const subscribeDevice = deviceList.length > 0 ? deviceList[0] : null;
                            setDevice(subscribeDevice);

                            if (!subscribeDevice) return;

                            console.log("Device Connect", subscribeDevice.id);

                            const deviceRef = userRef.collection("Ble_Devices").where("id", "==", subscribeDevice.id);
                            const deviceSnapshot = await deviceRef.get();

                            try {
                                if (await connectAndSubscribe(subscribeDevice.id)) {
                                    deviceSnapshot.forEach(async (doc) => {
                                        const deviceData = doc.data();
                                        dispatch(setConnectDevice(subscribeDevice.id));
                                        if (deviceData.isConnected) {
                                            dispatch(setConnectionStatus(true));
                                        }
                                    });
                                }
                            } catch (e) {
                                console.log("catch error:", e);
                            }
                        });

                        return unsubscribe;
                    };

                    await fetchData();
                    // setTimeout(() => {
                    //     navigation.navigate('TabScreens', { screen: 'Home', params: { name: userData.name } });
                    // }, 500);
                    return true;
                } else {
                    Alert.alert('오류', '비밀번호를 확인해주세요.');
                    return false;
                }
            } else {
                Alert.alert('오류', '아이디를 확인해주세요.');
                return false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert('오류', 'An error occurred during login');
            return false;
        }
    };






    const [device, setDevice] = useState(null);
    const dispatch = useDispatch();
    const {isConnected, connectAndSubscribe} = useBLE();




    const handleLogin = async () => {
        const isValid = validate();
        if (isValid) {
            try {
                const userRef = firestore().collection('Users').where('userId', '==', username);
                const snapshot = await userRef.get();
                console.log("snapshot:", snapshot);

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userData = userDoc.data();
                    console.log('userDoc:', userDoc);
                    console.log("userData:", userData);

                    // 비밀번호 일치 확인
                    if (userData.password === password) {
                        const userId = userDoc.id;
                        setUserId(userId);
                        console.log("userDocId: ", userId);
                        console.log("setupPlayer 실행");

                        if (rememberMe) {
                            await AsyncStorage.setItem('autoUsername', username);
                            await AsyncStorage.setItem('autoPassword', password);
                        }

                        const fetchData = async () => {
                            const userRef = firestore().collection("Users").doc(userId);
                            const unsubscribe = userRef.collection("Ble_Devices").onSnapshot(async snapshot => {
                                const devicesData = snapshot.docs.map(doc => doc.data());
                                console.log("Device list:", devicesData);

                                const deviceList = devicesData.map(device => ({
                                    id: device.id,
                                    name: device.name,
                                    date: moment(device.registrationDate.toDate()),
                                }));

                                const subscribeDevice = deviceList.length > 0 ? deviceList[0] : null;
                                setDevice(subscribeDevice);

                                if (!subscribeDevice) return; // device가 null인 경우 처리

                                console.log("Device Connect", subscribeDevice.id);

                                const deviceRef = userRef.collection("Ble_Devices").where("id", "==", subscribeDevice.id);
                                const deviceSnapshot = await deviceRef.get();

                                try {
                                    if (await connectAndSubscribe(subscribeDevice.id)) {
                                        deviceSnapshot.forEach(async (doc) => {
                                            const deviceData = doc.data();
                                            dispatch(setConnectDevice(subscribeDevice.id));
                                            if (deviceData.isConnected) {
                                                dispatch(setConnectionStatus(true));
                                            }
                                        });
                                    }
                                } catch (e) {
                                    console.log("catch error :", e);
                                }
                            });

                            return unsubscribe; // Return unsubscribe function for cleanup
                        };

                        await fetchData();
                        setTimeout(() => {
                            navigation.navigate('TabScreens', { screen: 'Home', params: { name: userData.name } });
                        }, 500);
                    } else {
                        Alert.alert('오류', '비밀번호를 확인해주세요.');
                    }
                } else {
                    Alert.alert('오류', '아이디를 확인해주세요.');
                }
            } catch (error) {
                console.error('Error during login: ', error);
                Alert.alert('오류', 'An error occurred during login');
            }
        } else {
            Alert.alert('오류', '아이디 및 비밀번호를 입력해주세요.');
        }
    };



    const handleRegister = () => {
        navigation.navigate("LoginScreens", {screen:"회원가입"})
    }

    const handleResetID = () => {
        navigation.navigate("LoginScreens", {screen:"아이디/비밀번호 찾기", params:{whichroute: 'one'}})
    }

    const handleResetPW = () => {
        navigation.navigate("LoginScreens", {screen:"아이디/비밀번호 찾기", params:{whichroute: 'two'}})
    }



    return (
        <ImageBackground source={login_background} style={{width: '100%', height: '100%'}}>
        <VStack height={"100%"}>
            <Center height={"30%"}>
                <Heading color={"white"} fontSize={'6xl'}>RENST</Heading>
            </Center>
            <VStack p={5} space={10}>
                <VStack space={3}>
                    <FormControl isRequired>
                        <Input
                            placeholder="Username"
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            backgroundColor={"white"}
                            height={50}
                            _focus={{
                                backgroundColor:"coolGray",
                                borderColor:"#2785F4",
                            }}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <Input
                            placeholder="Password"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            backgroundColor={"white"}
                            type={show ? "text" : "password"}
                            height={50}
                            _focus={{
                                backgroundColor:"coolGray",
                                borderColor:"#2785F4",
                            }}
                            InputRightElement={
                            <Pressable onPress={() => setShow(!show)}>
                                <Icon as={<Ionicons name={show ? "eye" : "eye-off"}/>} size={5} mr="2"
                                      color="muted.400"/>
                            </Pressable>}
                        />
                    </FormControl>
                    <FormControl>
                        <Checkbox value="test" accessibilityLabel="AutoLogin" colorScheme={"info"}
                                  isChecked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>
                            <Text color={"white"} fontSize={"xs"}>자동 로그인</Text>
                        </Checkbox>
                    </FormControl>
                </VStack>
                <VStack space={3}>
                    <Button block onPress={handleLogin} backgroundColor={"white"} height={50}>
                        <Text bold color={"#2785F4"}>로그인</Text>
                    </Button>
                    <Button block backgroundColor={"#3468A5"} height={50} onPress={handleRegister} style={{borderColor: "white", borderWidth: 1}}>
                        <Text bold color={"white"}>회원가입</Text>
                    </Button>
                </VStack>
                <Center>
                    <HStack space={5}>
                        <Link onPress={handleResetID}><Text color={"white"} fontSize={"xs"}>아이디 찾기</Text></Link>
                        <Divider thickness="1" orientation="vertical"/>
                        <Link onPress={handleResetPW}><Text color={"white"} fontSize={"xs"}>비밀번호 찾기</Text></Link>
                    </HStack>
                </Center>
            </VStack>

        </VStack>
</ImageBackground>
    )
}
