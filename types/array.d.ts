import OKAny, { Result } from './any';
declare class OKArray<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape;
  private parseErrorMsg;
  constructor(shape: OKAny, msg?: string);
  private addTest;
  validate(input: Input): Result;
  cast(input: Input): Input;
}
export default OKArray;
