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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const login_background = require('./images/Loginbg.png')
import SQLite from 'react-native-sqlite-storage';
import {UserContext} from "./module/UserProvider";
import TrackPlayer from "react-native-track-player";
import firestore from "@react-native-firebase/firestore";


// const db = SQLite.openDatabase(
//     {
//         name: 'RENST.db',
//         location: 'default',
//     },
//     () => {
//         console.log('Database opened successfully');
//         // Perform further operations or setup here
//     },
//     (error) => {
//         console.error('Error opening database: ', error);
//     }
// );



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

    // const handleLogin = () => {
    //     const isValid = validate()
    //     if (isValid) {
    //         const userRef = firestore().collection('Users').where('userId', '==', username);
    //         const snapshot = await userRef.get();
    //         const docId = snapshot.id
    //         console.log("snapshot:", snapshot)
    //
    //                         setUserId(docId)
    //                         console.log(userId)
    //                         navigation.navigate('TabScreens', { screen: 'Home', params:{name:user.name} });
    //                     } else {
    //                         Alert.alert('오류', '정확한 아이디 및 비밀번호를 입력해주세요.');
    //                     }
    //                 },
    //                 error => {
    //                     console.error('Error during login: ', error);
    //                     Alert.alert('오류', 'An error occurred during login');
    //                 }
    //             );
    //         });
    //     } else {
    //         Alert.alert('오류', '아이디 및 비밀번호를 입력해주세요.');
    //     }
    // };

    const handleLogin = async () => {
        const isValid = validate();
        if (isValid) {
            try {
                const userRef = firestore().collection('Users').where('userId', '==', username);
                const snapshot = await userRef.get();
                console.log("snapshot:", snapshot)

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userData = userDoc.data();
                    console.log('userDoc:', userDoc)
                    console.log("userData:", userData)

                    // 비밀번호 일치 확인
                    if (userData.password === password) {
                        const userId = userDoc.id;
                        setUserId(userId);
                        console.log("userDocId: ", userId)
                        navigation.navigate('TabScreens', { screen: 'Home', params: { name: userData.name } });
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
                            bg={"white"}
                            height={50}
                            _focus={{
                                bgColor:"coolGray",
                                borderColor:"#2785F4",
                            }}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <Input
                            placeholder="Password"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            bg={"white"}
                            type={show ? "text" : "password"}
                            height={50}
                            _focus={{
                                bgColor:"coolGray",
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
                        <Checkbox value="test" accessibilityLabel="AutoLogin" colorScheme={"info"}>
                            <Text color={"white"} fontSize={"xs"}>자동 로그인</Text>
                        </Checkbox>
                    </FormControl>
                </VStack>
                <VStack space={3}>
                    <Button block onPress={handleLogin} bgColor={"white"} height={50}>
                        <Text bold color={"#2785F4"}>로그인</Text>
                    </Button>
                    <Button block bgColor={"#3468A5"} height={50} onPress={handleRegister} style={{borderColor: "white", borderWidth: 1}}>
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
