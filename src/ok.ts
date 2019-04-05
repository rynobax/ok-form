import OKAny from './any';
import OKNumber from './number';
import OKObject, { Shape } from './object';

const ok = {
  any: () => new OKAny(),
  number: (msg?: string) => new OKNumber(msg),
  object: (obj: Shape, msg?: string) => new OKObject(obj, msg),
};

export default ok;
