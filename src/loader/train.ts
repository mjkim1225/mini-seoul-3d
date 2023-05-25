import * as Cesium from 'cesium';
// @ts-ignore
import {Cartesian3, Entity, Viewer, JulianDate} from '@types/cesium';
import * as Turf from '@turf/turf';
import {Units} from "@turf/helpers";
import {Railway, RailwayInfo} from "../data/splitRailways.ts";
import {TimetablesInfo, Train} from "../data/timetables.ts";

import trainColor from "../data/trainColor.ts";

const accDistance: number = 0.4;
const sampleUnitSec = 1;
const options: { units?: Units } = {units: 'kilometers'};

type DataSet = {
    line?: number,
    railways?: Railway[],
    trains?: Train[]
}

const getDistance = (start: Turf.Coord, end: Turf.Coord) => {
    start = Turf.getCoord(start);
    end = Turf.getCoord(end)
    const from = Turf.point(start);
    const to = Turf.point(end);
    return Math.round(Turf.distance(from, to, options) * 1000) / 1000
}

//1. 시간 구하는 함수 (param: 거리:km, 속도:km/h)
const getDuration = (distance: number, velocity: number) => {
    return distance / velocity; //h
}

const makeTimeSample = (numberOfSamples: number, startDatetime: JulianDate, totalSeconds: number) => {
    let timeList = []
    for (let i = 0; i < numberOfSamples; i++) {
        const factor = i / numberOfSamples;
        const time = Cesium.JulianDate.addSeconds(
            startDatetime,
            factor * totalSeconds,
            new Cesium.JulianDate()
        );

        timeList.push(time);
    }
    return timeList;
}

const getVelocity = (accDistance: number, noAccDistance: number, elapsedSec: number) => {
    /*
      Distance unit : km !!!!

      elapsedSec == accSec + noAccSec
      accSec = elapsedSec - noAccSec
      velocity == (accDistance/accSec)*2 == noAccDistance/noAccSec
                ==  (accDistance/(elapsedSec - noAccSec))*2

      accSec == (2 * accDistance * elapsedSec) / (noAccDistance + 2 * accDistance)
    */
    const accSec = (2 * accDistance * elapsedSec) / (noAccDistance + 2 * accDistance)
    const noAccSec = elapsedSec - accSec;

    const velocity = (noAccDistance / noAccSec) * 3600 // km/h
    return velocity;
}


