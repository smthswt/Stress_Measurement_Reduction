import React, {useState} from "react";
import {Box, HStack, Progress, Text, VStack} from "native-base";

/**
 * Represents an item component that displays stress index, sdnn, and heart rate.
 *
 * @param {number} stressIndex - The stress index value.
 * @param {number} sdnn - The SDNN value.
 * @param {number} hr - The heart rate value.
 * @returns {JSX.Element} - The rendered item component.
 */
export const RecordListComponent = () => {
    /**
     * Represents the current date and time.
     *
     * @type {Date}
     */
    const now = new Date();
    const stressIndex = useState(999)
    const hr = useState(999)
    const stressLevel = useState(3)

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
            <VStack space={2} bg={"white"} shadow={2} p={3}>
                <Text fontWeight={'bold'}>{dateString} {timeString}</Text>
                <HStack justifyContent={"space-between"}>
                    <Text>스트레스 인덱스</Text>
                    <Text>{stressIndex}</Text>
                </HStack>
                <HStack justifyContent={"space-between"}>
                    <Text>HR (BPM)</Text>
                    <Text>{hr}</Text>
                </HStack>
                <HStack justifyContent={"space-between"}>
                    <Text>스트레스 레벨</Text>
                    <Text>{stressLevel}</Text>
                </HStack>
            </VStack>
    );
}
