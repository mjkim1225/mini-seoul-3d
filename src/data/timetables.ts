

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
    line: number,
    trains: Train[]
}

export default async function(): Promise<TimetablesInfo[]> {

    const data = await fetch('dataTmp/timetables.json').then(res => res.json());

    console.log("timetables data: ", data);
    return data;

}
