import React, {useEffect, useMemo, useState} from 'react';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import {View, Actionsheet, useDisclose, Button, Text, VStack, Center, Box} from "native-base";
import {Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";



const CalendarList_Actionsheet = ({isOpen, onClose, onOpen, dateRanges,}) => {
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const [clickCount, setClickCount] = useState(0);
    const [noClick, setNoClick] = useState(true);

    const todayDate = () => {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dateOfMonth = date.getDate();

        return `${year}-${month}-${dateOfMonth}`
    };
    const renderArrow = (direction) => {
        const arrowIcon = direction === "left" ? <Octicons name={"chevron-left"} size={25} color={"black"} /> :
            <Octicons name={"chevron-right"} size={25} color={"black"} />;

        return (
            <View style={{ paddingVertical: 10, alignItems: 'center', }}>
                {arrowIcon}
            </View>
        );
    };

    const selectedDateRange = (StartDate, EndDate) => {
        const dates = [];
        let currentDate = new Date(StartDate);

        while (currentDate <= new Date(EndDate)) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // dates.shift(); // 시작 날짜 제외
        // dates.pop(); // 끝나는 날짜 제외
        return dates;
    };

    const finalSelectedDates = selectedDateRange(selectedStartDate, selectedEndDate);

    const markedSelectedDates = {
        ...finalSelectedDates.reduce((acc, date, index) => {
            acc[date] = {
                selected: true,
                color: '#b0d0f8',
                textColor: 'black',
                key: index.toString(),
            };
            return acc;
        }, {}),
        [selectedStartDate]: {
            startingDay: true, color: '#2785F4', textColor: 'white',
            key: "start",
        },
        [selectedEndDate]: {
            endingDay: true, color: '#2785F4', textColor: 'white',
            key: "end",
        }
    };
    console.log("선택한 시작 날짜 :", selectedStartDate);
    console.log("선택한 끝나는 날짜 :", selectedEndDate);
    console.log("선택한 날짜 범위 :", finalSelectedDates);


    const onDayPress = (day) => {
        if (clickCount === 0) {
            // 첫 번째 클릭 시
            setSelectedStartDate(day.dateString);
            setSelectedEndDate();
            setClickCount(1);
        } else if (clickCount === 1) {
            // 두 번째 클릭 시
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(day.dateString);

            if (endDate > startDate) {
                const differenceInDays = Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24));

                if (differenceInDays <= 4) {
                    setSelectedEndDate(day.dateString);
                    setClickCount(0);
                    setNoClick(false);
                } else {
                    alert("최대 5일까지 검색이 가능합니다.");
                }
            } else {
                // Swap start and end dates
                setSelectedStartDate(day.dateString);
                setSelectedEndDate(startDate.toISOString().split('T')[0]);
                setClickCount(0);
                setNoClick(false);
            }
        }
    };


    LocaleConfig.locales['fr'] = {
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
        dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        dayNamesShort: ['월', '화', '수', '목', '금', '토', '일'],
        today: "today"
    };
    LocaleConfig.defaultLocale = 'fr';


    const handleSubmitDateRange = () => {
        console.log("확인 버튼 - 날짜 범위가 선택 되었습니다.")
        if (noClick === false) {
            // setClickCount(0);
            onClose();
            dateRanges(finalSelectedDates);
        } else {
            alert("날짜를 선택해주세요.")
        }
    };


    const handleOnClose = () => {
        console.log("날짜 선택 없이 ActionSheet가 닫혔습니다. dateRange :" )
        onClose();
    };


    return (
        // <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        //     <Actionsheet.Content backgroundColor={'white'}>

                    <VStack width={"100%"}>
                        <Center marginTop={3}>
                        <Text fontSize={20} fontWeight={700}>날짜 선택</Text>
                        </Center>

            <CalendarList
                style={styles.calendarlist}
                // 캘린더 내 스타일 수정
                theme={styles.theme}
                current={todayDate()}
                markingType={"period"}
                markedDates={markedSelectedDates}
                onDayPress={onDayPress}
                onVisibleMonthsChange={(months) => {console.log('보고 있는 달력 월', months);}}
                monthFormat={"yyyy년 MM월"}
                pastScrollRange={12}
                futureScrollRange={1}
                scrollEnabled={true}
                horizontal={true}
                pagingEnabled={true}
                hideArrows={false}
                renderArrow={renderArrow}
                // disabledDaysIndexes={[0]}
                hideExtraDays={false}

            />

                        <Center mb={4} mt={2}>
                        <Box width={"92%"}>
                            <Button bg={"#2785F4"} onPress={handleSubmitDateRange}>
                                <Text fontWeight={800} fontSize={'18px'} color={"white"}>확인</Text>
                            </Button>
                        </Box>
                        </Center>
                    </VStack>


    );
};

export default React.memo(CalendarList_Actionsheet);

const styles = StyleSheet.create({
    calendarlist : {
        marginTop: 0,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
    },
    theme : {
        todayTextColor: 'red',
        textDayFontSize: 16,
        textDayFontWeight: 'bold',
        textMonthFontSize: 18,
        textMonthFontWeight: 'bold',
        textSectionTitleColor: 'rgba(138, 138, 138, 1)',
        // dayTextAtIndex1: { color: 'red' },
    }
})
