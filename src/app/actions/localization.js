import { createAction } from './utils/helper';

export const ActionTypes = {
  CHANGE_LOCALE: 'CHANGE_LOCALE',
};

export function changeLocale(locale) {
  return createAction(
    ActionTypes.CHANGE_LOCALE,
    { locale },
  );
}
