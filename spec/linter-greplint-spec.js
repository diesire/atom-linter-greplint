'use babel';

import * as path from 'path';

describe('The greplint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'linter-greplint.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-greplint');
      return atom.packages.activatePackage('language-sql').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures', 'input.sql'))
      );
    });
  });

  describe('checks a file with issues and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'fixtures', 'input.sql')).then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          console.log(messages);
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('Error');
          // expect(messages[0].html).toBeDefined();
          // expect(messages[0].html).toEqual('Do not use upper-case characters in definition labels');
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+input\.sql$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([
            [0, 3],
            [0, 8]
          ]);
        });
      });
    });
  });

  xit('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      return atom.workspace.open(path.join(__dirname, 'fixtures', 'definition-case-valid.md')).then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
