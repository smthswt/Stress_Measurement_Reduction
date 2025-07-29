import {
  Button,
  Center,
  Checkbox,
  FormControl,
  Heading,
  HStack,
  Input,
  List,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';
import {UserContext} from './module/UserProvider';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
// import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 *
 */

export const SettingsView_DeleteAccount = ({navigation}) => {
  const [feedback, setFeedback] = useState(null);
  const [check, setCheck] = useState(false);

  const {userId} = useContext(UserContext);

  const handleDeleteAccount = async () => {
    if (check) {
      try {
        const userRef = firestore().collection('Users').doc(userId);
        const snapshot = await userRef.get();

        if (snapshot.exists) {
          await userRef.delete();
          await navigation.navigate('LoginScreens', {screen: 'Login'});
          Alert.alert('성공', '계정이 성공적으로 삭제되었습니다.');
          console.log('탈퇴 사유 :', feedback);
        } else {
          Alert.alert('오류', '사용자를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Error deleting account: ', error);
        Alert.alert(
          '오류',
          '계정 삭제 중 오류가 발생했습니다. 다시 시도 해주세요.',
        );
      }
    } else {
      Alert.alert('오류', '정보를 확인해주세요.');
    }
  };

  return (
    // <ScrollView max p={5} bg={"blue.200"} >
    <VStack space={5} flex={1} p={5} bg={'white'}>
      <Center flex={2}>
        <Text color={'#2785F4'} fontSize={'6xl'}>
          RENST
        </Text>
      </Center>
      <VStack space={1}>
        <FormControl>
          <FormControl.Label _text={{bold: true}}>
            서비스를 탈퇴하시려는 이유가 있으신가요?
          </FormControl.Label>
          <TextArea
            placeholder="서비스 탈퇴 사유에 대해 알려주시면 고객님의 피드백을 반영하여 더 나은 서비스로 보답 드리겠습니다."
            onChangeText={value => setFeedback(value)}
            bg={'gray.50'}
            h={150}
            _focus={{
              bgColor: 'gray.50',
              borderColor: '#2785F4',
            }}
          />
        </FormControl>

        <HStack alignItems={'center'} space={1}>
          <Ionicons name={'ellipse'} size={5}></Ionicons>
          <Text>서비스 탈퇴이후 모든 데이터는 복구가 불가능합니다.</Text>
        </HStack>
      </VStack>

      {/*<ScrollView>*/}
      <VStack space={5} justifyContent={'flex-end'}>
        <HStack alignItems={'center'}>
          <Checkbox
            shadow={2}
            colorScheme="blue"
            value={check}
            accessibilityLabel="Delete account checkbox"
            onChange={newValue => setCheck(newValue)}>
            안내사항을 모두 확인하였으며, 이에 동의합니다.
          </Checkbox>
        </HStack>
        <Button
          height={55}
          bg={'#2785F4'}
          isDisabled={!check}
          onPress={handleDeleteAccount}>
          <Text bold color={'white'} fontSize={'md'}>
            탈퇴하기
          </Text>
        </Button>
      </VStack>
      {/*</ScrollView>*/}
    </VStack>
    // </ScrollView>
  );
};
