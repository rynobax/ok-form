import { Shape } from './util';
import OKAny from './any';
import OKNumber from './number';
import OKObject from './object';
import OKArray from './array';

const ok = {
  any: <Input = any, Parent = any, Root = any>() =>
    new OKAny<Input, Parent, Root>(),
  array: <Input = any, Parent = any, Root = any>(shape: OKAny, msg?: string) =>
    new OKArray<Input, Parent, Root>(shape, msg),
  number: <Input = any, Parent = any, Root = any>(msg?: string) =>
    new OKNumber<Input, Parent, Root>(msg),
  object: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string
  ) => new OKObject<Input, Parent, Root>(shape, msg),
};

export default ok;
