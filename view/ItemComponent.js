import React from "react";
import {Box, HStack, Progress, Text, VStack} from "native-base";

/**
 * Represents an item component that displays stress index, sdnn, and heart rate.
 *
 * @param {number} stressIndex - The stress index value.
 * @param {number} sdnn - The SDNN value.
 * @param {number} hr - The heart rate value.
 * @returns {JSX.Element} - The rendered item component.
 */
export const ItemComponent = ({stressIndex, sdnn, hr}) => {
    /**
     * Represents the current date and time.
     *
     * @type {Date}
     */
    const now = new Date();

    /**
     * Converts the current date to a string in the format yyyy-mm-dd.
     *
     * @returns {string} The string representation of the current date in yyyy-mm-dd format.
     */
    const dateString = now.toISOString().split('T')[0];

    /**
     * Retrieves the current time as a string and extracts the first part
     * of the time string.
     *
     * @returns {string} The first part of the time string in the format 'hh:mm:ss'.
     */
    const timeString = now.toTimeString().split(' ')[0];


    return (
        <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
            <VStack>
                <Text fontWeight={'bold'}>{dateString} {timeString}</Text>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>HR (BPM)</Text>
                    <Progress flex={1} colorScheme="secondary" shadow={0} value={hr} min={0} max={200}/>
                    <Text w={"10%"} textAlign={'right'}>{hr}</Text>
                </HStack>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>SDNN</Text>
                    <Progress flex={1} colorScheme="secondary" shadow={0} value={sdnn} min={0} max={300}/>
                    <Text w={"10%"} textAlign={'right'}>{parseFloat(sdnn).toFixed(2)}</Text>
                </HStack>
                <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                    <Text w={"30%"}>Stress Level</Text>
                    <Progress flex={1} colorScheme={"emerald"} shadow={0} value={stressIndex} min={0} max={5}/>
                    <Text w={"10%"} textAlign={'right'}>{stressIndex}</Text>
                </HStack>
            </VStack>
        </Box>
    );
}
