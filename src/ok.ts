import OKAny from './any';
import OKArray from './array';
import OKBoolean from './boolean';
import OKNumber from './number';
import OKObject, { Shape } from './object';
import OKString from './string';

const ok = {
  any: <Input = any, Parent = any, Root = any>() =>
    new OKAny<Input, Parent, Root>(),
  array: <Input = any, Parent = any, Root = any>(shape: OKAny, msg?: string) =>
    new OKArray<Input, Parent, Root>(shape, msg),
  boolean: <Input = any, Parent = any, Root = any>(msg?: string) =>
    new OKBoolean<Input, Parent, Root>(msg),
  number: <Input = any, Parent = any, Root = any>(msg?: string) =>
    new OKNumber<Input, Parent, Root>(msg),
  object: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string
  ) => new OKObject<Input, Parent, Root>(shape, msg),
  string: <Input = any, Parent = any, Root = any>(msg?: string) =>
    new OKString<Input, Parent, Root>(msg),
};

export default ok;
