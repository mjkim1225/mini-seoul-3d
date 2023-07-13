import trains, { trainsWorker } from './train';
// @ts-ignore
import {Viewer} from '@types/cesium';

import getSplitRailways from "../data/splitRailways";
import getTimetable from "../data/timetables";

import getRailways from "./railways";
import map from "../map";
import * as Cesium from "cesium";
import {SampledStationProperty} from "../utils/SampledStationProperty";
import {SampledBearingProperty} from "../utils/SampledBearingProperty";
import {Period} from "../utils/datetime";

export default (viewer: Viewer) => {
    async function main() {

        const [railwaysInfo, timetablesInfo] = await Promise.all([
            getSplitRailways(),
            getTimetable()
        ]);

        const dataSet = trains(railwaysInfo, timetablesInfo); // worker 생성
        dataSet.map(data => {
                const worker = new Worker(new URL('../worker/trainWorker2.js', import.meta.url), {
                    type: 'module',
                })

                worker.onmessage = function (event) {
                    console.log(line, "바깥시작", new Date());
                    const entities = event.data;
                    // 워커 결과 처리
                    const datasource = map.findDataSourceByName(map.DATASOURCE_NAME.TRAIN);
                    entities.map(entity => {
                        const entityPosition =  new Cesium.SampledPositionProperty();
                        const entityStation = new SampledStationProperty();
                        const entityBearing = new SampledBearingProperty();

                        entity.positions.map(position => {
                            const time = Cesium.JulianDate.fromDate(new Date(position.time));
                            const point = Cesium.Cartesian3.fromDegrees(position.location[0], position.location[1])
                            entityPosition.addSample(time, point);
                        })

                        entity.stations.map(station => {
                            entityStation.addSample( new Period(station.startDatetime, station.endDatetime), station.info);
                        })

                        entity.angles.map(angle => {
                            entityBearing.addSample( new Period(angle.startDatetime, angle.endDatetime), angle.angle);
                        })
                        const newEntity = {
                            id: entity.trainNo,
                            position: entityPosition,
                            orientation: new Cesium.VelocityOrientationProperty(entityPosition),
                            description: {
                                'station': entityStation,
                                'bearing': entityBearing,
                            },
                            model: {
                                uri: `./data/${line}.glb`,
                                scale: new Cesium.CallbackProperty(map.getSizeByZoom, false),
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                            },
                        };
                        datasource.entities.add(newEntity);
                    });

                    console.log(line, "바깥끝", new Date());
                    // 워커 결과 처리
                };

                const { line, trains, railways } = data;
                worker.postMessage({ line, trains, railways });
        })
    }

    main();
    getRailways(viewer);
}

