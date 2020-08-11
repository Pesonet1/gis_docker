import RenderFeature from 'ol/render/Feature';
import FeatureLike from 'ol/Feature';

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';

const getTextStyle = (
  textFont: string,
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
  offX: number,
  offY: number,
  place: string,
  labelText: string,
): Text => (new Text({
  font: textFont,
  fill: new Fill({
    color: fillColor,
  }),
  stroke: new Stroke({
    color: strokeColor,
    width: strokeWidth,
  }),
  offsetX: offX,
  offsetY: offY,
  placement: place,
  text: labelText,
  overflow: true,
  padding: [5, 5, 5, 5],
}));

type LabelPlacement = 'point' | 'line';

export const getLabelText = (feature: RenderFeature | FeatureLike, property: string, placement: LabelPlacement = 'point'): Text => {
  const text = feature.get(property).toString();

  if (text) {
    return getTextStyle('11px Verdana', 'white', 'black', 3, 0, 0, placement, text);
  }

  return new Text();
};

export const getFeatureLabelStyle = (feature: RenderFeature | FeatureLike): Style => (new Style({
  stroke: new Stroke({
    color: 'black',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgba(0, 0, 0, 0.5)',
  }),
  text: getLabelText(feature, 'nimi'),
}));
