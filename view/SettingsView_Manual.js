import {View} from "react-native";
import {Button, Divider, Radio, Text, VStack} from "native-base";
import React from "react";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const SettingsView_Manual = ({ navigation }) => {
    const [music, setMusic] = React.useState("music_two");
    const [move, setMove] = React.useState("move_two");
    const [time, setTime] = React.useState("time_one");

    return (
        <VStack height={"100%"} p={5} space={5}>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <Text bold>음원 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={music} onChange={nextValue => {
                    setMusic(nextValue);
                }}>
                    <Radio value="music_one" my={1} size={"sm"}>
                        Rise Again (Feat. Will Bug)
                    </Radio>
                    <Radio value="music_two" my={1} size={"sm"}>
                        Shin Seung Hun - Like a Beautiful Flame
                    </Radio>
                    <Radio value="music_three" my={1} size={"sm"}>
                        Maroon 5 - Wipe your eyes
                    </Radio>
                    <Radio value="music_four" my={1} size={"sm"}>
                        J.S Bach - Air on the G String
                    </Radio>
                </Radio.Group>
                <Divider/>
                <Button variant={"text"} >음원 추가하기 +</Button>
            </VStack>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <Text bold>진동 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={move} onChange={nextValue => {
                    setMove(nextValue);
                }}>
                    <Radio value="move_one" my={1} size={"sm"}>60 Hz</Radio>
                    <Radio value="move_two" my={1} size={"sm"}>70 Hz</Radio>
                    <Radio value="move_three" my={1} size={"sm"}>80 Hz</Radio>
                    <Radio value="move_four" my={1} size={"sm"}>90 Hz</Radio>
                    <Radio value="move_five" my={1} size={"sm"}>100 Hz</Radio>

                </Radio.Group>
            </VStack>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <Text bold>시간 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={time} onChange={nextValue => {
                    setTime(nextValue);
                }}>
                    <Radio value="time_one" my={1} size={"sm"}>10 분</Radio>
                    <Radio value="time_two" my={1} size={"sm"}>20 분</Radio>
                    <Radio value="time_three" my={1} size={"sm"}>30 분</Radio>
                </Radio.Group>
            </VStack>
        </VStack>
    )
}
