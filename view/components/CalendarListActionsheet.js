import React, {useState} from 'react';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import {View, Actionsheet, useDisclose, Button} from "native-base";
import {Dimensions, SafeAreaView, StyleSheet} from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import {textMonthFontSize} from "react-native-calendars/src/style";


const CalendarList_ActionSheet = ({onOpen, onClose, isOpen}) => {
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const [clickCount, setClickCount] = useState(0);

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
        ...finalSelectedDates.reduce((acc, date) => {
            acc[date] = {
                selected: true,
                color: '#b0d0f8',
                textColor: 'black',
            };
            return acc;
        }, {}),
        [selectedStartDate]: {
            startingDay: true, color: '#2785F4', textColor: 'white',
        },
        [selectedEndDate]: {
            endingDay: true, color: '#2785F4', textColor: 'white',
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
            setSelectedEndDate(day.dateString);
            setClickCount(0);
        }
    };

    // LocaleConfig.locales['fr'] = {
    //     monthNames: [
    //         'Janvier',
    //         'Février',
    //         'Mars',
    //         'Avril',
    //         'Mai',
    //         'Juin',
    //         'Juillet',
    //         'Août',
    //         'Septembre',
    //         'Octobre',
    //         'Novembre',
    //         'Décembre'
    //     ],
    //     monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    //     dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    //     dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    //     today: "Aujourd'hui"
    // };
    // LocaleConfig.defaultLocale = 'fr';

    const handleSubmitDateRange = () => {
        console.log("날짜 범위가 선택 되었습니다.")
    };


    return (
            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <Actionsheet.Content backgroundColor={'white'}>
                    <View width={"100%"} marginBottom={1}>
            <CalendarList
                style={{ marginTop: 10, width: Dimensions.get('window').width, alignSelf: 'center', }}
                // 캘린더 내 스타일 수정
                theme={{
                    todayTextColor: 'red',
                    textDayFontSize: 20,
                    textDayFontWeight: 'bold',
                    textMonthFontSize: 20,
                    textMonthFontWeight: 'bold',
                    textSectionTitleColor: 'rgba(138, 138, 138, 1)',
                    // dayTextAtIndex1: { color: 'red' },

                }}
                markingType={"period"}
                markedDates={markedSelectedDates}
                onDayPress={onDayPress}
                onVisibleMonthsChange={(months) => {console.log('보이는 달력 월', months);}}
                monthFormat={"yyyy년 MM월"}
                pastScrollRange={12}
                futureScrollRange={12}
                scrollEnabled={true}
                horizontal={true}
                pagingEnabled={true}
                hideArrows={false}
                renderArrow={renderArrow}
                // disabledDaysIndexes={[0]}
                hideExtraDays={false}


            />
                    </View>
                    
                    <Button onPress={handleSubmitDateRange} mb={1}>
                        확인
                    </Button>

                </Actionsheet.Content>
            </Actionsheet>
    );
};

export default CalendarList_ActionSheet;

//
// const styleSheet.create()
