import * as React from 'react';
import {Alert, useWindowDimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
    View,
    Text,
    VStack,
    FormControl,
    Input,
    Pressable,
    Button,
    Center,
    FlatList,
    HStack,
    Box, Icon, KeyboardAvoidingView, Heading, AlertDialog
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useState, useContext, useEffect} from "react";
import SQLite from "react-native-sqlite-storage";
import navigationContainer from "@react-navigation/native/src/NavigationContainer";
import {useNavigation} from "@react-navigation/native";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
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

const FirstRoute = () => {
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [errors, setErrors] = useState({})
    const [foundUsers, setFoundUsers] = useState([]);
    const [findPressed, setFindPressed] = useState(false)

    const validate = () => {
        let valid = true
        const errors = {}

        if (!name || name.trim() === '') {
            errors.name = 'Name is required';
            valid = false;
        }

        if (!age || isNaN(age) || age <= 0 || age >= 120) {
            errors.age = 'Please enter a valid age';
            valid = false;
        }

        setErrors(errors)
        return valid
    };

    const handleFindIDPW = () => {
        const isValid = validate()
        if (isValid) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM users WHERE name = ? AND age = ?',
                    [name, age],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            const users = [];
                            for (let i = 0; i < rows.length; i++) {
                                users.push(rows.item(i));
                            }
                            setFoundUsers(users);
                            setFindPressed(true)
                        } else {
                            Alert.alert('No User Found', 'Check the name and age again.');
                        }
                    },
                );
            });
        } else {
            Alert.alert('Invalid Form', 'Please fill in the required fields');
        }
    };

    const [selectedItem, setSelectedItem] = useState(null);
    const handleItemPress = item => {
        setSelectedItem(item.username);
    };

    const navigation = useNavigation()
    const handleLoginWithUsername = () => {
        navigation.navigate('LoginScreens', {screen:"Login", params:{username: selectedItem}})
    }

    return (
    <>
        {!findPressed &&
            <VStack flex={1} bg={"white"} p={5} justifyContent={"space-between"}>
                <VStack space={5}>
                    <FormControl isRequired>
                        <FormControl.Label _text={{bold: true, color:"black"}}>이름</FormControl.Label>
                        <Input
                            placeholder="이름을 입력해주세요."
                            onChangeText={(text) => setName(text)}
                            value={name}
                            bg={(name)? "white": "gray.100"}
                            borderColor={(name)? "#2785F4": "white"}
                            height={60}
                            _focus={{
                                bgColor: "white",
                                borderColor: "#2785F4"
                            }}
                        />

                    </FormControl>
                    <FormControl isRequired >
                        <FormControl.Label _text={{bold: true, color:"black"}}>나이</FormControl.Label>
                        <Input
                            placeholder="나이를 입력해주세요."
                            onChangeText={(text) => setAge(text)}
                            value={age}
                            bg={(age)? "white": "gray.100"}
                            borderColor={(age)? "#2785F4": "white"}
                            height={60}
                            _focus={{
                                bgColor: "white",
                                borderColor: "#2785F4",
                            }}
                        />
                        <FormControl.ErrorMessage>{errors.age}</FormControl.ErrorMessage>
                    </FormControl>
                </VStack>
                <VStack space={5}>
                    <Center>
                        <Text color={"#ADADAD"}>이름과 나이가 같은 아이디가 검색될 수 있어요.</Text>
                    </Center>
                    <Button p={5} bg={"#2785F4"} onPress={handleFindIDPW}>
                        <Text bold color={"white"}>아이디 찾기</Text>
                    </Button>
                </VStack>
            </VStack>
        }
        {findPressed && foundUsers.length > 0 && (
            <View flex={1} bg={"white"} p={5}>
                <FlatList
                    data={foundUsers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => handleItemPress(item)}>
                            <HStack space={1}
                                    m={2}
                                    p={3}
                                    justifyContent={'space-between'}
                                    bgColor={'white'}
                                    shadow={2}
                                    borderWidth={1}
                                    borderColor={selectedItem === item.username ? '#2785F4' : "white"}
                                    alignItems={'center'}>
                                <VStack>
                                    <Text bold>{item.name}</Text>
                                    <Text>{item.username}</Text>
                                    <Text>{item.age}</Text>
                                </VStack>
                                <Box display={selectedItem === item.username ? 'block':'none'}>
                                    <Ionicons name={"checkmark-circle"} color={"#2785F4"} size={25}/>
                                </Box>
                            </HStack>
                        </Pressable>
                    )}
                />
                <Button p={5} bg={"#2785F4"} isDisabled={selectedItem === null} onPress={handleLoginWithUsername}>
                    <Text bold color={"white"}>선택한 아이디로 로그인하기</Text>
                </Button>
            </View>
            )}

    </>
)
};

