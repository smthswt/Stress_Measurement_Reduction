import React from 'react';
import { View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { Center, Container, Heading, Text, Button, NativeBaseProvider, Box } from "native-base";


export const DetailsScreen = ({ navigation }) => (
    <View>
        <Button onPress={() => navigation.navigate('Home')}>Back</Button>
        <Button onPress={() => navigation.navigate('Profile')}>Go to Profile</Button>
    </View>
);

export const ProfileScreen = () => (
    <View>
        <Text>Profile Screen</Text>
    </View>
);
