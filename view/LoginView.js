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
import React, {useState} from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const login_background = require('./images/Login_background.png')

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const LoginView = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

    const handleLogin = () => {
        const isValid = validate()
        if (isValid) {
            navigation.navigate("TabScreens", {screen:"Home"})
            // For demonstration purposes, let's log the username and password
            console.log('Username:', username);
            console.log('Password:', password);
        } else {
            Alert.alert('Invalid Form', 'Please fill in the required fields');
        }
    };

    const handleRegister = () => {
        navigation.navigate("LoginScreens", {screen:"Register"})
    }

    return (
        <ImageBackground source={login_background} resizeMode="cover" >
        <VStack height={"100%"} bg={"rgba(3, 60, 130, 0.85)"} >
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
                                bgColor:"coolGray"
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Password"
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            bg={"white"}
                            type={show ? "text" : "password"}
                            height={50}
                            _focus={{
                                bgColor:"coolGray"
                            }}
                            InputRightElement={
                            <Pressable onPress={() => setShow(!show)}>
                                <Icon as={<Ionicons name={show ? "eye" : "eye-off"}/>} size={5} mr="2"
                                      color="muted.400"/>
                            </Pressable>}
                        />
                    </FormControl>
                    <FormControl>
                        <Checkbox value="test" accessibilityLabel="This is a dummy checkbox" colorScheme={"info"} defaultIsChecked>
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
                        <Link><Text color={"white"} fontSize={"xs"}>아이디 찾기</Text></Link>
                        <Divider thickness="1" orientation="vertical"/>
                        <Link><Text color={"white"} fontSize={"xs"}>비밀번호 찾기</Text></Link>
                    </HStack>
                </Center>
            </VStack>

        </VStack>
</ImageBackground>
    )
}
