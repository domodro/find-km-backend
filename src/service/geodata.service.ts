import { getDistance } from "geolib";
import { Pair } from "../model/auxiliary.model";
import { Point } from "../model/point.model";
import { IOSMDataService } from "./osm.service";

export interface IGeoDataService {
    findNearest(latitude: number, longitude: number): Point | undefined;

    findPoint(name: string, mileage: number): Point | undefined;
}

export class GeoDataService implements IGeoDataService {

    constructor(private dataService: IOSMDataService) {
    }

    findNearest(latitude: number, longitude: number): Point | undefined {
        let currentPoint = { 'latitude': latitude, 'longitude': longitude };

        let nearestPoint = this.dataService.data.map(value => new Pair(getDistance(currentPoint, value), value))
            .find(pair => pair.distance < 500);
        return nearestPoint && nearestPoint.point || undefined;
    }

    findPoint(road: string, mileage: number): Point | undefined {
        return this.dataService.data
            .find(point => point.road.names.includes(road) && point.mileage === mileage);
    }
}
