import React, {useEffect} from "react";
import {
    Box,
    Button,
    Center,
    Container,
    HStack,
    Icon,
    NativeBaseProvider,
    Pressable,
    ScrollView,
    Text,
    VStack,
    View,
} from "native-base";
import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {MusicList} from "./components/MusicList";


const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");



/**
 * Represents a view for the Music page.
 *
 * @param {Object} navigation - The navigation object used for navigating between screens.
 *
 * @returns {JSX.Element} The rendered MusicView component.
 */
export const MusicView = ({ navigation }) => {

    return (
        <VStack>
            <View alignContent={"flex-start"} bg={"white"} padding={5}>
                <Text bold fontSize={18}>음원 설정</Text>
                <Text fontSize={14} color={"#616151"} mt={2}>나에게 맞는 음악을 설정해보세요.</Text>
            </View>

            <MusicList></MusicList>

        </VStack>
    );
};