import axios from 'axios';

import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';
import WFS, { TransactionResponse } from 'ol/format/WFS';
import GML from 'ol/format/GML';

import { WFSTransactionType } from '@/types';

export default (type: WFSTransactionType, layer: VectorLayer, features: Feature[]): void => {
  const formatWFS: WFS = new WFS();
  // @ts-ignore
  const formatGML: GML = new GML({
    featureNS: 'geo',
    featureType: 'kunnat',
    srsName: 'EPSG:3067',
  });

  let node: Node | null = null;

  switch (type) {
    case 'insert':
      node = formatWFS.writeTransaction(features, [], [], formatGML);
      break;
    case 'update':
      node = formatWFS.writeTransaction([], features, [], formatGML);
      break;
    case 'delete':
      node = formatWFS.writeTransaction([], [], features, formatGML);
      break;
    default:
      break;
  }

  if (!node) return;

  axios({
    method: 'post',
    url: 'http://localhost:8080/geoserver/geo/wfs',
    data: new XMLSerializer().serializeToString(node),
    headers: { 'content-type': 'text/xml' },
  }).then((data) => {
    const result: TransactionResponse = formatWFS.readTransactionResponse(data);
    console.log(result);
    layer.getSource().refresh();
  }).catch((error) => console.error(error));
};
