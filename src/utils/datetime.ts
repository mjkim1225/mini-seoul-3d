import * as Cesium from 'cesium';

export const getTodayWithTime = (timeString: string) => {
    // ex time "08:10:05"
    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const dateWithTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
    return dateWithTime;
}
export const plus9hours = (jsDate: Date) => {
    jsDate.setHours(jsDate.getHours() + 9);
}

export const getJulianDate = (jsDate: Date) => {
    return Cesium.JulianDate.fromDate(jsDate);
}

export class Period {
    startDateTime;
    endDateTime;
    constructor(startDateTime, endDateTime) {
        this.startDateTime = new Date(startDateTime);
        this.endDateTime = new Date(endDateTime);
    }

    contains(dateTime) {
        const date = new Date(dateTime);
        return date >= this.startDateTime && date <= this.endDateTime;
    }
}
