import Overlay from 'ol/Overlay';

interface PopupCloserHTMLElement {
  onclick: () => boolean;
  blur: () => void;
}

export default (container: HTMLElement, closer: PopupCloserHTMLElement): Overlay => {
  const overlay = new Overlay({
    id: 'popup',
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });

  closer.onclick = () => { // eslint-disable-line
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  return overlay;
};
