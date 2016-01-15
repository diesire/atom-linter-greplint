'use babel';

import Greplint from 'greplint'

function linter() {
  function transform(message) {
    function toRange(message) {
      return [[Number(message.lineNumber)-1, Number(message.index)], [Number(message.lineNumber)-1, Number(message.index) + Number(message.length)]]
    }

    const result = {
          type: 'Error',
          text: message.value,
          filePath: message.filename,
          range: toRange(message)
        }
    console.log('transform', message, result);
    return result
  }

  function onchange(editor) {
    const filePath = editor.getPath();

    if (!filePath) {
      return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
      console.log('filePath', filePath);
      new Greplint(filePath).lint()
      .then(values => {
        resolve(values.map(transform))
      })
      .catch(err => reject(err))
  })}

  return {
    grammarScopes: ['source.sql', 'text.plain'],
    name: 'linter-greplint',
    scope: 'file',
    lintOnFly: true,
    lint: onchange
  }
}

function activate() {
  // require('atom-package-deps').install()
  console.log('grepint activated');
}

module.exports = {
  activate,
  config: {},
  provideLinter: linter
}
