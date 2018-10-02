declare module 'io-ts' {
  import type { Either } from 'fp-ts/lib/Either'
  import type { Predicate } from 'fp-ts/lib/function'

  declare export interface ContextEntry {
    +key: string;
    +type: Decoder<any, any>;
  }
  declare export type Context = $ReadOnlyArray<ContextEntry>
  declare export interface ValidationError {
    +value: mixed;
    +context: Context;
  }
  declare export type Errors = Array<ValidationError>
  declare export type Validation<A> = Either<Errors, A>
  declare export type Is<A> = (m: mixed) => boolean
  declare export type Validate<I, A> = (i: I, context: Context) => Validation<A>
  declare export type Decode<I, A> = (i: I) => Validation<A>
  declare export type Encode<A, O> = (a: A) => O
  declare export type Any = Type<any, any, any>
  declare export type Mixed = Type<any, any, mixed>
  // declare type ExtractType<I, A, RT: Type<A, any, I>> = A
  // declare export type TypeOf<RT: Any> = ExtractType<*, *, RT>
  declare export type TypeOf<RT: Any> = $PropertyType<RT, '_A'>
  declare export type InputOf<RT: Any> = $PropertyType<RT, '_I'>
  declare export type OutputOf<RT: Any> = $PropertyType<RT, '_O'>
  declare export interface Decoder<I, A> {
    +name: string;
    +validate: Validate<I, A>;
    +decode: Decode<I, A>;
  }
  declare export interface Encoder<A, O> {
    +encode: Encode<A, O>;
  }
  declare export class Type<A, O = A, I = mixed> {
    +name: string;
    +is: Is<A>;
    +validate: Validate<I, A>;
    +encode: Encode<A, O>;
    +_A: A;
    +_O: O;
    +_I: I;
    constructor(
      name: string,
      is: Is<A>,
      validate: Validate<I, A>,
      encode: Encode<A, O>,
    ): Type<A, O, I>;
    pipe<B>(ab: Type<B, A, A>, name?: string): Type<B, O, I>;
    asDecoder(): Decoder<I, A>;
    asEncoder(): Encoder<A, O>;
    decode(i: I): Validation<A>;
  }

  declare export var identity: <A>(a: A) => A
  declare export var getFunctionName: (f: Function) => string
  declare export var getContextEntry: (
    key: string,
    type: Decoder<any, any>,
  ) => ContextEntry
  declare export var getValidationError: (
    value: mixed,
    context: Context,
  ) => ValidationError
  declare export var getDefaultContext: (type: Decoder<any, any>) => Context
  declare export var appendContext: (
    c: Context,
    key: string,
    type: Decoder<any, any>,
  ) => Context
  declare export var failures: <T>(errors: Errors) => Validation<T>
  declare export var failure: <T>(value: mixed, context: Context) => Validation<T>
  declare export var success: <T>(value: T) => Validation<T>

  //
  // basic types
  //

  declare export class NullType extends Type<null> {
    +_tag: 'NullType';
    constructor(): NullType;
  }
  // INFO: alias za ovaj tip je "null" i oba naziva se export-uju
  declare export var nullType: NullType

  declare export class UndefinedType extends Type<void> {
    +_tag: 'UndefinedType';
    constructor(): UndefinedType;
  }
  // INFO: alias za ovaj tip je "undefined" i samo se on export-uje
  declare var undefinedType: UndefinedType

  declare export class AnyType extends Type<any> {
    +_tag: 'AnyType';
    constructor(): AnyType;
  }
  declare export var any: AnyType

  declare export class NeverType extends Type<empty> {
    +_tag: 'NeverType';
    constructor(): NeverType;
  }
  declare export var never: NeverType

  declare export class StringType extends Type<string> {
    +_tag: 'StringType';
    constructor(): StringType;
  }
  declare export var string: StringType

  declare export class NumberType extends Type<number> {
    +_tag: 'NumberType';
    constructor(): NumberType;
  }
  declare export var number: NumberType

  declare export class BooleanType extends Type<boolean> {
    +_tag: 'BooleanType';
    constructor(): BooleanType;
  }
  declare export var boolean: BooleanType

  declare export class AnyArrayType extends Type<Array<mixed>> {
    +_tag: 'AnyArrayType';
    constructor(): AnyArrayType;
  }
  // INFO: alias za ovaj tip je "array" i samo se on export-uje
  declare var arrayType: AnyArrayType

  declare export class AnyDictionaryType extends Type<{ [key: string]: mixed }> {
    +_tag: 'AnyDictionaryType';
    constructor(): AnyDictionaryType;
  }
  declare export var Dictionary: AnyDictionaryType

  declare export class ObjectType extends Type<Object> {
    +_tag: 'ObjectType';
    constructor(): ObjectType;
  }
  declare export var object: ObjectType

  declare export class FunctionType extends Type<Function> {
    +_tag: 'FunctionType';
    constructor(): FunctionType;
  }
  declare export var Function: FunctionType

  //
  // refinements
  //

  declare export class RefinementType<+RT: Any, A = any, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +type: RT;
    +predicate: Predicate<A>;
    +_tag: 'RefinementType';
    constructor(
      name: string,
      is: $PropertyType<RefinementType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<RefinementType<RT, A, O, I>, 'validate'>,
      encode: $PropertyType<RefinementType<RT, A, O, I>, 'encode'>,
      type: RT,
      predicate: Predicate<A>,
    ): RefinementType<RT, A, O, I>;
  }
  declare export var refinement: <RT: Any>(
    type: RT,
    predicate: Predicate<$PropertyType<RT, '_A'>>,
    name?: string,
  ) => RefinementType<
    RT,
    $PropertyType<RT, '_A'>,
    $PropertyType<RT, '_O'>,
    $PropertyType<RT, '_I'>,
  >

  //
  // literals
  //

  declare export class LiteralType<V: string | number | boolean> extends Type<V> {
    +value: V;
    +_tag: 'LiteralType';
    constructor(
      name: string,
      is: $PropertyType<LiteralType<V>, 'is'>,
      validate: $PropertyType<LiteralType<V>, 'validate'>,
      encode: $PropertyType<LiteralType<V>, 'encode'>,
      value: V,
    ): LiteralType<V>;
  }
  declare export var literal: <V: string | number | boolean>(
    value: V,
    name?: string,
  ) => LiteralType<V>

  //
  // keyof
  //

  declare export class KeyofType<D: { [key: string]: mixed }> extends Type<$Keys<D>> {
    +keys: D;
    +_tag: 'KeyofType';
    constructor(
      name: string,
      is: $PropertyType<KeyofType<D>, 'is'>,
      validate: $PropertyType<KeyofType<D>, 'validate'>,
      encode: $PropertyType<KeyofType<D>, 'encode'>,
      keys: D,
    ): KeyofType<D>;
  }
  declare export var keyof: <D: { [key: string]: mixed }>(
    keys: D,
    name?: string,
  ) => KeyofType<D>

  //
  // recursive types
  //

  declare export class RecursiveType<+RT: Any, A = any, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +_tag: 'RecursiveType';
    +type: RT;
    runDefinition: () => RT;
    constructor(
      name: string,
      is: $PropertyType<RecursiveType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<RecursiveType<RT, A, O, I>, 'validate'>,
      encode: $PropertyType<RecursiveType<RT, A, O, I>, 'encode'>,
      runDefinition: () => RT,
    ): RecursiveType<RT, A, O, I>;
  }
  declare export var recursion: <A, O, I, RT: Type<A, O, I>>( // TODO: Ne znam kako da generickim parametrima zadam default vrijednosti
    name: string,
    definition: (self: RT) => RT,
  ) => RecursiveType<RT, A, O, I>

  //
  // arrays
  //

  declare export class ArrayType<+RT: Any, A = any, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +type: RT;
    +_tag: 'ArrayType';
    constructor(
      name: string,
      is: $PropertyType<ArrayType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<ArrayType<RT, A, O, I>, 'validate'>,
      encode: $PropertyType<ArrayType<RT, A, O, I>, 'encode'>,
      type: RT,
    ): ArrayType<RT, A, O, I>;
  }
  declare export var array: <RT: Mixed>(
    type: RT,
    name?: string,
  ) => ArrayType<RT, Array<TypeOf<RT>>>

  //
  // interfaces
  //

  declare type Props = { +[key: string]: Mixed }
  declare type InterfaceOf<P: Props> = $ObjMap<P, <T>(v: Type<T>) => T>
  declare export class InterfaceType<P: Props, A, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +props: P;
    +_tag: 'InterfaceType';
    constructor(
      name: string,
      is: $PropertyType<InterfaceType<P, A, O, I>, 'is'>,
      validate: $PropertyType<InterfaceType<P, A, O, I>, 'validate'>,
      encode: $PropertyType<InterfaceType<P, A, O, I>, 'encode'>,
      props: P,
    ): InterfaceType<P, A, O, I>;
  }
  // INFO: alias za ovaj tip je "interface"
  declare export var type: <P: Props>(
    props: P,
    name?: string,
  ) => InterfaceType<P, InterfaceOf<P>>

  //
  // partials
  //

  declare export class PartialType<P, A = any, O = A, I = mixed> extends Type<A, O, I> {
    +props: P;
    +_tag: 'PartialType';
    constructor(
      name: string,
      is: $PropertyType<PartialType<P, A, O, I>, 'is'>,
      validate: $PropertyType<PartialType<P, A, O, I>, 'validate'>,
      encode: $PropertyType<PartialType<P, A, O, I>, 'encode'>,
      props: P,
    ): PartialType<P, A, O, I>;
  }
  declare type PartialOf<P: Props> = $Shape<InterfaceOf<P>>
  // declare type TypeOfPartialProps<P extends AnyProps> = {
  //     [K in keyof P]?: TypeOf<P[K]>;
  // };
  // declare type OutputOfPartialProps<P extends AnyProps> = {
  //     [K in keyof P]?: OutputOf<P[K]>;
  // };
  declare export var partial: <P: Props>(
    props: P,
    name?: string,
  ) => PartialType<P, PartialOf<P>>

  //
  // dictionaries
  //

  declare export class DictionaryType<
    D: Any,
    C: Any,
    A = any,
    O = A,
    I = mixed,
  > extends Type<A, O, I> {
    +domain: D;
    +codomain: C;
    +_tag: 'DictionaryType';
    constructor(
      name: string,
      is: $PropertyType<DictionaryType<D, C, A, O, I>, 'is'>,
      validate: $PropertyType<DictionaryType<D, C, A, O, I>, 'validate'>,
      encode: $PropertyType<DictionaryType<D, C, A, O, I>, 'encode'>,
      domain: D,
      codomain: C,
    ): DictionaryType<D, C, A, O, I>;
  }
  // declare type TypeOfDictionary<D extends Any, C extends Any> = {
  //     [K in TypeOf<D>]: TypeOf<C>;
  // };
  // declare type OutputOfDictionary<D extends Any, C extends Any> = {
  //     [K in OutputOf<D>]: OutputOf<C>;
  // };
  declare export var dictionary: <D: Mixed, C: Mixed>(
    domain: D,
    codomain: C,
    name?: string,
  ) => DictionaryType<D, C, { [key: TypeOf<D>]: TypeOf<C> }>

  //
  // unions
  //

  declare export class UnionType<
    +RTS: Array<Any>,
    A = any,
    O = A,
    I = mixed,
  > extends Type<A, O, I> {
    +types: RTS;
    +_tag: 'UnionType';
    constructor(
      name: string,
      is: $PropertyType<UnionType<RTS, A, O, I>, 'is'>,
      validate: $PropertyType<UnionType<RTS, A, O, I>, 'validate'>,
      encode: $PropertyType<UnionType<RTS, A, O, I>, 'encode'>,
      types: RTS,
    ): UnionType<RTS, A, O, I>;
  }
  declare export function union<A, RTS: [Type<A, any, mixed>]>(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A>
  declare export function union<A, B, RTS: [Type<A, any, mixed>, Type<B, any, mixed>]>(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B>
  declare export function union<
    A,
    B,
    C,
    RTS: [Type<A, any, mixed>, Type<B, any, mixed>, Type<C, any, mixed>],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C>
  declare export function union<
    A,
    B,
    C,
    D,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
      Type<G, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F | G>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
      Type<G, any, mixed>,
      Type<H, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F | G | H>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
      Type<G, any, mixed>,
      Type<H, any, mixed>,
      Type<I, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F | G | H | I>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
      Type<G, any, mixed>,
      Type<H, any, mixed>,
      Type<I, any, mixed>,
      Type<J, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F | G | H | I | J>
  declare export function union<
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    RTS: [
      Type<A, any, mixed>,
      Type<B, any, mixed>,
      Type<C, any, mixed>,
      Type<D, any, mixed>,
      Type<E, any, mixed>,
      Type<F, any, mixed>,
      Type<G, any, mixed>,
      Type<H, any, mixed>,
      Type<I, any, mixed>,
      Type<J, any, mixed>,
      Type<K, any, mixed>,
    ],
  >(
    types: RTS,
    name?: string,
  ): UnionType<RTS, A | B | C | D | E | F | G | H | I | J | K>

  // //
  // // intersections
  // //

  // declare export class IntersectionType<+RTS: Array<Any>, A = any, O = A, I = mixed> extends Type<A, O, I> {
  //   +types: RTS;
  //   +_tag: 'IntersectionType';
  //   constructor(
  //     name: string,
  //     is: $PropertyType<IntersectionType<RTS, A, O, I>, 'is'>,
  //     validate: $PropertyType<IntersectionType<RTS, A, O, I>, 'validate'>,
  //     encode: $PropertyType<IntersectionType<RTS, A, O, I>, 'encode'>,
  //     types: RTS
  //   ): IntersectionType<RTS, A, O, I>;
  // }
  // declare export function intersection<A, RTS: [Type<A, any, mixed>]>(
  //   types: RTS,
  //   name?: string
  // ): UnionType<RTS, A>;
  // declare export function intersection<A, B, RTS: [Type<A, any, mixed>, Type<A, any, mixed>]>(
  //   types: RTS,
  //   name?: string
  // ): UnionType<RTS, A & B>;
  // declare export function intersection<A, B, C, RTS: [Type<A, any, mixed>, Type<B, any, mixed>, Type<C, any, mixed>]>(
  //   types: RTS,
  //   name?: string
  // ): UnionType<RTS, A & B & C>;

  //
  // tuples
  //

  declare export class TupleType<
    +RTS: Array<Any>,
    A = any,
    O = A,
    I = mixed,
  > extends Type<A, O, I> {
    +types: RTS;
    +_tag: 'TupleType';
    constructor(
      name: string,
      is: $PropertyType<TupleType<RTS, A, O, I>, 'is'>,
      validate: $PropertyType<TupleType<RTS, A, O, I>, 'validate'>,
      encode: $PropertyType<TupleType<RTS, A, O, I>, 'encode'>,
      types: RTS,
    ): TupleType<RTS, A, O, I>;
  }
  declare export function tuple<A: Mixed, RTS: [A]>(
    types: RTS,
    name?: string,
  ): TupleType<RTS, [TypeOf<A>], [OutputOf<A>], mixed>
  declare export function tuple<A: Mixed, B: Mixed, RTS: [A, B]>(
    types: RTS,
    name?: string,
  ): TupleType<RTS, [TypeOf<A>, TypeOf<B>], [OutputOf<A>, OutputOf<B>], mixed>
  declare export function tuple<A: Mixed, B: Mixed, C: Mixed, RTS: [A, B, C]>(
    types: RTS,
    name?: string,
  ): TupleType<
    RTS,
    [TypeOf<A>, TypeOf<B>, TypeOf<C>],
    [OutputOf<A>, OutputOf<B>, OutputOf<C>],
    mixed,
  >
  declare export function tuple<
    A: Mixed,
    B: Mixed,
    C: Mixed,
    D: Mixed,
    RTS: [A, B, C, D],
  >(
    types: RTS,
    name?: string,
  ): TupleType<
    RTS,
    [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>],
    [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>],
    mixed,
  >
  declare export function tuple<
    A: Mixed,
    B: Mixed,
    C: Mixed,
    D: Mixed,
    E: Mixed,
    RTS: [A, B, C, D, E],
  >(
    types: RTS,
    name?: string,
  ): TupleType<
    RTS,
    [TypeOf<A>, TypeOf<B>, TypeOf<C>, TypeOf<D>, TypeOf<E>],
    [OutputOf<A>, OutputOf<B>, OutputOf<C>, OutputOf<D>, OutputOf<E>],
    mixed,
  >

  //
  // readonly objects
  //

  declare export class ReadonlyType<+RT: Any, A = any, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +type: RT;
    +_tag: 'ReadonlyType';
    constructor(
      name: string,
      is: $PropertyType<ReadonlyType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<ReadonlyType<RT, A, O, I>, 'validate'>,
      encode: $PropertyType<ReadonlyType<RT, A, O, I>, 'encode'>,
      type: RT,
    ): ReadonlyType<RT, A, O, I>;
  }
  declare export var readonly: <RT: Mixed>(
    type: RT,
    name?: string,
  ) => ReadonlyType<
    RT,
    $ReadOnly<$PropertyType<RT, '_A'>>,
    $ReadOnly<$PropertyType<RT, '_O'>>,
    mixed,
  >

  //
  // readonly arrays
  //

  declare export class ReadonlyArrayType<
    +RT: Any,
    A = any,
    O = A,
    I = mixed,
  > extends Type<A, O, I> {
    +type: RT;
    +_tag: 'ReadonlyArrayType';
    constructor(
      name: string,
      is: $PropertyType<ReadonlyArrayType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<ReadonlyArrayType<RT, A, O, I>, 'validate'>,
      serialize: $PropertyType<ReadonlyArrayType<RT, A, O, I>, 'encode'>,
      type: RT,
    ): ReadonlyArrayType<RT, A, O, I>;
  }
  declare export var readonlyArray: <RT: Mixed>(
    type: RT,
    name?: string,
  ) => ReadonlyArrayType<RT, $ReadOnlyArray<TypeOf<RT>>>

  //
  // tagged unions
  //

  // declare type TaggedProps<Tag: string> = $ObjMap<Tag, <T>(v: Type<T>) => LiteralType<any>>
  // declare interface TaggedRefinement<Tag: string, A, O = A> extends RefinementType<Tagged<Tag>, A, O> {
  // }
  // declare interface TaggedUnion<Tag: string, A, O = A> extends UnionType<Array<Tagged<Tag>>, A, O> {
  // }
  // declare type TaggedIntersectionArgument<Tag: string> =
  //   | [Tagged<Tag>]
  //   | [Tagged<Tag>, Mixed]
  //   | [Mixed, Tagged<Tag>]
  //   | [Tagged<Tag>, Mixed, Mixed]
  //   | [Mixed, Tagged<Tag>, Mixed]
  //   | [Mixed, Mixed, Tagged<Tag>]
  //   | [Tagged<Tag>, Mixed, Mixed, Mixed]
  //   | [Mixed, Tagged<Tag>, Mixed, Mixed]
  //   | [Mixed, Mixed, Tagged<Tag>, Mixed]
  //   | [Mixed, Mixed, Mixed, Tagged<Tag>]
  //   | [Tagged<Tag>, Mixed, Mixed, Mixed, Mixed]
  //   | [Mixed, Tagged<Tag>, Mixed, Mixed, Mixed]
  //   | [Mixed, Mixed, Tagged<Tag>, Mixed, Mixed]
  //   | [Mixed, Mixed, Mixed, Tagged<Tag>, Mixed]
  //   | [Mixed, Mixed, Mixed, Mixed, Tagged<Tag>];
  // declare interface TaggedIntersection<Tag: string, A, O = A> extends IntersectionType<TaggedIntersectionArgument<Tag>, A, O> {
  // }
  // declare interface TaggedExact<Tag: string> extends ExactType<Tagged<Tag>> {
  // }
  // declare type Tagged<Tag: string, A = any, O = A> =
  //   | InterfaceType<TaggedProps<Tag>, A, O>
  //   | TaggedRefinement<Tag, A, O>
  //   | TaggedUnion<Tag, A, O>
  //   | TaggedIntersection<Tag, A, O>
  //   | TaggedExact<Tag>;
  // declare export var isTagged: <Tag: string>(tag: Tag) => (type: Mixed) => boolean;
  // declare export var getTagValue: <Tag: string>(tag: Tag) => (type: Tagged<Tag, any, any>) => string | number | boolean;
  // // declare export var taggedUnion: <Tag: string, RTS: Array<Tagged<Tag, any, any>>>(
  //   tag: Tag,
  //   types: RTS,
  //   name?: string
  // ) => UnionType<RTS, RTS["_A"]["_A"], RTS["_A"]["_O"], mixed>;

  //
  // exact objects
  //

  declare export class ExactType<RT: Any, A = any, O = A, I = mixed> extends Type<
    A,
    O,
    I,
  > {
    +type: RT;
    +_tag: 'ExactType';
    constructor(
      name: string,
      is: $PropertyType<ExactType<RT, A, O, I>, 'is'>,
      validate: $PropertyType<ExactType<RT, A, O, I>, 'validate'>,
      encode: $PropertyType<ExactType<RT, A, O, I>, 'encode'>,
      type: RT,
    ): ExactType<RT, A, O, I>;
  }
  declare interface HasPropsRefinement extends RefinementType<HasProps, any, any, any> {}
  declare interface HasPropsReadonly extends ReadonlyType<HasProps, any, any, any> {}
  // declare interface HasPropsIntersection extends IntersectionType<Array<HasProps>, any, any, any> {
  // }
  declare type HasProps =
    | HasPropsRefinement
    | HasPropsReadonly
    // | HasPropsIntersection
    | InterfaceType<any, any, any, any>
    | PartialType<any, any, any, any>
  declare export function exact<RT: HasProps>(
    type: RT,
    name?: string,
  ): ExactType<RT, $Exact<TypeOf<RT>>>

  //
  // Drops the runtime type "kind"
  //

  declare export function clean<A, O, I>(type: Type<A, O, I>): Type<A, O, I>
  declare export type PropsOf<T: { props: any }> = $PropertyType<T, 'props'>
  // declare export type Exact<T, X: T> = T & ... TODO: ne znam ovo da anotiram u flow-u, a i pitanje je da li je ovaj tip postoji kao flow util tip $Exact<T>

  //
  // Keeps the runtime type "kind"
  //

  // declare export function alias<A, O, P, I>(
  //   type: PartialType<P, A, O, I>
  // ): <AA: Exact<A, AA>, OO: Exact<O, OO>, PP: Exact<P, PP>, I: II>() => PartialType<PP, AA, OO, II>;
  // declare export function alias<A, O, P, I>(
  //   type: InterfaceType<P, A, O, I>
  // ): <AA: Exact<A, AA>, OO: Exact<O, OO>, PP: Exact<P, PP>, I: II>() => InterfaceType<PP, AA, OO, II>;

  //
  // alias export
  //

  declare export {
    nullType as null,
    undefinedType as undefined,
    arrayType as Array,
    type as interface,
  }
}

declare module 'io-ts/lib/PathReporter' {
  import type { Validation } from 'io-ts'

  declare interface Reporter<A> {
    report(validation: Validation<any>): A;
  }

  declare export var PathReporter: Reporter<Array<string>>
}
