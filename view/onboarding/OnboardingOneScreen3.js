import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base';
import {ImageBackground} from 'react-native';
import Onboarding1 from '../icons/Onboarding1';
import Onboarding3 from '../icons/Onboarding3';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../images/onboardingbackground.png');

export const OnboardingOneScreen3 = ({navigation}) => {
  const handleStart = async () => {
    await AsyncStorage.setItem('ONBOARDED', 'true');
    navigation.navigate('LoginScreens', {screen: 'Login'});
  };

  return (
    <View flex={1}>
      <ImageBackground
        source={background}
        alt={'onboarding1'}
        style={{width: '100%', height: '100%'}}>
        <VStack p={5} flex={2} justifyContent={'flex-end'} space={5}>
          <Heading fontSize={'4xl'} color={'white'}>
            늘 당신의 편
          </Heading>
          <Box width={'60%'}>
            <Text color={'white'}>
              고객의 도움이 필요로 하는 그 순간, 가장 가까운 곳에서 힘이 되어
              드리겠습니다.
            </Text>
          </Box>
        </VStack>
        <HStack
          justifyContent={'flex-end'}
          p={5}
          flex={4}
          alignItems={'flex-end'}>
          <Onboarding3 height={326} width={122}></Onboarding3>
        </HStack>
        <VStack p={5} space={5} flex={1} justifyContent={'flex-end'}>
          <HStack space={3} justifyContent={'center'}>
            <Divider width={10} height={1} borderRadius={10}></Divider>
            <Divider width={10} height={1} borderRadius={10}></Divider>
            <Divider
              width={10}
              height={1}
              borderRadius={10}
              bgColor={'#2785F4'}></Divider>
          </HStack>
          <Button bg={'#2785F4'} p={4} onPress={handleStart}>
            <Text color={'white'} bold>
              시작하기
            </Text>
          </Button>
        </VStack>
      </ImageBackground>
    </View>
  );
};
