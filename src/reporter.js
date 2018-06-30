/*eslint no-console: 0*/

'use strict';

let gutil = require('gulp-util');
let PluginError = gutil.PluginError;
let path = require('path');

const pluginName = 'gulp-custom-lint';
const rowPad = '    ';
const columnPad = '  ';
let failedCount = 0;

function logLine(rowAndCols, message, type) {
  console.log(
    gutil.colors.gray(rowAndCols),
    type === 'error' ? gutil.colors.red(' error ') : gutil.colors.yellow(' warn '),
    message
  );
}

function reportFailures(lint) {
  if (!lint.lines) {
    logLine(' '.repeat(rowPad.length + columnPad.length + 1), lint.message, lint.type);
    if (lint.type == 'error') failedCount++;
    return;
  }

  lint.lines.forEach((lineInfo) => {
    let row = (rowPad + lineInfo.row).slice(-rowPad.length);
    let column = (lineInfo.column + columnPad).substring(0, columnPad.length);
    logLine(`${row}:${column}`, lint.message, lint.type);
    if (lint.type == 'error') failedCount++;
  });
}

function failAfterError(target) {
  if (failedCount > 0) {
    target.emit('error', new PluginError(pluginName, {
      message: `Found ${failedCount} error(s)`,
      showStack: false
    }));
  }
}

function processBuffer(file) {
  if (file.customLint) {
    let relativePath = path.relative(process.cwd(), file.path);
    console.log(relativePath);
    file.customLint.forEach(reportFailures);
    console.log();
  }
}

module.exports = {
  processBuffer,
  failAfterError
};
