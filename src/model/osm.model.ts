
export class OSMData {
    version: number;
    generator: string;
    osm3s: any;
    elements: Array<OSMElement>;
}

export class OSMInfo {
    timestamp_osm_base: Date;
    timestamp_areas_base: Date;
    copyright: string;
}

export class OSMElement {
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: OSMTags;
}

export class OSMTags {
    distance: string;
    highway: string;
    ref: string;
    source: string;
}