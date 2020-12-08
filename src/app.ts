import express, { Express } from 'express';
import config from './config/config.json';
import { IOSMDataConverter, OSMDataConverter } from './converter/osm-data.converter';
import { Point } from './model/point.model';
import { GeoDataService, IGeoDataService } from './service/geodata.service';
import { IOSMDataService, OSMDataService } from './service/osm.service';

class App {

  private dataConverter: IOSMDataConverter = new OSMDataConverter();
  private osmDataService: IOSMDataService = new OSMDataService(this.dataConverter);

  private geoData: IGeoDataService = new GeoDataService(this.osmDataService);

  private server: Express;

  constructor() {
    this.server = express();
    this.initialize();
    this.server.listen(config.app.port);
  }

  private initialize(): void {
    this.server.get('/find/mileage/:latitude/:longitude/', (request, response) => {
      let point: Point = this.geoData.findNearest(+request.params['latitude'], +request.params['longitude']);
      response.statusCode = point && 200 || 404;
      response.send(point);
    });
    this.server.get('/find/point/:road/:mileage/', (request, response) => {
      let point: Point = this.geoData.findPoint(request.params['road'], +request.params['mileage']);
      response.statusCode = point && 200 || 404;
      response.send(point);
    });
  }
}

new App();
