/* eslint-disable import/prefer-default-export */
export const email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
export const alphaWhiteSpace = /^[a-zA-Z ]+$/;
export const symbols = /[$-/:-?{-~!"^_`[\]]/;
export const color = /^#[0-9A-F]{6}$/i;

export function normalizeAlphaSpace(value, previous = '', length) {
  if (!value) {
    return value;
  }
  if (!alphaWhiteSpace.test(value)) {
    return previous;
  }
  if (length && value.length > length) {
    return previous;
  }
  return value;
}


export function normalizeLength(value, previous = '', length) {
  if (!value) {
    return value;
  }
  if (length && value.length > length) {
    return previous;
  }
  return value;
}
