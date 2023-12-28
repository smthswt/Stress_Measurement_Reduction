import {View} from "react-native";
import {HStack, Slider, Text, VStack} from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const SettingsView_Regular = ({ navigation }) => (
    <VStack height={"100%"} p={5} space={10}>
        <VStack bg={"white"} shadow={2} p={5} space={10}>
            <VStack>
                <Text bold>음악 소리</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <Ionicons name={"volume-medium"} color={"blue"} size={25}/>
                    <Slider width={"90%"} defaultValue={30} minValue={0} maxValue={100} step={10} colorScheme={"blue"}>
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                </HStack>
            </VStack>
            <VStack>
                <Text bold>진동 세기</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <Ionicons name={"volume-medium"} color={"blue"} size={25}/>
                    <Slider width={"90%"} defaultValue={60} minValue={0} maxValue={100} step={10} colorScheme={"blue"}>
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                </HStack>
            </VStack>
        </VStack>

        <VStack bg={"white"} shadow={2} p={5} space={10}>
            <VStack>
                <Text bold>측정 시간</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <Ionicons name={"time"} color={"blue"} size={25}/>
                    <Slider width={"90%"} defaultValue={3} minValue={1} maxValue={5} step={2} colorScheme={"blue"}>
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                </HStack>
            </VStack>
            <VStack>
                <Text bold>자극 시간</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <Ionicons name={"time"} color={"blue"} size={25}/>
                    <Slider width={"90%"} defaultValue={15} minValue={10} maxValue={20} step={5} colorScheme={"blue"}>
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb/>
                    </Slider>
                </HStack>
            </VStack>
        </VStack>
    </VStack>

);
