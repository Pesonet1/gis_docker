import axios from 'axios';

import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';

const wpsSimplifyRequest = (
  typeName = 'geo:kunnat' as string,
  distance = 2000 as number,
  preserveTopology = true as boolean,
) => (`<?xml version="1.0" encoding="UTF-8"?>
<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
  <ows:Identifier>vec:Simplify</ows:Identifier>
  <wps:DataInputs>
    <wps:Input>
      <ows:Identifier>features</ows:Identifier>
      <wps:Reference mimeType="text/xml" xlink:href="http://geoserver/wfs" method="POST">
        <wps:Body>
          <wfs:GetFeature service="WFS" version="1.0.0" outputFormat="GML2" xmlns:sf="http://www.openplans.org/spearfish">
            <wfs:Query typeName="${typeName}"/>
          </wfs:GetFeature>
        </wps:Body>
      </wps:Reference>
    </wps:Input>
    <wps:Input>
      <ows:Identifier>distance</ows:Identifier>
      <wps:Data>
        <wps:LiteralData>${distance}</wps:LiteralData>
      </wps:Data>
    </wps:Input>
    <wps:Input>
      <ows:Identifier>preserveTopology</ows:Identifier>
      <wps:Data>
        <wps:LiteralData>${preserveTopology}</wps:LiteralData>
      </wps:Data>
    </wps:Input>
  </wps:DataInputs>
  <wps:ResponseForm>
    <wps:RawDataOutput mimeType="application/json">
      <ows:Identifier>result</ows:Identifier>
    </wps:RawDataOutput>
  </wps:ResponseForm>
</wps:Execute>`);

export default (mapInstance: Map) => {
  axios({
    method: 'post',
    url: 'http://localhost/geoserver/geo/ows',
    headers: {
      'Content-Type': 'text/xml',
    },
    params: {
      service: 'WPS',
      version: '1.0.0',
      request: 'Execute',
    },
    data: wpsSimplifyRequest(),
  }).then((result) => {
    const layer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(result.data),
      }),
    });

    layer.set('name', 'wps_layer');

    mapInstance.addLayer(layer);
  });
};
