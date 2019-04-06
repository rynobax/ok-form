import OKAny from './any';
import OKNumber from './number';
import OKObject, { Shape } from './object';

const ok = {
  any: <InputShape = unknown>() => new OKAny<InputShape>(),
  number: <InputShape = unknown>(msg?: string) => new OKNumber<InputShape>(msg),
  object: <InputShape = unknown>(obj: Shape<InputShape>, msg?: string) =>
    new OKObject<InputShape>(obj, msg),
};

export default ok;
