import { CronJob } from 'cron';
import { ClientRequest } from 'http';
import https, { RequestOptions } from 'https';
import config from '../config/config.json';
import { OSMData } from '../model/osm.model';

export class OSMDataService {

    private job: CronJob;

    data: OSMData;

    constructor() {
        this.fetchData();
        this.job = new CronJob('0 0 4 1 * *', this.fetchData);
        this.job.start();
    }

    private fetchData(): void {
        let options: RequestOptions = {
            method: 'POST',
            host: config.osm.host,
            path: config.osm.path,
            headers: {
                'Content-Length': config.osm.query.length
            }
        };
        console.log('Requesting update of OSM data');
        let request: ClientRequest = https.request(options, response => {
            console.log(`OSM node response: ${response.statusCode} ${response.statusMessage}`);
            let buffers: Array<Buffer> = [];
            response.on('data', (buffer: Buffer) => {
                buffers.push(buffer);
            });
            response.on('end', () => {
                let data = Buffer.concat(buffers);
                this.data = JSON.parse(data.toString());

                console.log('Successfully fetched OSM data');
            });
        });
        request.write(config.osm.query);
        request.end;
    }
}
