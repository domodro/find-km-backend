
export class Point {

    constructor(
        public id: number,
        public latitude: number,
        public longitude: number,
        public road: RoadInfo,
        public mileage: number
    ) {
    }
}

export class RoadInfo {

    constructor(
        public names: Array<string>,
        public classification: RoadClassification
    ) {
    }
}

export enum RoadClassification {
    HIGHWAY = "HIGHWAY",
    EXPRESSWAY = "EXPRESSWAY",
    NATIONAL = "NATIONAL",
    REGIONAL = "REGIONAL",
    DISTRICT = "DISTRICT"
}