const SecondRoute = () => {
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [errors, setErrors] = useState({})
    const [foundUser, setFoundUser] = useState([]);
    const [findPressed, setFindPressed] = useState(false)
    const [errorsPW, setErrorsPW] = useState({})

    const validate = () => {
        let valid = true

        if (!username || username.trim() === '') {
            errors.username = 'Username is required';
            valid = false;
        }

        if (!name || name.trim() === '') {
            errors.name = 'Name is required';
            valid = false;
        }

        if (!age || isNaN(age) || age <= 0 || age >= 120) {
            errors.age = 'Please enter a valid age';
            valid = false;
        }

        setErrors(errors)
        return valid
    };

    const handleIdentityVerification = () => {
        const isValid = validate()
        if (isValid) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM users WHERE username = ? AND name = ? AND age = ?',
                    [username, name, age],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            setFoundUser(rows.item(0));
                            setFindPressed(true)
                        } else {
                            Alert.alert('본인인증 실패', '정확한 정보를 입력하세요.');
                        }
                    },
                );
            });
        } else {
            Alert.alert('Invalid Form', 'Please fill in the required fields');
        }
    };

    const navigation = useNavigation()

    const validatePW = () => {
        let validPW = true

        if (!password || password.trim() === '') {
            errorsPW.password = 'Password is required';
            validPW = false;
        }

        if (!passwordConfirm || passwordConfirm.trim() === '') {
            errorsPW.passwordConfirm = 'Password confirmation is required';
            validPW = false;
        } else if (password !== passwordConfirm) {
            errorsPW.passwordConfirm = 'Passwords do not match';
            validPW = false;
        }

        setErrors(errors)
        return validPW
    };

    const [finalAlertOpen, setFinalAlertOpen] = useState(false)

    const handleUpdateNewPW = () => {
        const isValidPW = validatePW()
        if (isValidPW) {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE users SET password = ? WHERE username = ?',
                    [password, username],
                    (_, result) => {
                        console.log('Password updated successfully');
                        setFinalAlertOpen(true)
                    },
                    error => {
                        console.error('Error updating password: ', error);
                    }
                );
            });
        } else {
            Alert.alert('Invalid Form', '\n'+ Object.values(errorsPW).join('\n'));
        }
    };

    const [show, setShow] = useState(false)
    const [showAgain, setShowAgain] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const messageRef = React.useRef(null);

    const handleLoginWithNewPW = () => {
        navigation.navigate('LoginScreens', {screen:"Login"})
    }

    return (
        <>
            {!findPressed &&
                <VStack flex={1} bg={"white"} p={5} justifyContent={"space-between"}>
                    <VStack space={5}>
                        <FormControl isRequired>
                            <FormControl.Label _text={{bold: true, color:"black"}}>아이디</FormControl.Label>
                            <Input
                                placeholder="아이디를 입력해주세요."
                                onChangeText={(text) => setUsername(text)}
                                value={username}
                                bg={(username)? "white": "gray.100"}
                                borderColor={(username)? "#2785F4": "white"}
                                height={60}
                                _focus={{
                                    bgColor: "white",
                                    borderColor: "#2785F4"
                                }}
                            />

                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label _text={{bold: true, color:"black"}}>이름</FormControl.Label>
                            <Input
                                placeholder="이름을 입력해주세요."
                                onChangeText={(text) => setName(text)}
                                value={name}
                                bg={(name)? "white": "gray.100"}
                                borderColor={(name)? "#2785F4": "white"}
                                height={60}
                                _focus={{
                                    bgColor: "white",
                                    borderColor: "#2785F4"
                                }}
                            />

                        </FormControl>
                        <FormControl isRequired >
                            <FormControl.Label _text={{bold: true, color:"black"}}>나이</FormControl.Label>
                            <Input
                                placeholder="나이를 입력해주세요."
                                onChangeText={(text) => setAge(text)}
                                value={age}
                                bg={(age)? "white": "gray.100"}
                                borderColor={(age)? "#2785F4": "white"}
                                height={60}
                                _focus={{
                                    bgColor: "white",
                                    borderColor: "#2785F4",
                                }}
                            />
                            <FormControl.ErrorMessage>{errors.age}</FormControl.ErrorMessage>
                        </FormControl>
                    </VStack>
                    <VStack space={5} marginTop={20}>
                        <Center>
                            <Text color={"#ADADAD"}>본인인증 후 비밀번호 초기화 할 수 있어요.</Text>
                        </Center>
                        <Button p={5} bg={"#2785F4"} onPress={handleIdentityVerification}>
                            <Text bold color={"white"}>본인인증 하기</Text>
                        </Button>
                    </VStack>
                </VStack>
            }
            {findPressed && (
                <View flex={1} bg={"white"} p={5} justifyContent={"space-between"}>
                    <KeyboardAvoidingView flex={1}>
                    <VStack space={5}>
                        <Text>아이디: {foundUser.username}</Text>
                        <FormControl isRequired>
                            <FormControl.Label _text={{bold: true}}>새로운 비밀번호</FormControl.Label>
                            <Input
                                placeholder="새로운 비밀번호를 입력해주세요."
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                bg={'gray.50'}
                                type={show ? 'text' : 'password'}
                                height={50}
                                _focus={{
                                    bgColor: 'gray.50',
                                    borderColor:"#2785F4",
                                }}
                                InputRightElement={
                                    <Pressable onPress={() => setShow(!show)}>
                                        <Icon
                                            as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
                                            size={5}
                                            mr="2"
                                            color="muted.400"
                                        />
                                    </Pressable>
                                }
                            />
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.passwordConfirm}>
                            <FormControl.Label _text={{bold: true}}>
                                새로운 비밀번호 확인
                            </FormControl.Label>
                            <Input
                                placeholder="새로운 비밀번호 확인"
                                value={passwordConfirm}
                                onChangeText={(text) => setPasswordConfirm(text)}
                                bg={'gray.50'}
                                type={showAgain ? 'text' : 'password'}
                                height={50}
                                _focus={{
                                    bgColor: 'gray.50',
                                    borderColor:"#2785F4",
                                }}
                                InputRightElement={
                                    <Pressable onPress={() => setShowAgain(!showAgain)}>
                                        <Icon
                                            as={<Ionicons name={showAgain ? 'eye' : 'eye-off'} />}
                                            size={5}
                                            mr="2"
                                            color="muted.400"
                                        />
                                    </Pressable>
                                }
                            />
                        </FormControl>
                    </VStack>
                    </KeyboardAvoidingView>
                    <Button p={5} bg={"#2785F4"} onPress={handleUpdateNewPW}>
                        <Text bold color={"white"}>비밀번호 재설정</Text>
                    </Button>

                    <AlertDialog leastDestructiveRef={messageRef} isOpen={finalAlertOpen}>
                        <AlertDialog.Content p={2}>
                            <VStack space={3} p={3}>
                                <Center>
                                    <Ionicons
                                        name={'checkmark-circle-outline'}
                                        size={60}
                                        color={'#59BCFF'}
                                    />
                                </Center>
                                <Center>
                                    <Text fontSize={'md'} fontWeight={'bold'}>
                                        비밀번호 재설정이 완료되었습니다.
                                    </Text>
                                </Center>
                                <Button onPress={handleLoginWithNewPW} w={'100%'} bgColor={'#2785F4'}>
                                    <Text fontWeight={'bold'} color={'white'}>
                                        확인
                                    </Text>
                                </Button>
                            </VStack>
                        </AlertDialog.Content>
                    </AlertDialog>
                </View>
            )}

        </>
    )
};

const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
});


export const ResetIDPW = ({navigation, route}) => {

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(route.params.whichroute === 'one' ? 0:1);

    const [routes] = React.useState([
        { key: 'first', title: '아이디 찾기' },
        { key: 'second', title: '비밀번호 재설정' },
    ]);


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#2785F4' }}
            style={{ backgroundColor: 'white'}}
            labelStyle={{color:"black", fontWeight:"bold"}}
        />
    );
    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}

        />
    );
}


