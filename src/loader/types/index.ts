// @ts-ignore
import JulianDate from '@types/cesium';
import {Coord} from "@turf/turf";

type TrainInfo = {
    lineData: Coord[],
    startDatetime: JulianDate,
    endDatetime: JulianDate,
}
