import OKAny from './any';
import OKNumber from './number';
import OKObject, { Shape } from './object';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ok = {
  any: <Input = any, Parent = any, Root = any>() =>
    new OKAny<Input, Parent, Root>(),
  number: <Input = any, Parent = any, Root = any>(msg?: string) =>
    new OKNumber<Input, Parent, Root>(msg),
  object: <Input = any, Parent = any, Root = any>(
    obj: Shape<Input>,
    msg?: string
  ) => new OKObject<Input, Parent, Root>(obj, msg),
};

export default ok;
