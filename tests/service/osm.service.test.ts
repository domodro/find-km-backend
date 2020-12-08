import { expect } from "chai";
import nock from 'nock';
import config from "../../src/config/config.json";
import { IOSMDataConverter } from "../../src/converter/osm-data.converter";
import { OSMData } from "../../src/model/osm.model";
import { Point } from "../../src/model/point.model";
import { OSMDataService } from "../../src/service/osm.service";
import ConvertedResponse from "../mocked-responses/converted-response.json";
import OSMResponse from "../mocked-responses/osm-response.json";

class OSMDataConverterMock implements IOSMDataConverter {

    points: Array<Point>;

    inputData: OSMData;

    convertData(data: OSMData): Array<Point> {
        this.inputData = data;
        return this.points;
    }
}

let dataConverter: OSMDataConverterMock;
let dataService: OSMDataService;

describe('OSMDataService', () => {
    beforeEach(() => {
        dataConverter = new OSMDataConverterMock();
        dataService = new OSMDataService(dataConverter);
    });

    describe('#getData', () => {
        it('should download data from osm', () => {
            // given
            nock(`${config.osm.host}`)
                .post(config.osm.path, config.osm.query)
                .reply(200, OSMResponse);
            let pointArray: Array<Point> = ConvertedResponse as Array<Point>;
            dataConverter.points = pointArray;

            // when
            let resultPromise: Promise<Array<Point>> = dataService.getData();

            // then
            resultPromise.then(result => {
                expect(result).to.equal(pointArray);
            });
        });
    });
});
