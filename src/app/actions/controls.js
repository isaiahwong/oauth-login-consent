import { createAction } from './utils/helper';

export const ActionTypes = {
  TOGGLE_NAVIGATION: 'TOGGLE_NAVIGATION',
  TOGGLE_DESKTOP: 'TOGGLE_DESKTOP',
};

export function showNavigation(showNav = true) {
  return createAction(
    ActionTypes.TOGGLE_NAVIGATION,
    { showNav },
  );
}

export function toggleDesktopMode(desktopMode = true) {
  return createAction(
    ActionTypes.TOGGLE_DESKTOP,
    { desktopMode },
    {
      beforeAction: (dispatch, getState) => {
        const { controls: { showNav } } = getState();
        // show navigation when in desktop mode
        if (desktopMode && !showNav) {
          dispatch(showNavigation(true));
        }
        else if (!desktopMode && showNav) {
          dispatch(showNavigation(false));
        }
      },
    },
  );
}
