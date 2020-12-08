import config from "../config/config.json";
import { ClassificationData } from "../model/classification.model";
import { OSMData, OSMElement } from "../model/osm.model";
import { Point, RoadClassification, RoadInfo } from "../model/point.model";

export interface IOSMDataConverter {
    convertData(data: OSMData): Array<Point>;
}

export class OSMDataConverter implements IOSMDataConverter {

    private classificationData: Array<ClassificationData>;

    constructor() {
        this.classificationData = config.roads
            .map(road => new ClassificationData(new RegExp(road.regex), RoadClassification[road.classification]));
    }

    convertData(data: OSMData): Array<Point> {
        return data.elements
            .filter(this.filterIncompleteElements)
            .map(element => new Point(
                element.id,
                element.lat,
                element.lon,
                this.convertRoadInfo(element.tags.ref),
                +element.tags.distance)
            ).filter(point => point.road);
    }

    private filterIncompleteElements(element: OSMElement): boolean {
        return element.id && element.lat
            && element.lon && element.tags
            && element.tags.distance && element.tags.ref
            && true || false;
    }

    convertRoadInfo(value: string): RoadInfo | undefined {
        let names = value.split(config.osm.separator);
        let classification = this.classifyRoad(names[0]);
        return classification && new RoadInfo(names, classification) || undefined;
    }

    private classifyRoad(name: string): RoadClassification | undefined {
        let road = this.classificationData
            .find(road => road.regex.test(name));
        return road && road.classification || undefined;
    }
}
