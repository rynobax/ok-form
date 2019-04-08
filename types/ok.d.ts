import OKAny from './any';
import OKArray from './array';
import OKBoolean from './boolean';
import OKNumber from './number';
import OKObject, { Shape } from './object';
import OKString from './string';
declare const ok: {
    any: <Input = any, Parent = any, Root = any>() => OKAny<Input, Parent, Root>;
    array: <Input = any, Parent = any, Root = any>(shape: OKAny<unknown, unknown, unknown>, msg?: string | undefined) => OKArray<Input, Parent, Root>;
    boolean: <Input = any, Parent = any, Root = any>(msg?: string | undefined) => OKBoolean<Input, Parent, Root>;
    number: <Input = any, Parent = any, Root = any>(msg?: string | undefined) => OKNumber<Input, Parent, Root>;
    object: <Input = any, Parent = any, Root = any>(shape: Shape<Input>, msg?: string | undefined) => OKObject<Input, Parent, Root>;
    string: <Input = any, Parent = any, Root = any>(msg?: string | undefined) => OKString<Input, Parent, Root>;
};
export default ok;
