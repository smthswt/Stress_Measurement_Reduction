import * as React from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {DetailsScreen, ProfileScreen,} from './Screen'
import {NativeBaseProvider, Box, HStack, Center, Pressable, Text, Icon, ZStack, VStack, Spacer} from "native-base";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {HomeScreen} from "./view/Home";
import {DetailsScreen, ProfileScreen} from "./Screen";

const Tab = createBottomTabNavigator();

// function MyTabs() {
//     return (
//         <SafeAreaView style={{flex: 1}}>
//             {/*<StatusBar barStyle="dark-content" />*/}
//             <Tab.Navigator>
//                 <Tab.Screen name="Home" component={HomeScreen} options={{
//                     tabBarLabel: "",
//                     headerShown: false, tabBarIcon: ({color, size}) => (
//                         <Icon name="ios-home" color={color} size={size}/>
//                     )
//                 }}/>
//                 <Tab.Screen name="Music" component={ProfileScreen}
//                             options={{headerShown: false, tabBarIcon: () => null}}/>
//                 <Tab.Screen name="Calander" component={HomeScreen} options={{headerShown: false}}/>
//                 <Tab.Screen name="Settings" component={DetailsScreen} options={{headerShown: false}}/>
//             </Tab.Navigator>
//         </SafeAreaView>
//     );
// }

const Footer = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = React.useState(1);
    return (
        <Box bg="white" safeAreaBottom width="100%">
            <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
                <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1}
                           onPress={() => {
                               setSelected(0);
                               navigation.navigate('Home');
                           }}>
                    <Center>
                        {/*<Icon name="home" />*/}
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Home
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1}
                           onPress={() => {
                               setSelected(1);
                               navigation.navigate('Details');
                           }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons
                            name={selected === 0 ? 'feature-search' : 'feature-search-outline'}/>} color="white"
                              size="sm"/>
                        <Text color="white" fontSize="12">
                            Search
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1}
                           onPress={() => {
                               setSelected(2);
                               navigation.navigate('Profile');
                           }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cart' : 'cart-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Cart
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1}
                           onPress={() => setSelected(3)}>
                    <Center>
                        <Icon mb="1"
                              as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Account
                        </Text>
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    );
}


const Stack = createStackNavigator();

const App = () => {
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                {/*<MyTabs/>*/}
                <VStack flex={1} justifyContent={"space-between"}>
                    {/* 여기에 다른 화면 콘텐츠를 배치합니다 */}
                    {/* 예: <Stack.Navigator>...</Stack.Navigator> */}
                    <SafeAreaView style={{flex: 1}}>
                        <Stack.Navigator initialRouteName="Home">
                            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                            <Stack.Screen name="Details" component={DetailsScreen} options={{headerShown: false}}/>
                            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
                        </Stack.Navigator>
                    </SafeAreaView>

                    {/* Footer 컴포넌트 */}
                    <Footer/>
                </VStack>
            </NavigationContainer>
        </NativeBaseProvider>
    );
};

export default App;
