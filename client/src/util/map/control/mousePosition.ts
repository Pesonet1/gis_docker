import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';

import mapProjection from '../mapProjection';

export default (
  mousePositionElement: HTMLElement,
  coordinateDecimals: number,
): MousePosition => (new MousePosition({
  coordinateFormat: createStringXY(coordinateDecimals),
  projection: mapProjection,
  className: 'custom-mouse-position',
  target: mousePositionElement,
  undefinedHTML: '&nbsp;',
}));
