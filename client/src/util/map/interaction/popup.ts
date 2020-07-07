import axios from 'axios';

import Map from 'ol/Map';
import { FeatureLike } from 'ol/Feature';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { EventsKey } from 'ol/events';
import Overlay from 'ol/Overlay';

import { WMSFeatureInfo } from '@/types';

const getWMSFeatureInfo = async (
  mapInstance: Map,
  event: MapBrowserEvent,
  layer: any, // eslint-disable-line
): Promise<WMSFeatureInfo | null> => {
  const viewResolution: number = mapInstance.getView().getResolution();
  const url: string = layer.getSource().getFeatureInfoUrl(
    event.coordinate,
    viewResolution,
    'EPSG:3067',
    { INFO_FORMAT: 'application/json' },
  );

  if (!url) return null;

  return axios.get(url).then((response) => response.data);
};

export default (mapInstance: Map): EventsKey => {
  const content: HTMLElement | null = document.getElementById('popup-content');

  return mapInstance.on('singleclick', async (event: MapBrowserEvent) => {
    const pixel: number[] = mapInstance.getEventPixel(event.originalEvent);

    const layer = mapInstance.forEachLayerAtPixel(pixel, (layer2) => layer2);
    const feature: FeatureLike | null = mapInstance.forEachFeatureAtPixel(
      pixel,
      (feature2) => feature2,
    );

    const overlay: Overlay = mapInstance.getOverlayById('popup');

    if (feature) {
      console.log('clicked wfs / vectorTile');

      if (!content) return;

      content.innerHTML = `
        <b>Kuntanumero: </b>${feature.get('kunta')}<br/>
        <b>Kuntanimi: </b>${feature.get('nimi')}<br/>
      `;

      overlay.setPosition(event.coordinate);
    } else {
      if (!('getFeatureInfoUrl' in layer.getSource())) return;

      console.log('clicked wms / tiledWMS');
      const data: WMSFeatureInfo | null = await getWMSFeatureInfo(mapInstance, event, layer);

      if (data && data.numberReturned && content) {
        content.innerHTML = `
          <b>Kuntanumero: </b>${data.features[0].properties.kunta}<br/>
          <b>Kuntanimi: </b>${data.features[0].properties.nimi}<br/>
        `;
        overlay.setPosition(event.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    }
  });
};
