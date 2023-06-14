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
    arrive: string,
    depart: string,
    name: string,
    node: string
}

export type Train = {
    trainNo: string,
    inout: number,
    week: number
    timetables: Timetable[]
}

export type TimetablesInfo = {
    line: string,
    trains: Train[]
}