const pickCartesianPoint = (cartesian3: Cartesian3) => {
    const entity: Entity = { // 결과포인트 100m 지점
        position: cartesian3,
        point: {
            color: Cesium.Color.RED,
            pixelSize: 8,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
    };
    return entity
}


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


export default (railwaysInfo: RailwayInfo[], timetablesInfo: TimetablesInfo[]) => {
    const lines = ["line1", "line2", "line3", "line4", "line5", "line6", "line7"]

    const dataSet: DataSet[] = [];

    lines.map(line => {
        const data: DataSet = {};
        data.line = line;
        railwaysInfo.map(r => {
            if (r.line === line) data.railways = r.railways;
        })
        timetablesInfo.map(t => {
            if (t.line === line) data.trains = t.trains;
        })
        dataSet.push(data);
    })

    // dataSet.map(data =>
    //     new Promise(resolve => {
    //         const worker = new Worker(__filename, {workerData: {
    //                 data
    //             }});
    //
    //         worker.on('message', resolve);
    //     })
    // )
    return dataSet;

    console.log(dataSet);
}

const trainEntityCollection = new Cesium.EntityCollection();

export function trainsWorker(viewer: Viewer, dataSet: DataSet[]) {

    for(let data of dataSet) {
        const line = data.line;
        const trains = data.trains;
        const railways = data.railways;

        if(!trains) continue;

        for(let train of trains) {
            let entity = trainEntityCollection.getById(train.trainNo);
            if(entity) trainEntityCollection.remove(entity);
            if(railways) makeTrainEntity(viewer, line, train, railways);
        }
    }
}

const makeTrainEntity = (viewer: Viewer, line: string, train: Train, railways: Railway[]) => {

    const timetable = train.timetables;

    //1. entity 만들기
    const entityPosition =  new Cesium.SampledPositionProperty();

    let noRailway = false;
    //2. 시간과 속도, 가속도 계산
    timetable.forEach((node, index, array) => {
        const startNode = node;
        const endNode = array[index+1];
        if(!endNode) return;

        // 노드아이디가 여러개 이기 때문에 코드가 안맞을 수 있음. (ex 구로) //TODO 서버에서 날라오는 데이터에따라서 필요 없을 수도 있음
        let railway = railways?.find(railway => railway.startNodeId===startNode.nodeId && railway.endNodeId===endNode.nodeId);

        if(!railway) {
            railway = railways?.find(railway => railway.startNodeId===endNode.nodeId && railway.endNodeId===startNode.nodeId)

            if(!railway) {
                noRailway = true;
                console.log(`There is no railway info ${train.trainNo} : [${startNode.stationNm} (${startNode.nodeId}) -> ${endNode.stationNm} (${endNode.nodeId})]`)
                return;;
            }else{
                railway.coordinates.reverse();
            }
        }

        const railwayCoords = railway?.coordinates;

        const startDatetime = getTodayWithTime(startNode.departTime);
        const endDatetime = getTodayWithTime(endNode.arriveTime)
        plus9hours(startDatetime);
        plus9hours(endDatetime);
        const startJulianDate = getJulianDate(startDatetime);
        const endJulianDate = getJulianDate(endDatetime);
        const totalElapsedSec = Cesium.JulianDate.secondsDifference(endJulianDate, startJulianDate);

        const feature = Turf.lineString(railwayCoords)
        const reversedLine = [...railwayCoords].reverse();
        const reversedFeature = Turf.lineString(reversedLine)

        // 시작지점(속도증가), 속도증가종료지점, -----[속도일정]-----, 속도감소시작지점, 종료지점
        const accUpEndPoi = Turf.getCoord(Turf.along(feature, accDistance));
        const accDownStartPoi = Turf.getCoord(Turf.along(reversedFeature, accDistance));

        // 등속도 구간의 거리
        const noAccDistance = Math.round((getDistance(accUpEndPoi, accDownStartPoi))*1000)/1000
        // 최고속도
        const velocity = getVelocity(accDistance*2, noAccDistance, totalElapsedSec); // km/h
        // 등가속도 구간괴 등속도 구간의 소요시간
        const accElapsedSec = getDuration(accDistance, velocity/2) * 60 * 60 // 평균속도 velocity/2 (0 ~ velocity)
        // 가속도
        const accVelocity = ((velocity * 1000 /3600) / accElapsedSec) / 1000 * 3600; // km/h^2

        // 3. 샘플 구하기
        const accUpFeature = Turf.lineSliceAlong(feature, 0, accDistance);
        const noAccFeature = Turf.lineSlice(Turf.point(accUpEndPoi), Turf.point(accDownStartPoi), feature);

        let locationList = [];
        // - 1 구간 구하기
        const distanceList = [];
        let distance = 0;
        let length = Turf.length(accUpFeature);
        let i = 0;
        while(distance < length) {
            const sec = i++ * sampleUnitSec;
            distance = (1 / 2) * accVelocity * (((sec) * (sec)) / 3600); //km
            distanceList.push(distance);

            const poi = Turf.getCoord(Turf.along(feature, distance));
            locationList.push(poi);
        }

        // - 2 구간 구하기
        length = length + Turf.length(noAccFeature);
        const gap = distanceList[distanceList.length - 1] - distanceList[distanceList.length - 2];
        while(distance < length) {
            distance = distance + gap;
            const poi = Turf.getCoord(Turf.along(feature, distance));
            locationList.push(poi);
        }

        // - 3 구간 구하기
        distanceList.reverse();
        length = Turf.length(feature);
        i = 0;
        while(distance < length) {
            const gap = (distanceList[i++] - distanceList[i])
            distance = distance + gap;
            const poi = distance ? Turf.getCoord(Turf.along(feature, distance)): Turf.getCoords(feature).reverse()[0];
            locationList.push(poi);
        }

        // - timesample
        const timeSampleList = makeTimeSample(locationList.length, startJulianDate, totalElapsedSec);

        let j = 0;
        for(let time of timeSampleList) {
            if( j !== 0) {
                const location = locationList[j];
                entityPosition.addSample(time, (new Cesium.Cartesian3.fromDegrees(location[0], location[1])));
            }
            j++;
        }
    });
    if (noRailway) {
        console.log(`${train.trainNo}: no railway info`); return;
    }

    // console.log(`${train.trainNo}: ${train.timetables[0].departTime} ~ ${train.timetables[train.timetables.length-1].arriveTime}`)

    viewer.entities.add({
        id: train.trainNo,
        position: entityPosition,
        orientation: new Cesium.VelocityOrientationProperty(entityPosition), // Automatically set the vehicle's orientation to the direction it's facing.
        box: {
            dimensions: new Cesium.Cartesian3(500,250,250),
            fill: true,
            material: Cesium.Color.fromCssColorString(trainColor[line]),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },

        // label: {
        //     text: train.trainNo
        // },
    });
}
