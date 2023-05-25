import { Coord } from '@turf/turf';

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
export default async function(): Promise<RailwayInfo[]> {

    const data = await fetch('dataTmp/split_railways.json').then(res => res.json());

    console.log("split_railways data: ", data);
    return data;
}
