import OKAny from './any';
declare class OKBoolean<Input, Parent, Root> extends OKAny<
  Input,
  Parent,
  Root
> {
  constructor(msg?: string);
  private addTest;
}
export default OKBoolean;
