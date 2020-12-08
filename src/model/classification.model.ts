import { RoadClass } from "./point.model";

export class ClassificationData {

    constructor(
        public regex: RegExp,
        public classification: RoadClass
    ) {
    }
}
