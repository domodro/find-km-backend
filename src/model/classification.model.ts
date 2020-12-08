import { RoadClassification } from "./point.model";

export class ClassificationData {

    constructor(
        public regex: RegExp,
        public classification: RoadClassification
    ) {
    }
}
