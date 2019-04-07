import OKAny, { Result } from './any';
import { Shape } from './util';
declare class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape;
  private parseErrorMsg;
  constructor(shape: Shape<Input>, msg?: string);
  private addTest;
  validate(input: Input): Result;
  cast(input: Input): Input;
}
export default OKObject;
