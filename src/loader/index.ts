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

        const dataSet = trains(railwaysInfo, timetablesInfo); // worker 생성
        trainsWorker(viewer, dataSet);
    }

    main();
    getRailways(viewer);
}

