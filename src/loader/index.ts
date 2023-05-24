import trains, { trainsWorker } from './train.ts';
import {Viewer} from '@types/cesium';
import * as Cesium from 'cesium';

import loadRailways from "../data/railways.ts";
import loadTimetable from "../data/timetables.ts";

export default (viewer: Viewer) => {
    async function main() {

        const [railwaysInfo, timetablesInfo] = await Promise.all([
            loadRailways(),
            loadTimetable()
        ]);
        /**
         * railways 는..
         * 출발역, 도착역, 그리고 line data 가 있어야한다.
         * timetable 은 출발역+출발시간, 도착역+도착시간 이 있어야 한다.
         */

        const dataSet = trains(railwaysInfo, timetablesInfo); // worker 생성
        trainsWorker(viewer, dataSet[0]);


    }

    console.log("loader");

    main();
    // if (isMainThread) {
    //     main();
    // } else {
    //     trainsWorker(dataSet[0]);
    // }

}
