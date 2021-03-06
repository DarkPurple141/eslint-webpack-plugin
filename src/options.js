import { validate } from 'schema-utils';

import schema from './options.json';

/** @typedef {import("eslint").ESLint.Options} ESLintOptions */
/** @typedef {import('eslint').ESLint.LintResult} LintResult */
/** @typedef {import('eslint').ESLint.LintResultData} LintResultData */

/**
 * @callback FormatterFunction
 * @param {LintResult[]} results
 * @param {LintResultData=} data
 * @returns {string}
 */

/**
 * @typedef {Object} OutputReport
 * @property {string=} filePath
 * @property {string|FormatterFunction=} formatter
 */

/**
 * @typedef {Object} Options
 * @property {string=} context
 * @property {boolean=} emitError
 * @property {boolean=} emitWarning
 * @property {string=} eslintPath
 * @property {boolean=} failOnError
 * @property {boolean=} failOnWarning
 * @property {string|string[]=} files
 * @property {string|string[]=} extensions
 * @property {boolean=} fix
 * @property {string|FormatterFunction=} formatter
 * @property {boolean=} lintDirtyModulesOnly
 * @property {boolean=} quiet
 * @property {OutputReport=} outputReport
 */

/**
 * @param {Options} pluginOptions
 * @returns {Options}
 */
export function getOptions(pluginOptions) {
  const options = {
    files: '.',
    extensions: 'js',
    ...pluginOptions,
  };

  // @ts-ignore
  validate(schema, options, {
    name: 'ESLint Webpack Plugin',
    baseDataPath: 'options',
  });

  return options;
}

/**
 * @param {Options} loaderOptions
 * @returns {ESLintOptions}
 */
export function getESLintOptions(loaderOptions) {
  const eslintOptions = { ...loaderOptions };

  // Keep the fix option because it is common to both the loader and ESLint.
  const { fix, extensions, ...eslintOnlyOptions } = schema.properties;

  // No need to guard the for-in because schema.properties has hardcoded keys.
  // eslint-disable-next-line guard-for-in
  for (const option in eslintOnlyOptions) {
    // @ts-ignore
    delete eslintOptions[option];
  }

  // @ts-ignore
  return eslintOptions;
}
