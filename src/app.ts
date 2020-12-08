import express, { Express } from 'express';
import config from './config/config.json';
import { OSMDataConverter } from './converter/osm-data.converter';
import { OSMDataService } from './service/osm.service';

class App {

  private dataConverter: OSMDataConverter = new OSMDataConverter();
  private osmDataService: OSMDataService = new OSMDataService(this.dataConverter);
  private server: Express;

  constructor() {
    this.server = express();
    this.initialize();
    this.server.listen(config.app.port);
  }

  private initialize(): void {
    this.server.get('/test', (request, response) => {
      response.send(this.osmDataService.data);
    });
  }
}

new App();
