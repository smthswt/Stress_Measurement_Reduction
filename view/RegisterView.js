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

export const RegisterView = ({navigation}) => {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showAgain, setShowAgain] = useState(false);
  const [gender, setGender] = useState('male');


  const createTables = async () => {
    db.transaction(txn => {
      txn.executeSql(
          `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username VARCHAR UNIQUE, password VARCHAR, name VARCHAR, age INTEGER, gender VARCHAR)`,
          [],
          (sqlTxn, res) => {
            console.log('table created successfully')
          },
          error => {
            console.log("error on creating table" + error.message)
          }
      )
    })
  }

  useEffect(() => {
    createTables()
  }, []);

  const validate = () => {
    let valid = true;
    const errors = {};

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

    if (
      !formData.age ||
      isNaN(formData.age) ||
      formData.age <= 0 ||
      formData.age >= 100
    ) {
      errors.age = 'Please enter a valid age';
      valid = false;
    }

    db.transaction(tx => {
      tx.executeSql(
          'SELECT * FROM users WHERE username = ?',
          [formData.username],
          (_, { rows }) => {
            if (rows.length > 0) {
              errors.username = 'Username already exists';
              valid = false;
              setErrors(errors);
            }
          },
          error => {
            console.error('Error checking username: ', error);
          }
      );
    });

    setErrors(errors);

    return valid;
  };

  const {setUserId} = useContext(UserContext)

  const handleSummit =  async () => {
    const isValid = validate();

    if (isValid) {
      const fullFormData = {...formData, gender: gender};
      db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO users (username, password, name, age, gender) VALUES (?, ?, ?, ?, ?)',
            [
              fullFormData.username,
              fullFormData.password,
              fullFormData.name,
              fullFormData.age,
              fullFormData.gender,
            ],
            (_,result) => {
              console.log('User registered successfully');
              const userId = result.insertId
              setUserId(userId)
              navigation.navigate('LoginScreens', {
                screen: 'RegisterSuccess',
                params: { name: formData.name, username: formData.username, password:formData.password },
              });
            },
            error => {
              console.error('Error registering user in database: ', error);
            }
        );
      });

      console.log(fullFormData);
    } else {
      Alert.alert(
        'Invalid Form',
        'Please fill in the required fields correctly.',
      );
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
