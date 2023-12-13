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


const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");


/**
 * Represents a view for the Music page.
 *
 * @param {Object} navigation - The navigation object used for navigating between screens.
 *
 * @returns {JSX.Element} The rendered MusicView component.
 */
export const MusicView = ({ navigation }) => (
    <Box flex={1}>
        <View alignContent={"flex-start"} bg={"white"} padding={5}>
            <Text bold fontSize={18}>음원 설정</Text>
            <Text fontSize={14} color={"#616151"} mt={2}>나에게 맞는 음악을 설정해보세요.</Text>
        </View>

        <ScrollView
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{marginVertical: 1, alignItems: "center", justifyContent: 'center'}}
            padding={5}
        >


            <Box width={"full"} backgroundColor={'white'} borderRadius={10} paddingY={5} shadow={"3"}>
            <VStack space={2}>

                <Box backgroundColor={"green.200"}>
                    <HStack space={4} margin={3} alignItems={"center"} justifyContent={'center'}>
                    <Box flex={0.5} alignItems={'center'} justifyContent={'center'}>
                        <Ionicons name="musical-notes-sharp" size={30} color={"#59BCFF"}></Ionicons>
                    </Box>
                    <Box flex={3} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'center'}>
                        <Text marginBottom={1.5} bold fontSize={'md'} color={"#222222"}>스트레스 레벨 1</Text>
                        <Text color={"#616161"}>J.S Bach - Air on the G String</Text>
                    </Box>
                    <Box flex={0.5} alignItems={'center'} justifyContent={'center'}>
                        <MaterialIcons name={"edit"} size={30} color={"#59BCFF"}/>
                    </Box>
                    </HStack>
                </Box>


            </VStack>
            </Box>
        </ScrollView>
    </Box>
);