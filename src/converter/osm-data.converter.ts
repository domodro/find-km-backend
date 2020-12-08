import { Point, RoadClass, RoadInfo } from "../model/point.model";
import { OSMData } from "../model/osm.model";
import config from "../config/config.json";

export class OSMDataConverter {

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
