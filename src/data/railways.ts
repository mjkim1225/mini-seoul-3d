import { Coord } from '@turf/turf';

export type Railway = {
    uid: number,
    startNodeId: string,
    endNodeId: string,
    coordinates: Coord[],
}

export type RailwayInfo = {
    line: number,
    railways: Railway[],
}
export default async function(): Promise<RailwayInfo[]> {

    const data = await fetch('dataTmp/railways.json').then(res => res.json());

    console.log("railways data: ", data);
    return data;
}
