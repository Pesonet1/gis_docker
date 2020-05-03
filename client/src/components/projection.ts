import * as proj4x from 'proj4';
import { get as getProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';

const proj4 = (proj4x as any).default; // eslint-disable-line

proj4.defs('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ');

register(proj4);

const projection = getProjection('EPSG:3067');
projection.setExtent([-548576, 6291456, 1548576, 8388608]);

export default projection;
