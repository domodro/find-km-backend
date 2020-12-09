import { getDistance } from "geolib";
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
        let currentPoint = new Point(null, latitude, longitude, null, null);
        let nearestPoints = this.dataService.data
            .filter(point => getDistance(currentPoint, point) < 700);
        let nearestPoint = nearestPoints
            .find(point => getDistance(currentPoint, point) < 100);
        return nearestPoint || this.calculatePoint(currentPoint, nearestPoints);
    }

    findPoint(road: string, mileage: number): Point | undefined {
        return this.dataService.data
            .find(point => point.road.names.includes(road) && point.mileage === mileage);
    }

    private calculatePoint(currentPoint: Point, nearestPoints: Array<Point>): Point | undefined {
        if (nearestPoints.length < 2) {
            return nearestPoints.find(point => point);
        }
        let bestPoint = Array.from(this.groupPointsByRoad(nearestPoints).values())
            .sort((first, second) => first.length - second.length)
            .pop()
            .sort((first, second) => first.mileage - second.mileage)
            .find(point => point);
        return new Point(null,
            currentPoint.latitude,
            currentPoint.longitude,
            bestPoint.road,
            bestPoint.mileage + Math.round(getDistance(currentPoint, bestPoint) / 100) / 10
        );
    }

    private groupPointsByRoad(nearestPoints: Array<Point>): Map<string, Array<Point>> {
        return nearestPoints.reduce((map: Map<string, Array<Point>>, point: Point) => {
            let name = point.road.names[0];
            let points = map.has(name) && map.get(name) || [];
            points.push(point);
            map.set(name, points)
            return map;
        }, new Map());
    }
}
