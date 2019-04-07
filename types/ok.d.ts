import OKAny from './any';
import OKNumber from './number';
import OKObject, { Shape } from './object';
declare const ok: {
  any: <Input = any, Parent = any, Root = any>() => OKAny<Input, Parent, Root>;
  number: <Input = any, Parent = any, Root = any>(
    msg?: string | undefined
  ) => OKNumber<Input, Parent, Root>;
  object: <Input = any, Parent = any, Root = any>(
    obj: Shape<Input>,
    msg?: string | undefined
  ) => OKObject<Input, Parent, Root>;
};
export default ok;
