import {View} from 'react-native';
import {
  Button,
  FormControl,
  Heading, HStack,
  Icon,
  Input,
  Pressable,
  Radio,
  ScrollView, Stack,
  Text,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {UserContext} from "./module/UserProvider";
import firestore from "@react-native-firebase/firestore";


/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */


export const RegisterView = ({navigation}) => {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showAgain, setShowAgain] = useState(false);
  const [gender, setGender] = useState('male');


  //add - 랜덤 유니크 문서 아이디 생성, set - 문서 아이디 지정
  //컬랙션 생성, 사용자 정보 추가
  const addNewUser = async () => {
    try {
      const isUserIdExists = await checkUserIdExists(formData.username);

      if (isUserIdExists) {
        console.log('User already exists');
        Alert.alert(
            '가입 오류',
            '기입한 정보를 확인해주세요.',
        );
        return; // 중복된 아이디가 있으면 함수 종료
      }

      const userCollection = await firestore().collection('Users');

      const userDoc = await userCollection.add({
        name: formData.name,
        userId: formData.username,
        password: formData.password,
        age: formData.age,
        gender: gender,
      });

      console.log('User registered successfully!');

      return userDoc.id;

    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert(
          '가입 오류',
          '다시 시도 해주세요.',
      );
    }
  };


  const checkUserIdExists = async (userId) => {
    try {
      const userRef = firestore().collection('Users').where('userId', '==', formData.username);
      const snapshot = await userRef.get();
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking userId: ', error);
      return false;
    }
  };


  const validate = async () => {
    let valid = true;
    const errors = {};

    if (!formData.username || formData.username.trim() === '') {
      errors.username = 'Username is required';
      valid = false;
    } else {
      const isUserIdExists = await checkUserIdExists(formData.username);
      if (isUserIdExists) {
        errors.username = 'Username already exists';
        valid = false;
      }
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

    if (
      !formData.age ||
      isNaN(formData.age) ||
      formData.age <= 0 ||
      formData.age >= 100
    ) {
      errors.age = 'Please enter a valid age';
      valid = false;
    }

    setErrors(errors);

    return valid;
  };

  const {setUserId} = useContext(UserContext)

  const handleSummit =  async () => {
    const isValid = await validate();

    if (isValid) {
      const fullFormData = {...formData, gender: gender};
      const userDocId = await addNewUser();

      console.log("userDocId :", userDocId)
      setUserId(userDocId)

      navigation.navigate('LoginScreens', {
        screen: 'RegisterSuccess',
        params: { name: formData.name, username: formData.username, password: formData.password },
      })

      console.log(fullFormData);
    }
  };

  const handleInputChange = (field, value) => {
    setData({...formData, [field]: value});
    if (errors[field] && value !== '') {
      setErrors({...errors, [field]: ''});
    }
  };

  return (
      <ScrollView backgroundColor={"white"}>
      <VStack
        height={'100%'}
        bgColor={'white'}
        p={5}
        justifyContent={'space-between'}>
        <VStack space={5} justifyContent={'center'}>
          <Heading>정보를 입력해주세요.</Heading>
          <FormControl isRequired isInvalid={errors.username}>
            <FormControl.Label _text={{bold: true}}>아이디</FormControl.Label>
            <Input
              placeholder="아이디을 입력해주세요."
              onChangeText={value => handleInputChange('username', value)}
              bg={'gray.50'}
              height={50}
              _focus={{
                bgColor: 'gray.50',
                borderColor:"#2785F4",
              }}
            />
            <FormControl.ErrorMessage>
              {errors.username}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.password}>
            <FormControl.Label _text={{bold: true}}>비밀번호</FormControl.Label>
            <Input
              placeholder="비밀번호를 입력해주세요."
              onChangeText={value => handleInputChange('password', value)}
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
            <FormControl.ErrorMessage>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.passwordConfirm}>
            <FormControl.Label _text={{bold: true}}>
              비밀번호 확인
            </FormControl.Label>
            <Input
              placeholder="비밀번호 확인"
              onChangeText={value =>
                handleInputChange('passwordConfirm', value)
              }
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
            <FormControl.ErrorMessage>
              {errors.passwordConfirm}
            </FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.name}>
            <FormControl.Label _text={{bold: true}}>이름</FormControl.Label>
            <Input
              placeholder="이름을 입력해주세요."
              onChangeText={value => handleInputChange('name', value)}
              bg={'gray.50'}
              height={50}
              _focus={{
                bgColor: 'gray.50',
                borderColor:"#2785F4",
              }}
            />
            <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={errors.age}>
            <FormControl.Label _text={{bold: true}}>나이</FormControl.Label>
            <Input
              placeholder="나이를 입력해주세요."
              onChangeText={value => handleInputChange('age', value)}
              bg={'gray.50'}
              height={50}
              _focus={{
                bgColor: 'gray.50',
                borderColor:"#2785F4",
              }}
            />
            <FormControl.ErrorMessage>{errors.age}</FormControl.ErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label _text={{bold: true}}>성별</FormControl.Label>
              <Radio.Group
                name="myGenderGroup"
                accessibilityLabel="gender"
                value={gender}
                onChange={nextValue => {
                  setGender(nextValue);
                }}>
                <Stack direction={"row"} alignItems={"flex-start"} space={4}>
                <Radio colorScheme={'blue'} value="male" my={1} size={'sm'}>
                  남성
                </Radio>
                <Radio colorScheme={'blue'} value="female" my={1} size={'sm'}>
                  여성
                </Radio>
                </Stack>
              </Radio.Group>
          </FormControl>
        </VStack>
        <Button
          variant={'outline'}
          borderColor={'#2785F4'}
          onPress={handleSummit}
          height={55}
          marginTop={10}>
          <Text bold color={'#2785F4'}>
            다음
          </Text>
        </Button>


      </VStack>
      </ScrollView>
  );
};
