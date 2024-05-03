// import React, {useState} from "react";
// import {Box, HStack, Progress, Text, VStack} from "native-base";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import moment from "moment";
//
// /**
//  * Represents an item component that displays stress index, sdnn, and heart rate.
//  *
//  * @param {number} stressIndex - The stress index value.
//  * @param {number} sdnn - The SDNN value.
//  * @param {number} hr - The heart rate value.
//  * @returns {JSX.Element} - The rendered item component.
//  */
// export const ItemComponent = ({stressIndex, sdnn, hr, createAt}) => {
//     /**
//      * Represents the current date and time.
//      *
//      * @type {Date}
//      */
//     const now = new Date();
//
//     console.log(createAt);
//     const [momentDate, setMomentDate] = useState(moment(createAt));
//
//
//     /**
//      * Converts the current date to a string in the format yyyy-mm-dd.
//      *
//      * @returns {string} The string representation of the current date in yyyy-mm-dd format.
//      */
//     const dateString = now.toISOString().split('T')[0];
//
//     /**
//      * Retrieves the current time as a string and extracts the first part
//      * of the time string.
//      *
//      * @returns {string} The first part of the time string in the format 'hh:mm:ss'.
//      */
//     const timeString = now.toTimeString().split(' ')[0];
//
//
//     return (
//         <Box borderRadius="sm" borderWidth={0} pt={3} pb={3}>
//             <VStack space={2}>
//                 <Text fontSize={"xs"} fontStyle={"italic"}>{dateString} {timeString}</Text>
//                 <HStack w="100%" justifyContent={"space-between"}>
//                     <HStack alignItems={"center"} space={1}>
//                         <Ionicons name={"heart"} color={'#FF4370'} size={15}/>
//                         <Text>HR (BPM)</Text>
//                     </HStack>
//                     <Text>{hr}</Text>
//                 </HStack>
//                 <HStack w="100%" justifyContent={"space-between"}>
//                     <HStack alignItems={"center"} space={1}>
//                         <Ionicons name={'reader'} color={'#2785F4'} size={15} />
//                         <Text>SDNN</Text>
//                     </HStack>
//                     <Text>{parseFloat(sdnn).toFixed(2)}</Text>
//                 </HStack>
//                 <HStack w="100%" justifyContent={"space-between"}>
//                     <HStack alignItems={"center"} space={1}>
//                         <Ionicons name={'flash'} color={'#FF6B18'} size={15}/>
//                         <Text>Stress Level</Text>
//                     </HStack>
//                     <Text>{`0`}{stressIndex}</Text>
//                 </HStack>
//             </VStack>
//         </Box>
//     );
// }
