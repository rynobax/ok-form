import OKAny, { TransformFn } from './any';
import OKArray from './array';
import OKBoolean from './boolean';
import OKNumber from './number';
import OKObject, { Shape } from './object';
import OKString from './string';

const ok = {
  /**
   * Create "any" schema, which will accept any value
   */
  any: <Input = any, Parent = any, Root = any>() =>
    new OKAny<Input, Parent, Root>(),
  /**
   * Create an array schema, which will only accept an array
   * @param shape A schema for the elements of the array
   * @param msg The error message if the schema is not passed an array
   */
  array: <Input = any, Parent = any, Root = any>(shape: OKAny, msg?: string) =>
    new OKArray<Input, Parent, Root>(shape, msg),
  /**
   * Create a boolean schema
   *
   * It will accept only booleans, or the strings "true" or "false"
   *
   * @param msg The error message if the schema cannot convert the value to a
   * boolean
   *
   * @param transform Override the default boolean transformation
   */
  boolean: <Input = any, Parent = any, Root = any>(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) => new OKBoolean<Input, Parent, Root>(msg, transform),
  /**
   * Create a number schema
   *
   * If the input value is a non empty string, it will be converted to a number
   * with Number(val)
   *
   * If the parsed value is NaN, validation will fail
   *
   * @param msg The error message if the schema cannot convert the value to a
   * number
   *
   * @param transform Override the default number transformation
   */
  number: <Input = any, Parent = any, Root = any>(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) => new OKNumber<Input, Parent, Root>(msg, transform),
  /**
   * Create an object schema, which will only accept an object
   * @param shape A schema for the object
   * @param msg The error message if the schema is not passed an object
   */
  object: <Input = any, Parent = any, Root = any>(
    shape: Shape<Input>,
    msg?: string
  ) => new OKObject<Input, Parent, Root>(shape, msg),
  /**
   * Create a string schema
   *
   * The input value will be converted to string with String(val)
   *
   * The values null and undefined will be left as is
   * @param msg The error message if the schema cannot convert the value to a
   * string
   *
   * @param transform Override the default string transformation
   */
  string: <Input = any, Parent = any, Root = any>(
    msg?: string,
    transform?: TransformFn<Input, Parent, Root>
  ) => new OKString<Input, Parent, Root>(msg, transform),
};

export default ok;
