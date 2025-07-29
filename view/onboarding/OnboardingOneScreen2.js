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
import Onboarding2 from '../icons/Onboarding2';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../images/onboardingbackground.png');

export const OnboardingOneScreen2 = ({navigation}) => {
  const handleNext = () => {
    navigation.navigate('LoginScreens', {screen: 'Onboarding3'});
  };

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
            마음과 몸
          </Heading>
          <Box width={'60%'}>
            <Text color={'white'}>
              누구보다 더 고객의 마음과 몸을 이해하기 위해, 자율신경계를
              분석하여 심신 상태에 따라 능동적인 피드백을 드릴 수 있습니다.
            </Text>
          </Box>
        </VStack>
        <HStack
          justifyContent={'flex-end'}
          p={5}
          flex={4}
          alignItems={'flex-end'}>
          <Onboarding2 height={328} width={124}></Onboarding2>
        </HStack>
        <VStack p={5} space={5} flex={1} justifyContent={'flex-end'}>
          <HStack space={3} justifyContent={'center'}>
            <Divider width={10} height={1} borderRadius={10}></Divider>
            <Divider
              width={10}
              height={1}
              borderRadius={10}
              bgColor={'#2785F4'}></Divider>
            <Divider width={10} height={1} borderRadius={10}></Divider>
          </HStack>
          <HStack space={3}>
            <Button flex={1} variant={'text'} p={4} onPress={handleStart}>
              <Text color={'#2785F4'} bold>
                SKIP
              </Text>
            </Button>
            <Button flex={1} bg={'#2785F4'} p={4} onPress={handleNext}>
              <Text color={'white'} bold>
                다음
              </Text>
            </Button>
          </HStack>
        </VStack>
      </ImageBackground>
    </View>
  );
};
