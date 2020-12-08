
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
        public roadClass: RoadClass
    ) {
    }
}

export enum RoadClass {
    HIGHWAY = "HIGHWAY",
    EXPRESSWAY = "EXPRESSWAY",
    NATIONAL = "NATIONAL",
    REGIONAL = "REGIONAL",
    DISTRICT = "DISTRICT"
}
