/* eslint-disable prefer-rest-params */
/* eslint-disable import/no-dynamic-require */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

// Port to retrieving from database
export const localePath = path.join(__dirname, '../locales/');

const i18n = {
  strings: null,
  translations: {},
  t, // eslint-disable-line no-use-before-define
};

const locales = [];

let _defaultLocale = 'en';

// Store translations
export const _translations = {};

function _loadTranslations(locale, _localePath = localePath) {
  const files = fs.readdirSync(path.join(_localePath, locale));
  locales.push(locale);
  _translations[locale] = {};

  files.forEach((file) => {
    if (path.extname(file) !== '.json') return;
    let parsed = {};

    try {
      const localeJSON = fs.readFileSync(path.join(_localePath, locale, file));
      parsed = JSON.parse(localeJSON);
    }
    catch (err) {
      console.warn(err);
    }
    finally {
      // We use require to load and parse a JSON file
      _.merge(_translations[locale], parsed);
    }
  });
}

function _loadParsedTranslations(translations) {
  Object.keys(translations).forEach((locale) => {
    locales.push(locale);
    _translations[locale] = {};
    _.merge(_translations[locale], translations[locale]);
  });
}

export function setupLanguage({
  _localePath = localePath,
  translations = {},
  defaultLocale = 'en'
}) {
  _defaultLocale = defaultLocale;
  if (_.isEmpty(translations)) {
    // Fetch English strings so we can merge them with missing strings in other languages
    _loadTranslations('en', _localePath);

    // load all other languages
    fs.readdirSync(_localePath).forEach((file) => {
      if (file === 'en' || fs.statSync(path.join(_localePath, file)).isDirectory() === false) return;
      _loadTranslations(file);

      // Merge missing strings from english
      _.defaults(_translations[file], _translations.en);
    });
  }
  else {
    _loadParsedTranslations(translations);
  }
  // Add translations to shared
  i18n.translations = _translations;
}

function t(stringName) {
  let vars = arguments[1];
  let locale;

  if (_.isString(arguments[1])) {
    vars = null;
    locale = arguments[1];
  }
  else if (arguments[2]) {
    locale = arguments[2];
  }

  const i18nNotSetup = !i18n.strings && !i18n.translations[locale];

  if (!locale) {
    locale = _defaultLocale;
  }

  if (i18nNotSetup) {
    locale = locales.find(l => locale.includes(l));
  }

  let string;

  if (i18n.strings) {
    string = i18n.strings[stringName];
  }
  else {
    string = i18n.translations[locale] && i18n.translations[locale][stringName];
  }

  const clonedVars = _.clone(vars) || {};

  clonedVars.locale = locale;

  if (string) {
    try {
      return _.template(string)(clonedVars);
    }
    catch (_error) {
      return `Error processing the string "${stringName}". Please see Help > Report a Bug.`;
    }
  }
  else {
    let stringNotFound;

    if (i18n.strings) {
      stringNotFound = i18n.strings.stringNotFound;
    }
    else if (i18n.translations[locale]) {
      stringNotFound = i18n.translations[locale] && i18n.translations[locale].stringNotFound;
    }

    try {
      return _.template(stringNotFound)({
        string: stringName,
      });
    }
    catch (_error) {
      return 'Error processing the string "stringNotFound". Please see Help > Report a Bug.';
    }
  }
}

// export function getUserLanguage(req, res, next) {
//   if (req.query.lang) { // In case the language is specified in the request url, use it
//     req.language = _translations[req.query.lang] ? req.query.lang : 'en';
//     return next();
//   }
//   else if (req.locals && req.locals.user) { // use the user's preferred language
//     req.language = _getFromUser(req.locals.user, req);
//     return next();
//   } else if (req.session && req.session.userId) { // Same thing if the user has a valid session
//     return User.findOne({
//       _id: req.session.userId,
//     }, 'preferences.language')
//       .lean()
//       .exec()
//       .then((user) => {
//         req.language = _getFromUser(user, req);
//         return next();
//       })
//       .catch(next);
//   } else { // Otherwise get from browser
//     req.language = _getFromUser(null, req);
//     return next();
//   }
// }

export const langCodes = Object.keys(_translations);

export default i18n;
