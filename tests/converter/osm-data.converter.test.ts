import { expect } from "chai";
import { OSMDataConverter } from "../../src/converter/osm-data.converter";
import { OSMData } from "../../src/model/osm.model";
import { Point, RoadClassification } from "../../src/model/point.model";
import ConvertedResponse from "../mocked-responses/converted-response.json";
import OSMIncompleteResponse from "../mocked-responses/osm-incomplete-response.json";
import OSMResponse from "../mocked-responses/osm-response.json";

let dataConverter: OSMDataConverter = new OSMDataConverter();

describe('OSMDataConverter', () => {
    describe('#convertData', () => {
        it('should convert data from osm', () => {
            // given
            let osmData: OSMData = OSMResponse as OSMData;
            let expectedResult: Array<Point> = ConvertedResponse as Array<Point>;

            // when
            let result = dataConverter.convertData(osmData);

            // then
            expect(result).to.eql(expectedResult);
        });

        it('should convert empty data', () => {
            // given
            let osmData = new OSMData();
            osmData.elements = [];

            // when
            let result = dataConverter.convertData(osmData);

            // then
            expect(result).to.be.empty;
        });

        it('should drop incomplete data', () => {
            // given
            let osmData: OSMData = OSMIncompleteResponse as OSMData;

            // when
            let result = dataConverter.convertData(osmData);

            // then
            expect(result).to.be.empty;
        });
    });

    describe('#convertRoadInfo', () => {
        let testData = [
            {roadName: 'A2', expected: {names: ['A2'], classification: RoadClassification.HIGHWAY}},
            {roadName: 'S8;S8e', expected: {names: ['S8', 'S8e'], classification: RoadClassification.EXPRESSWAY}},
            {roadName: '8;17;41', expected: {names: ['8', '17', '41'], classification: RoadClassification.NATIONAL}},
            {roadName: '734e', expected: {names: ['734e'], classification: RoadClassification.REGIONAL}},
            {roadName: '1234G', expected: {names: ['1234G'], classification: RoadClassification.DISTRICT}}
        ];

        testData.forEach(data => {
            it(`should classify ${data.expected.classification} road`, () => {
                // given
                let roadName = data.roadName;
    
                // when
                let result = dataConverter.convertRoadInfo(roadName);
    
                // then
                expect(result).not.null;
                expect(result.names).to.eql(data.expected.names);
                expect(result.classification).to.equal(data.expected.classification);
            });
        });
    });
});
