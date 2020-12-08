import config from "../config/config.json";
import { OSMData } from "../model/osm.model";
import { Point, RoadClass, RoadInfo } from "../model/point.model";

export interface IOSMDataConverter {
    convertData(data: OSMData): Array<Point>;
}

export class OSMDataConverter implements IOSMDataConverter {

    convertData(data: OSMData): Array<Point> {
        return data.elements
            .map(element => new Point(
                element.id,
                element.lat,
                element.lon,
                this.convertRoadInfo(element.tags.ref),
                +element.tags.distance)
            );
    }

    private convertRoadInfo(value: string): RoadInfo {
        let names = value.split(config.osm.separator);
        return new RoadInfo(
            names,
            this.classifyRoad(names[0])
        )
    }

    private classifyRoad(name: string): RoadClass {
        let className: string = config.roads
            .find(road => new RegExp(road.regex).test(name))
            .roadClass
        return RoadClass[className];
    }
}
