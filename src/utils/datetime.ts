import * as Cesium from 'cesium';

const getTodayWithTime = (timeString: string) => {
    // ex time "08:10:05"
    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const dateWithTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
    return dateWithTime;
}
const plus9hours = (jsDate: Date) => {
    jsDate.setHours(jsDate.getHours() + 9);
}

const getJulianDate = (jsDate: Date) => {
    return Cesium.JulianDate.fromDate(jsDate);
}



export default {
    getTodayWithTime,
    plus9hours,
    getJulianDate
}
