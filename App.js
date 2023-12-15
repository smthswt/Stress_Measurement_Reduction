import * as React from 'react';
import {useEffect} from 'react';
import {Animated, PermissionsAndroid, Platform, SafeAreaView, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Box, Center, HStack, Icon, NativeBaseProvider, Pressable, VStack, Text} from "native-base";
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Ionicons from "react-native-vector-icons/Ionicons";
//CustomizedVectorImages

// BLE Import
import {BLEProvider} from "./view/module/BLEProvider";``

// View Import
import {HomeView} from "./view/HomeView";
import {MusicView} from "./view/MusicView";
import {CalendarView} from "./view/CalendarView";
import {SettingsView} from "./view/SettingsView";
import {ElectrocardiogramMeasurementView} from "./view/ElectrocardiogramMeasurementView";
import {AnalysisResultView} from "./view/AnalysisResultView";
import {MassageHealingView} from "./view/MassageHealingView";
import {RecentResultComparison} from "./view/RecentResultComparison";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {Screen} from "react-native-screens";
import {createNativeStackNavigator} from "@react-navigation/native-stack";


/**
 * Object representing cross-fade transition configuration.
 *
 * @typedef {Object} crossFadeTransition
 * @property {string} gestureDirection - The direction of the gesture ('horizontal' or 'vertical').
 * @property {boolean} headerShown - Whether the header is shown or not.
 * @property {Function} cardStyleInterpolator - A function that returns the animated card style.
 */
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

/**
 * @namespace Stack
 * @description Represents a stack navigator object in React Navigation.
 */
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()
const StackNative = createNativeStackNavigator()

const TabScreens = () => {
    return (
        <Tab.Navigator initialRouteName="Home"
                       screenOptions={({route}) => ({
                           tabBarIcon: ({focused, color, size}) => {
                               let iconName
                               let rn = route.name

                               if (rn === "Home") {
                                   iconName = 'home'
                               } else if (rn === "Music") {
                                   iconName = 'musical-notes'
                               } else if (rn === "Calendar") {
                                   iconName = 'calendar'
                               } else if (rn === "Settings") {
                                   iconName = 'settings'
                               }
                               return <Ionicons name={iconName} size={size} color={color}></Ionicons>
                           }
                       })}
        >
            <Tab.Screen name="Home" component={HomeView} options={crossFadeTransition}/>
            <Tab.Screen name="Music" component={MusicView} options={crossFadeTransition}/>
            <Tab.Screen name="Calendar" component={CalendarView}
                        options={crossFadeTransition}/>
            <Tab.Screen name="Settings" component={SettingsView}
                        options={crossFadeTransition}/>
            {/*Analysis Sub Screen
                                <Stack.Screen name="AnalysisStart" component={ElectrocardiogramMeasurementView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="AnalysisEnd" component={AnalysisResultView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="Healing" component={MassageHealingView}
                                              options={crossFadeTransition}/>
                                 */}
        </Tab.Navigator>
    )
}
/**
 * Represents the main application component.
 * @constructor
 */

const AnalysisViewScreens = () => {
    return (
        <StackNative.Navigator initialRouteName={AnalysisResultView}>
            <StackNative.Screen name="AnalysisEnd" component={AnalysisResultView}
                          options={crossFadeTransition}/>
            <StackNative.Screen name="RecentResultCompare" component={RecentResultComparison}
                          options={crossFadeTransition}/>
        </StackNative.Navigator>
    )
}
const App = () => {

    /**
     * Requests location permission from the user.
     *
     * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the location permission is granted or not.
     */
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
        // <Provider store={store}>
        <BLEProvider>
            <NativeBaseProvider>
                <SafeAreaView style={{flex: 1}}>
                    <NavigationContainer>
                        <VStack flex={1} justifyContent={'space-between'}>
                            <Stack.Navigator screenOptions={{
                                headerShown: false,
                                cardStyle: {backgroundColor: 'transparent'}
                            }}>
                                <Stack.Screen name="TabScreens" component={TabScreens} />
                                <Stack.Screen name="AnalysisStart" component={ElectrocardiogramMeasurementView}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="AnalysisViewScreens" component={AnalysisViewScreens}
                                              options={crossFadeTransition}/>
                                <Stack.Screen name="Healing" component={MassageHealingView}
                                              options={crossFadeTransition}/>
                            </Stack.Navigator>
                        </VStack>
                    </NavigationContainer>
                </SafeAreaView>
            </NativeBaseProvider>
        </BLEProvider>
        // </Provider>
    );
};

export default App;
