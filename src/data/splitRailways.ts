import {RailwayInfo} from "./types";


export default async function(): Promise<RailwayInfo[]> {

    const data = await fetch('dataTmp/split_railways.json').then(res => res.json());

    console.log("split_railways data: ", data);
    return data;
}
