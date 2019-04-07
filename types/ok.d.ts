import OKAny from './any';
import OKNumber from './number';
import OKObject from './object';
import { Shape } from './util';
declare const ok: {
  any: <Input = any, Parent = any, Root = any>() => OKAny<Input, Parent, Root>;
  array: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string | undefined
  ) => OKObject<Input, Parent, Root>;
  number: <Input = any, Parent = any, Root = any>(
    msg?: string | undefined
  ) => OKNumber<Input, Parent, Root>;
  object: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string | undefined
  ) => OKObject<Input, Parent, Root>;
};
export default ok;
