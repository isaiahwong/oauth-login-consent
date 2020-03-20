import { createAction } from './utils/helper';

export const ActionTypes = {
  SET_LOADED_PROJECTS: 'SET_LOADED_PROJECTS',
};

export function setLoadedProjects(projects = []) {
  return createAction(
    ActionTypes.SET_LOADED_PROJECTS,
    { projects },
  );
}
