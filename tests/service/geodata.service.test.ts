import { expect } from "chai";
import { Point, RoadClassification } from "../../src/model/point.model";
import { GeoDataService } from "../../src/service/geodata.service";
import { IOSMDataService } from "../../src/service/osm.service";
import ConvertedResponse from "../mocked-responses/converted-response.json";

class OSMDataServiceMock implements IOSMDataService {
    
    data: Array<Point>;
}

let dataService: OSMDataServiceMock;
let geoDataService: GeoDataService;

describe('GeoDataService', () => {
    beforeEach(() => {
        dataService = new OSMDataServiceMock;
        geoDataService = new GeoDataService(dataService);
    });

    describe('#findNearest', () => {
        it('should find exactly located point', () => {
            // given
            dataService.data = ConvertedResponse as Array<Point>;
            let latitude = 51.6331842;
            let longitude = 19.4334846;

            // when
            let result = geoDataService.findNearest(latitude, longitude);

            // then
            expect(result).not.undefined;
            expect(result.id).be.equal(3085458894);
            expect(result.latitude).be.equal(51.6331842);
            expect(result.longitude).be.equal(19.4334846);
            expect(result.mileage).be.equal(223);
            expect(result.road).be.not.undefined;
            expect(result.road.classification).be.equal(RoadClassification.EXPRESSWAY);
            expect(result.road.names).be.eql(['S8', 'S8e']);
        });

        it('should find point located between existing points', () => {
            // given
            dataService.data = ConvertedResponse as Array<Point>;
            let latitude = 51.6611;
            let longitude = 19.4688;

            // when
            let result = geoDataService.findNearest(latitude, longitude);

            // then
            expect(result).not.undefined;
            expect(result.id).to.be.null;
            expect(result.latitude).be.equal(51.6611);
            expect(result.longitude).be.equal(19.4688);
            expect(result.mileage).be.equal(51.6);
            expect(result.road).be.not.undefined;
            expect(result.road.classification).be.equal(RoadClassification.NATIONAL);
            expect(result.road.names).be.eql(['71']);
        });

        it('should return undefined when is not near to the road ', () => {
            // given
            dataService.data = ConvertedResponse as Array<Point>;
            let latitude = 51.6572;
            let longitude = 19.5143;

            // when
            let result = geoDataService.findNearest(latitude, longitude);

            // then
            expect(result).to.be.undefined;
        });
    });

    describe('#findPoint', () => {
        it('should find correctly defined point', () => {
            // given
            dataService.data = ConvertedResponse as Array<Point>;
            let roadName = 'A1';
            let mileage = 322;

            // when
            let result = geoDataService.findPoint(roadName, mileage);

            // then
            expect(result).not.undefined;
            expect(result.id).be.equal(4548582240);
            expect(result.latitude).be.equal(51.6557044);
            expect(result.longitude).be.equal(19.5798153);
            expect(result.mileage).be.equal(322);
            expect(result.road).be.not.undefined;
            expect(result.road.classification).be.equal(RoadClassification.HIGHWAY);
            expect(result.road.names).be.eql(['A1']);
        });

        it('should return undefined for incorrect point', () => {
            // given
            dataService.data = ConvertedResponse as Array<Point>;
            let roadName = 'unknown';
            let mileage = -1;

            // when
            let result = geoDataService.findPoint(roadName, mileage);

            // then
            expect(result).to.be.undefined;
        });
    });
});
