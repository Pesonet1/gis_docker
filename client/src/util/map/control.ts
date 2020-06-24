import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';

import projection from './projection';

export const mousePositionControl = ( // eslint-disable-line
  mousePositionElement: HTMLElement,
  coordinateDecimals: number,
): MousePosition => (new MousePosition({
  coordinateFormat: createStringXY(coordinateDecimals),
  projection,
  className: 'custom-mouse-position',
  target: mousePositionElement,
  undefinedHTML: '&nbsp;',
}));
