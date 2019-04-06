import * as ts from 'typescript';
import ok from '../index';

const transpile = (srcString: string) => () => {
  const sourceFile = ts.createSourceFile('', srcString, ts.ScriptTarget.Latest);
  const compilerHost: ts.CompilerHost = {
    getSourceFile: () => sourceFile,
    writeFile: () => {},
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (filename: string) => filename,
    getCurrentDirectory: () => '',
    getNewLine: () => '\n',
    getDefaultLibFileName: () => '',
    fileExists: () => true,
    readFile: () => '',
  };
  const program = ts.createProgram([''], {}, compilerHost);
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .filter(e => e.file)
    .map(e => e.messageText);
  if (allDiagnostics.length > 0) throw Error(allDiagnostics.join('\n'));
};

describe('transpile works', () => {
  test('valid', () => {
    const source = "let x: string = 'string'";
    expect(transpile(source)).not.toThrow();
  });

  test('invalid', () => {
    const source = 'const x: string = 5';
    expect(transpile(source)).toThrow();
  });
});

test('generics', () => {
  interface Input {
    foo: string;
    bar: string;
  }

  const schema = ok.object<Input>({
    foo: ok.number(),
    bar: ok.number(),
  });
  schema.validate({
    foo: 1,
    bar: true,
  });
});
