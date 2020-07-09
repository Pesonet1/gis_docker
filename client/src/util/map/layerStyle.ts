import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export const defaultStyle = (): Style => (new Style({
  stroke: new Stroke({
    color: 'black',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(0, 0, 0, 0.5)',
  }),
}));

export const selectionStyle = (): Style => (new Style({
  stroke: new Stroke({
    color: 'red',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(255, 0, 0, 0.5)',
  }),
}));
