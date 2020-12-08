import express, { Express } from 'express';
import config from './config/config.json';
import { OSMDataService } from './service/osm.service';

class App {

  private server: Express;
  private osmDataService: OSMDataService = new OSMDataService();

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
