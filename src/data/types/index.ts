import {Coord} from "@turf/turf";

/**
 * Railway
 */
export type Railway = {
    uid: number,
    startNodeId: string,
    endNodeId: string,
    coordinates: Coord[],
}

export type RailwayInfo = {
    line: string,
    railways: Railway[],
}

/**
 * Timetable
 */
export type Timetable = {
    uid: number,
    arriveTime: string,
    departTime: string,
    stationNm: string,
    stationCd: string,
    nodeId: string,
    originStation: number,
    weekTag: number
}

export type Train = {
    trainNo: string,
    timetables: Timetable[]
}

export type TimetablesInfo = {
    line: string,
    trains: Train[]
}
