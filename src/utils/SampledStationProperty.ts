import {Period} from "./datetime";

export type Station = {
    period: Period;
    info: string;
}

export class SampledStationProperty {
    samples: Station[]

    constructor(samples?: Station[]) {
        this.samples = samples || [];
    }

    addSample(period: Period, info: string) {
        this.samples.push({
            period: period,
            info: info
        })
    }

    getValue(time: Date): string | null {
        const foundSample = this.samples.find(sample => sample.period.contains(time));
        return foundSample ? foundSample.info : null;
    }
}


