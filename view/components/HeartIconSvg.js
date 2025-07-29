import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import HeartIcon from '../images/HeartIcon.svg';
import {WithLocalSvg} from 'react-native-svg';

const HeartIconSvg = () => {
  return (
    <View>
      <WithLocalSvg
        width={100}
        height={100}
        fill={'#000000'}
        asset={HeartIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 30,
  },
});

export default HeartIconSvg;
