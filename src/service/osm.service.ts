import axios, { AxiosResponse } from 'axios';
import { CronJob } from 'cron';
import config from '../config/config.json';
import { IOSMDataConverter } from '../converter/osm-data.converter';
import { OSMData } from '../model/osm.model';
import { Point } from '../model/point.model';

export interface IOSMDataService {
    data: Array<Point>;
}

export class OSMDataService implements IOSMDataService {

    private job: CronJob;

    data: Array<Point>;

    constructor(private conversionService: IOSMDataConverter) {
        this.fetchData();
        this.job = new CronJob('0 0 4 1 * *', this.fetchData);
        this.job.start();
    }

    fetchData(): void {
        this.getData().then(data => this.data = data)
            .catch(reason => console.log(reason));
    }

    getData(): Promise<Array<Point>> {
        console.log('Requesting update of OSM data');
        return axios.post(`${config.osm.host}${config.osm.path}`, config.osm.query)
            .then((response: AxiosResponse<OSMData>) => {
                console.log(`OSM response: ${response.status} ${response.statusText}`);
                let data: Array<Point> = this.conversionService.convertData(response.data);
                console.log(`Successfully fetched OSM data - ${data.length} points`);
                return data;
            });
    }
}
