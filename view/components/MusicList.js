import {Button, Center, HStack, ScrollView, Text, View, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";


export const MusicList = () => {
    const  EditButton = () => {
        console.log("Edit button is pressed")
    };

    // 나중에 flatlist 적용 ㄱㄱ

    return(
        <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20}}>

            <Center width={"100%"} backgroundColor={'white'} paddingY={5}>
                <VStack space={3} width={"96%"} alignItems={"center"} justifyContent={'center'}>

                    <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
                        <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
                            <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"}></Ionicons>
                            <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 1</Text>
                                <Text color={"#616161"}>J.S Bach - Air on the G String</Text>
                            </VStack>
                        </HStack>
                        <Button variant={"unstyled"} onPress={EditButton}>
                            <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                <MaterialIcons name={"edit"} size={20} color={"#59BCFF"}/>
                            </View>
                        </Button>
                    </HStack>

                    <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
                        <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
                            <Ionicons name="logo-youtube" size={22} color={"#FF0000"} />
                            <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 2</Text>
                                <Text color={"#616161"}>Maroon 5 - Memories</Text>
                            </VStack>
                        </HStack>
                        <Button variant={"unstyled"} onPress={EditButton}>
                            <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                <MaterialIcons name={"edit"} size={20} color={"#59BCFF"}/>
                            </View>
                        </Button>
                    </HStack>

                    <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
                        <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
                            <Ionicons name="logo-youtube" size={22} color={"#FF0000"} />
                            <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 3</Text>
                                <Text color={"#616161"}>Adele - Rolling in the Deep</Text>
                            </VStack>
                        </HStack>
                        <Button variant={"unstyled"} onPress={EditButton}>
                            <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                <MaterialIcons name={"edit"} size={20} color={"#59BCFF"}/>
                            </View>
                        </Button>
                    </HStack>

                    <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
                        <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
                            <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
                            <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 4</Text>
                                <Text color={"#616161"}>Sleepy Fish - Butterfly</Text>
                            </VStack>
                        </HStack>
                        <Button variant={"unstyled"} onPress={EditButton}>
                            <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                <MaterialIcons name={"edit"} size={20} color={"#59BCFF"}/>
                            </View>
                        </Button>
                    </HStack>

                    <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>
                        <HStack space={6} margin={2} alignItems={"center"} justifyContent={'center'}>
                            <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />
                            <VStack space={2} alignItems={'flex-start'} justifyContent={'center'}>
                                <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 5</Text>
                                <Text color={"#616161"}>Marian Carey - All i Want for</Text>
                            </VStack>
                        </HStack>
                        <Button variant={"unstyled"} onPress={EditButton}>
                            <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                <MaterialIcons name={"edit"} size={20} color={"#59BCFF"}/>
                            </View>
                        </Button>
                    </HStack>



                </VStack>
            </Center>
        </ScrollView>
    );
};