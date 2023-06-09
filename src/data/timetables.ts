import {TimetablesInfo} from "./types";


export default async function(): Promise<TimetablesInfo[]> {

    const data = await fetch('dataTmp/timetables.json').then(res => res.json());

    return data;

}
