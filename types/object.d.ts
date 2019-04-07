import OKAny, { Result } from './any';
export interface Shape<Input> {
  [key: string]: OKAny<Input>;
}
declare class OKObject<Input, Parent, Root> extends OKAny<Input, Parent, Root> {
  private shape;
  private parseErrorMsg;
  constructor(shape: Shape<Input>, msg?: string);
  private addTest;
  private iterateShape;
  validate(input: Input): Result;
  cast(input: Input): Input;
}
export default OKObject;
