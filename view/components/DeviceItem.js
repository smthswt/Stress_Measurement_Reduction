// import {Box, Button, HStack, VStack} from "native-base";
// import { Paragraph } from "react-native-paper";
// import React from "react";
//
// export const DeviceItem = ({ name, id, onConnect }) => {
//
//     const handleConnectClick = () => {
//         console.log(`${name} connected to device : ${id}`);
//         onConnect && onConnect(id, name);
//     }
//
//     return (
//         // <Box backgroundColor={"blue.200"} padding={0.5} rounded={"3"}>
//             <VStack space={4} margin={5} flex={0.7} borderWidth={1} borderColor={'red.200'}>
//             {/*<Box p={0} justifyContent={"stretch"} padding={2} backgroundColor={"white"}>*/}
//                 <HStack justifyContent={'space-between'} alignItems={'center'} paddingX={3} paddingY={1}>
//                     {/*RENST : 08:D1:F9:D7:83:26*/}
//                     <Paragraph>{name} : {id}</Paragraph>
//                     <Button onPress={handleConnectClick} >연결하기</Button>
//                 </HStack>
//             {/*</Box>*/}
// </VStack>
//         // </Box>
//     );
// }
//
// // <VStack space={4} margin={5} flex={0.7}>
//
//     {/*{data.map((device, index) => (*/}
//     {/*<Pressable key={index} onPress={() => handleClickDevice((device.name))} flexDir={"row"}*/}
//     {/*           borderColor={clickStates[device.name] ? "#3DC061" : "transparent"}*/}
//     {/*           borderWidth={clickStates[device.name] ? 1 : 0}*/}
//     {/*           bg={"white"} width={"100%"} p={3} shadow={2} justifyContent={"space-between"} alignItems={"center"}>*/}
//     {/*    <Text fontWeight={600}>{device.name}</Text>*/}
//     {/*    {clickStates[device.name] && <AntDesign name={"checkcircle"} size={16} color={"#3DC061"} /> }*/}
//     {/*</Pressable>*/}
//
//     {/*    ))}*/}
//
// {/*</VStack>*/}