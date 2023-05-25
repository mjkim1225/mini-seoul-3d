import trains, { trainsWorker } from './train.ts';
import * as Cesium from 'cesium';
// @ts-ignore
import {Viewer} from '@types/cesium';

import getSplitRailways from "../data/splitRailways.ts";
import getTimetable from "../data/timetables.ts";

import getRailways from "./railways.ts";

export default (viewer: Viewer) => {
    async function main() {

        const [railwaysInfo, timetablesInfo] = await Promise.all([
            getSplitRailways(),
            getTimetable()
        ]);
        /**
         * railways 는..
         * 출발역, 도착역, 그리고 line data 가 있어야한다.
         * timetable 은 출발역+출발시간, 도착역+도착시간 이 있어야 한다.
         */

        const dataSet = trains(railwaysInfo, timetablesInfo); // worker 생성
        trainsWorker(viewer, dataSet);
    }




    console.log("loader");


    main();
    getRailways(viewer);
}

