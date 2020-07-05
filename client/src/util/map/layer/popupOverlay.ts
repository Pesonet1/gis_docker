import Overlay from 'ol/Overlay';

export default (container: HTMLElement, closer: HTMLElement): Overlay | null => {
  if (!container || !closer) return null;

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
