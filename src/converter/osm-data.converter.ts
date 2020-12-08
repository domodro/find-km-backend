import config from "../config/config.json";
import { ClassificationData } from "../model/classification.model";
import { OSMData } from "../model/osm.model";
import { Point, RoadClass, RoadInfo } from "../model/point.model";

export interface IOSMDataConverter {
    convertData(data: OSMData): Array<Point>;
}

export class OSMDataConverter implements IOSMDataConverter {

    private classificationData: Array<ClassificationData>;

    constructor() {
        this.classificationData = config.roads
            .map(road => new ClassificationData(new RegExp(road.regex), RoadClass[road.roadClass]));
    }

    convertData(data: OSMData): Array<Point> {
        return data.elements
            .filter(element => element.tags.ref)
            .map(element => new Point(
                element.id,
                element.lat,
                element.lon,
                this.convertRoadInfo(element.tags.ref),
                +element.tags.distance)
            ).filter(point => point.road);
    }

    private convertRoadInfo(value: string): RoadInfo | undefined {
        let names = value.split(config.osm.separator);
        let classification = this.classifyRoad(names[0]);
        return classification && new RoadInfo(names, classification) || undefined;
    }

    private classifyRoad(name: string): RoadClass | undefined {
        let road = this.classificationData
            .find(road => road.regex.test(name));
        return road && road.classification || undefined;
    }
}
