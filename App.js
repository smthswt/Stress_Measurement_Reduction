import * as React from 'react';
import {useEffect} from 'react';
import {Animated, PermissionsAndroid, Platform, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider, VStack} from "native-base";
// react-native-permissions 라이브러리를 사용하는 경우
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';


// 페이지 모듈
import {HomeScreen} from "./view/Home";

// 블루투스 BLE 모듈
import {BLEProvider} from "./module/BLEProvider";

// 아이콘
import {MusicView} from "./view/MusicView";
import {CalendarView} from "./view/CalendarView";
import {SettingsView} from "./view/SettingsView";
import {ElectrocardiogramMeasurementView} from "./view/ElectrocardiogramMeasurementView";
import {AnalysisResult} from "./view/AnalysisResult";
import {MassageHealingView} from "./view/MassageHealingView";
import {Provider} from "react-redux";
import store from "./Redux/rootReducer";


// const Tab = createBottomTabNavigator();

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

// 크로스 페이드 트랜지션 정의
const crossFadeTransition = {
    gestureDirection: 'horizontal',
    headerShown: false,
    cardStyleInterpolator: ({current, next, layouts}) => {
        return {
            cardStyle: {
                opacity: Animated.add(
                    current.progress,
                    next ? next.progress : 0
                ).interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, 1, 0],
                }),
            },
        };
    },
};

const Stack = createStackNavigator();

const App = () => {
    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            let locationPermission = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (locationPermission === RESULTS.DENIED) {
                const newPermission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                return newPermission === RESULTS.GRANTED;
            }

            return locationPermission === RESULTS.GRANTED;
        } else if (Platform.OS === 'android' && Platform.Version >= 23) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "위치 서비스 권한",
                        message: "이 앱은 BLE 기능을 사용하기 위해 위치 서비스 접근 권한이 필요합니다.",
                        buttonNeutral: "나중에 묻기",
                        buttonNegative: "거부",
                        buttonPositive: "허용"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("위치 권한 획득");
                } else {
                    console.log("위치 권한 거부");
                }
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);

    return (
        <Provider store={store}>
            <BLEProvider>
                <NativeBaseProvider>
                    <SafeAreaView style={{flex: 1}}>
                        <NavigationContainer>
                            <VStack flex={1} justifyContent={'space-between'}>
                                <Stack.Navigator initialRouteName="Home" screenOptions={{
                                    headerShown: false,
                                    cardStyle: {backgroundColor: 'transparent'}
                                }}>
                                    {/*Main Menu Screen*/}
                                    <Stack.Screen name="Home" component={HomeScreen} options={crossFadeTransition}/>
                                    <Stack.Screen name="Music" component={MusicView} options={crossFadeTransition}/>
                                    <Stack.Screen name="Calendar" component={CalendarView}
                                                  options={crossFadeTransition}/>
                                    <Stack.Screen name="Settings" component={SettingsView}
                                                  options={crossFadeTransition}/>
                                    {/*Analysis Sub Screen*/}
                                    <Stack.Screen name="AnalysisStart" component={ElectrocardiogramMeasurementView}
                                                  options={crossFadeTransition}/>
                                    <Stack.Screen name="AnalysisEnd" component={AnalysisResult}
                                                  options={crossFadeTransition}/>
                                    <Stack.Screen name="Healing" component={MassageHealingView}
                                                  options={crossFadeTransition}/>
                                </Stack.Navigator>
                            </VStack>
                        </NavigationContainer>
                    </SafeAreaView>
                </NativeBaseProvider>
            </BLEProvider>
        </Provider>
    );
};

export default App;
