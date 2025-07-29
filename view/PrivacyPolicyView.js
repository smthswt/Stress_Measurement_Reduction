import {
  Box,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  Pressable,
  Spacer,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect} from 'react';
import {BackHandler, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

export const PrivacyPolicy = ({navigation}) => {
  const Arrow = () => {
    return <Ionicons name={'chevron-forward'} size={25} color={'black'} />;
  };

  const handlePurpose = () => {
    navigation.navigate('PrivacyPolicyScreens', {screen: 'Purpose'});
    console.log('handlePurpose :', navigation);
  };

  const handlePeriod = () => {
    navigation.navigate('PrivacyPolicyScreens', {screen: 'Period'});
    console.log('handlePurpose :', navigation);
  };

  const data = [
    {
      id: 1,
      Policyof: '개인정보의 처리 목적',
    },
    {
      id: 2,
      Policyof: '개인정보의 처리 및 보유 기간',
    },
    {
      id: '개인정보의 제3자 제공에 관한 사항',
      Policyof: '개인정보의 제3자 제공에 관한 사항',
    },
    {
      id: '개인정보의 파기절차 및 파기방법',
      Policyof: '개인정보의 파기절차 및 파기방법',
    },
    {
      id: '개인정보의 처리의 위탁에 관한 사항',
      Policyof: '개인정보의 처리의 위탁에 관한 사항',
    },
    {
      id: '처리하는 개인정의 항목',
      Policyof: '처리하는 개인정의 항목',
    },
    {
      id: '안전한 개인정보 보호를 위한 조치',
      Policyof: '안전한 개인정보 보호를 위한 조치',
    },
  ];

  const handlePolicyPress = policyId => {
    // 여기에서 policyId를 기반으로 적절한 스크린으로 이동
    console.log('선택된 id :', policyId);
    switch (policyId) {
      case 1:
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Purpose'});
        console.log('Purpose :', navigation);
        break;
      case 2:
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Period'});
        console.log('Period :', navigation);
        break;
      case '개인정보의 제3자 제공에 관한 사항':
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Third'});
        break;
      case '개인정보의 파기절차 및 파기방법':
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Drop'});
        break;
      case '개인정보의 처리의 위탁에 관한 사항':
        navigation.navigate('PrivacyPolicyScreens', {screen: 'delegation'});
        break;
      case '처리하는 개인정의 항목':
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Personal'});
        break;
      case '안전한 개인정보 보호를 위한 조치':
        navigation.navigate('PrivacyPolicyScreens', {screen: 'Safety'});
        break;

      default:
        break;
    }
  };

  // data 개인정보 내용으로 바꾸기
  return (
    <VStack flex={1}>
      <HStack
        alignitems={'center'}
        justifyContent={'flex-start'}
        bgColor={'white'}
        padding={5}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name={'arrow-back'} color={'#222222'} size={25} />
        </TouchableOpacity>
        <Text bold fontSize={18} marginLeft={3}>
          개인정보 처리방침
        </Text>
      </HStack>

      <VStack flex={1} m={6}>
        <Box width={'100%'} backgroundColor={'white'} shadow={2} paddingY={1}>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <VStack flex={1} backgroundColor={'white'}>
                <Pressable
                  space={2}
                  flex={1}
                  backgroundColor={'white'}
                  paddingY={4}
                  paddingX={6}
                  onPress={() => handlePolicyPress(item.id)}>
                  <HStack width={'100%'} justifyContent={'space-between'}>
                    <Text fontSize={'15px'} fontWeight={'bold'} marginTop={0.5}>
                      {item.Policyof}
                    </Text>
                    <Arrow />
                  </HStack>
                </Pressable>
                <Center paddingX={5}>
                  {index !== data.length - 1 && <Divider opacity={0.8} />}
                </Center>
              </VStack>
            )}
          />
        </Box>
      </VStack>
    </VStack>
  );
};
