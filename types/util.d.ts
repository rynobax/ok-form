import OKAny from './any';
export interface Shape<Input> {
  [key: string]: OKAny<Input>;
}
