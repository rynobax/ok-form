import { Shape } from './util';
import OKAny from './any';
import OKNumber from './number';
import OKObject from './object';
import OKArray from './array';
declare const ok: {
  any: <Input = any, Parent = any, Root = any>() => OKAny<Input, Parent, Root>;
  array: <Input = any, Parent = any, Root = any>(
    shape: OKAny<unknown, unknown, unknown>,
    msg?: string | undefined
  ) => OKArray<Input, Parent, Root>;
  number: <Input = any, Parent = any, Root = any>(
    msg?: string | undefined
  ) => OKNumber<Input, Parent, Root>;
  object: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string | undefined
  ) => OKObject<Input, Parent, Root>;
};
export default ok;
