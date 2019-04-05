import OKAny from './any';
import OKNumber from './number';

const ok = {
  any: () => new OKAny(),
  number: (msg?: string) => new OKNumber(msg),
};

export default ok;
