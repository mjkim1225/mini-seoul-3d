import trains, { trainsWorker } from './train';
// @ts-ignore
import {Viewer} from '@types/cesium';

import getSplitRailways from "../data/splitRailways";
import getTimetable from "../data/timetables";

import getRailways from "./railways";
import map from "../map";

export default (viewer: Viewer) => {
    async function main() {

        console.log(new Date())
        const [railwaysInfo, timetablesInfo] = await Promise.all([
            getSplitRailways(),
            getTimetable()
        ]);

        const dataSet = trains(railwaysInfo, timetablesInfo); // worker 생성
        dataSet.map(data => {
            const worker = new Worker("src/worker/trainWorker.js");
            worker.onmessage = function (event) {
                const entities = event.data;
                // 워커 결과 처리
                const datasource = map.findDataSourceByName(map.DATASOURCE_NAME.TRAIN);
                entities.map(entity => {
                    datasource.entities.add(entity);
                });
            };

            const { line, trains, railways } = data;
            worker.postMessage({ line, trains, railways });

        })

        console.log(new Date())
    }

    main();
    getRailways(viewer);
}

