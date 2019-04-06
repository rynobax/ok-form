import OKAny from './any';
import OKNumber from './number';
import OKObject, { Shape } from './object';

const ok = {
  any: <Input = unknown, Parent = unknown, Root = unknown>() =>
    new OKAny<Input, Parent, Root>(),
  number: <Input = unknown, Parent = unknown, Root = unknown>(msg?: string) =>
    new OKNumber<Input, Parent, Root>(msg),
  object: <Input = unknown, Parent = unknown, Root = unknown>(
    obj: Shape<Input>,
    msg?: string
  ) => new OKObject<Input, Parent, Root>(obj, msg),
};

export default ok;
