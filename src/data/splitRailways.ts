import {RailwayInfo} from "./types";


export default async function(): Promise<RailwayInfo[]> {

    const data = await fetch('dataTmp/split_railways.json').then(res => res.json());

    return data;
}
