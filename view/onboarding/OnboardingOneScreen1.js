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
import {ImageBackground, TouchableOpacity} from 'react-native';
import Onboarding1 from '../icons/Onboarding1';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../images/onboardingbackground.png');

export const OnboardingOneScreen1 = ({navigation}) => {
  const handleNext = () => {
    navigation.navigate('LoginScreens', {screen: 'Onboarding2'});
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
            RENST는
          </Heading>
          <Box width={'60%'}>
            <Text color={'white'}>
              고객의 일상 속 지친 심신의 빠른 회복에 도움을 드려 행복한 일상을
              누릴 수 있게 개발 되었습니다.
            </Text>
          </Box>
        </VStack>
        <HStack
          justifyContent={'flex-end'}
          p={5}
          flex={4}
          alignItems={'flex-end'}>
          <Onboarding1 height={327} width={105}></Onboarding1>
        </HStack>
        <VStack p={5} space={5} flex={1} justifyContent={'flex-end'}>
          <HStack space={3} justifyContent={'center'}>
            <Divider
              width={10}
              height={1}
              borderRadius={10}
              bgColor={'#2785F4'}></Divider>
            <Divider width={10} height={1} borderRadius={10}></Divider>
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
