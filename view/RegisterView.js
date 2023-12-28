import {View} from "react-native";
import {Button, Checkbox, FormControl, Heading, Icon, Input, Pressable, Radio, Text, VStack} from "native-base";
import React, {useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Alert } from 'react-native';

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

export const RegisterView = ({ navigation }) => {

    const [formData, setData] = useState({})
    const [errors, setErrors] = useState({})
    const [show, setShow] = useState(false)
    const [showAgain, setShowAgain] = useState(false)
    const [gender, setGender] = useState("male");

    const validate = () => {
        let valid = true
        const errors = {}

        if (!formData.username || formData.username.trim() === '') {
            errors.username = 'Username is required';
            valid = false;
        }

        if (!formData.password || formData.password.trim() === '') {
            errors.password = 'Password is required';
            valid = false;
        }

        if (!formData.passwordConfirm || formData.passwordConfirm.trim() === '') {
            errors.passwordConfirm = 'Password confirmation is required';
            valid = false;
        } else if (formData.password !== formData.passwordConfirm) {
            errors.passwordConfirm = 'Passwords do not match';
            valid = false;
        }

        if (!formData.name || formData.name.trim() === '') {
            errors.name = 'Name is required';
            valid = false;
        }

        if (!formData.age || isNaN(formData.age) || formData.age <= 0 || formData.age >= 100) {
            errors.age = 'Please enter a valid age';
            valid = false;
        }

        setErrors(errors)

        return valid
    };

    const handleSummit = () => {
        const isValid = validate()

        if (isValid) {
            const fullFormData = { ...formData, gender: gender };
            navigation.navigate("LoginScreens", {screen:"RegisterSuccess"})
            console.log(fullFormData)
        } else {
            Alert.alert('Invalid Form', 'Please fill in the required fields correctly.');
        }
    }

    const handleInputChange = (field, value) => {
        setData({ ...formData, [field]: value });
        if (errors[field] && value !== '') {
            setErrors({ ...errors, [field]: '' });
        }
    };

    return (
        <VStack height={"100%"} bgColor={"white"} p={5} justifyContent={"space-between"}>
            <VStack space={5} justifyContent={"center"}>
                <Heading height={"5%"}>정보를 입력해주세요.</Heading>
            <FormControl isRequired isInvalid={errors.username}>
                <FormControl.Label _text={{bold:true}}>아이디</FormControl.Label>
                <Input
                    placeholder="아이디을 입력해주세요."
                    onChangeText={(value) => handleInputChange('username', value)}
                    bg={"gray.50"}
                    height={50}
                    _focus={{
                        bgColor:"gray.50"
                    }}
                />
                <FormControl.ErrorMessage>{errors.username}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.password}>
                <FormControl.Label _text={{bold:true}}>비밀번호</FormControl.Label>
                <Input
                    placeholder="비밀번호를 입력해주세요."
                    onChangeText={(value) => handleInputChange('password', value)}
                    bg={"gray.50"}
                    type={show ? "text" : "password"}
                    height={50}
                    _focus={{
                        bgColor:"gray.50"
                    }}
                    InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                            <Icon as={<Ionicons name={show ? "eye" : "eye-off"}/>} size={5} mr="2"
                                  color="muted.400"/>
                        </Pressable>}
                />
                <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.passwordConfirm}>
                <FormControl.Label _text={{bold:true}}>비밀번호 확인</FormControl.Label>
                <Input
                    placeholder="비밀번호 확인"
                    onChangeText={(value) => handleInputChange('passwordConfirm', value)}
                    bg={"gray.50"}
                    type={showAgain ? "text" : "password"}
                    height={50}
                    _focus={{
                        bgColor:"gray.50"
                    }}
                    InputRightElement={
                        <Pressable onPress={() => setShowAgain(!showAgain)}>
                            <Icon as={<Ionicons name={showAgain ? "eye" : "eye-off"}/>} size={5} mr="2"
                                  color="muted.400"/>
                        </Pressable>}
                />
                <FormControl.ErrorMessage>{errors.passwordConfirm}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.name}>
                <FormControl.Label _text={{bold:true}}>이름</FormControl.Label>
                <Input
                    placeholder="이름을 입력해주세요."
                    onChangeText={(value) => handleInputChange('name', value)}
                    bg={"gray.50"}
                    height={50}
                    _focus={{
                        bgColor:"gray.50"
                    }}
                />
                <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.age}>
                <FormControl.Label _text={{bold:true}}>나이</FormControl.Label>
                <Input
                    placeholder="나이를 입력해주세요."
                    onChangeText={(value) => handleInputChange('age', value)}
                    bg={"gray.50"}
                    height={50}
                    _focus={{
                        bgColor:"gray.50"
                    }}
                />
                <FormControl.ErrorMessage>{errors.age}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired>
                <FormControl.Label _text={{bold:true}}>성별</FormControl.Label>
                <VStack space={2}>
                    <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={gender} onChange={nextValue => {
                        setGender(nextValue)
                    }}>
                        <Radio colorScheme={"blue"} value="male" my={1} size={"sm"}>
                            남성
                        </Radio>
                        <Radio colorScheme={"blue"} value="female" my={1} size={"sm"}>
                            여성
                        </Radio>
                    </Radio.Group>
                </VStack>
            </FormControl>
            </VStack>
            <Button variant={"outline"} borderColor={"#2785F4"} onPress={handleSummit} height={55}>
                <Text bold color={"#2785F4"}>다음</Text>
            </Button>
        </VStack>
    )
};
