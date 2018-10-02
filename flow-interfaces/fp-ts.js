declare module 'fp-ts/lib/function' {
  declare export type Refinement<A, B: A> = (a: A) => boolean
  declare export type Predicate<A> = (a: A) => boolean
  declare export type Lazy<A> = () => A
}

declare module 'fp-ts/lib/Either' {
  import type { Refinement, Predicate } from 'fp-ts/lib/function'

  declare var URI_: 'Either'
  declare type URI = typeof URI_

  declare export class Left<L, A> {
    +value: L;
    +_tag: 'Left';
    +_A: A;
    +_L: L;
    +_URI: URI;
    constructor(value: L): Left<L, A>;
    /** The given function is applied if this is a `Right` */
    map<B>(f: (a: A) => B): Either<L, B>;
    ap<B>(fab: Either<L, (a: A) => B>): Either<L, B>;
    ap_<B, C>(this_: Either<L, (b: B) => C>, fb: Either<L, B>): Either<L, C>;
    /** Binds the given function across `Right` */
    chain<B>(f: (a: A) => Either<L, B>): Either<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): Either<V, B>;
    alt(fy: Either<L, A>): Either<L, A>;
    /**
     * Lazy version of {@link alt}
     * @since 1.6.0
     * @param {(l: L) => Either<M, A>} fy - thunk
     * @example
     * assert.deepEqual(right(1).orElse(() => right(2)), right(1))
     * @returns {Either<M, A>}
     */
    orElse<M>(fy: (l: L) => Either<M, A>): Either<M, A>;
    extend<B>(f: (ea: Either<L, A>) => B): Either<L, B>;
    reduce<B>(b: B, f: (b: B, a: A) => B): B;
    /** Applies a function to each case in the data structure */
    fold<B>(whenLeft: (l: L) => B, whenRight: (a: A) => B): B;
    /** Returns the value from this `Right` or the given argument if this is a `Left` */
    getOrElse(a: A): A;
    /** Returns the value from this `Right` or the result of given argument if this is a `Left` */
    getOrElseL(f: (l: L) => A): A;
    /** Maps the left side of the disjunction */
    mapLeft<M>(f: (l: L) => M): Either<M, A>;
    inspect(): string;
    toString(): string;
    /** Returns `true` if the either is an instance of `Left`, `false` otherwise */
    // isLeft(): this is Left<L, A>;
    isLeft(): boolean;
    /** Returns `true` if the either is an instance of `Right`, `false` otherwise */
    // isRight(): this is Right<L, A>;
    isRight(): boolean;
    /** Swaps the disjunction values */
    swap(): Either<A, L>;
    /**
     * Returns `Right` with the existing value of `Right` if this is a `Right` and the given predicate `p` holds for the
     * right value, returns `Left(zero)` if this is a `Right` and the given predicate `p` does not hold for the right
     * value, returns `Left` with the existing value of `Left` if this is a `Left`.
     *
     * ```ts
     * right(12).filterOrElse(n => n > 10, -1) // right(12)
     * right(7).filterOrElse(n => n > 10, -1)  // left(-1)
     * left(12).filterOrElse(n => n > 10, -1)  // left(12)
     * ```
     * @since 1.3.0
     */
    filterOrElse(p: Predicate<A>, zero: L): Either<L, A>;
    /**
     * Lazy version of {@link filterOrElse}
     * @since 1.3.0
     */
    filterOrElseL(p: Predicate<A>, zero: (a: A) => L): Either<L, A>;
    /**
     * @since 1.6.0
     */
    refineOrElse<B: A>(p: Refinement<A, B>, zero: L): Either<L, B>;
    /**
     * Lazy version of {@link refineOrElse}
     * @since 1.6.0
     */
    refineOrElseL<B: A>(p: Refinement<A, B>, zero: (a: A) => L): Either<L, B>;
  }

  declare export class Right<L, A> {
    +value: A;
    +_tag: 'Right';
    +_A: A;
    +_L: L;
    +_URI: URI;
    constructor(value: A): Right<L, A>;
    map<B>(f: (a: A) => B): Either<L, B>;
    ap<B>(fab: Either<L, (a: A) => B>): Either<L, B>;
    ap_<B, C>(this_: Either<L, (b: B) => C>, fb: Either<L, B>): Either<L, C>;
    chain<B>(f: (a: A) => Either<L, B>): Either<L, B>;
    bimap<V, B>(f: (l: L) => V, g: (a: A) => B): Either<V, B>;
    alt(fy: Either<L, A>): Either<L, A>;
    orElse<M>(fy: (l: L) => Either<M, A>): Either<M, A>;
    extend<B>(f: (ea: Either<L, A>) => B): Either<L, B>;
    reduce<B>(b: B, f: (b: B, a: A) => B): B;
    fold<B>(whenLeft: (l: L) => B, whenRight: (a: A) => B): B;
    getOrElse(a: A): A;
    getOrElseL(f: (l: L) => A): A;
    mapLeft<M>(f: (l: L) => M): Either<M, A>;
    inspect(): string;
    toString(): string;
    // isLeft(): this is Left<L, A>;
    isLeft(): boolean;
    // isRight(): this is Right<L, A>;
    isRight(): boolean;
    swap(): Either<A, L>;
    filterOrElse(p: Predicate<A>, zero: L): Either<L, A>;
    filterOrElseL(p: Predicate<A>, zero: (a: A) => L): Either<L, A>;
    refineOrElse<B: A>(p: Refinement<A, B>, zero: L): Either<L, B>;
    refineOrElseL<B: A>(p: Refinement<A, B>, zero: (a: A) => L): Either<L, B>;
  }

  declare export type Either<L, A> = Left<L, A> | Right<L, A>
}

declare module 'fp-ts/lib/Option' {
  import type { Lazy, Refinement, Predicate } from 'fp-ts/lib/function'

  declare var URI_: 'Option'
  declare type URI = typeof URI_

  declare export class None<+A> {
    static value: Option<empty>;
    +_tag: 'None';
    +_A: A;
    +_URI: URI;
    /**
     * Takes a function `f` and an `Option` of `A`. Maps `f` either on `None` or `Some`, Option's data constructors. If it
     * maps on `Some` then it will apply the `f` on `Some`'s value, if it maps on `None` it will return `None`.
     *
     * @example
     * assert.deepEqual(some(1).map(n => n * 2), some(2))
     */
    map<B>(f: (a: A) => B): Option<B>;
    /**
     * Maps `f` over this `Option`'s value. If the value returned from `f` is null or undefined, returns `None`
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * interface Foo {
     *   bar?: {
     *     baz?: string
     *   }
     * }
     *
     * assert.deepEqual(
     *   some<Foo>({ bar: { baz: 'quux' } })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   some('quux')
     * )
     * assert.deepEqual(
     *   some<Foo>({ bar: {} })
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     * assert.deepEqual(
     *   some<Foo>({})
     *     .mapNullable(foo => foo.bar)
     *     .mapNullable(bar => bar.baz),
     *   none
     * )
     */
    mapNullable<B>(f: (a: A) => B | null | void): Option<B>;
    /**
     * `ap`, some may also call it "apply". Takes a function `fab` that is in the context of `Option`, and applies that
     * function to this `Option`'s value. If the `Option` calling `ap` is `none` it will return `none`.
     *
     * @example
     * assert.deepEqual(some(2).ap(some(x => x + 1)), some(3))
     * assert.deepEqual(none.ap(some(x => x + 1)), none)
     */
    ap<B>(fab: Option<(a: A) => B>): Option<B>;
    /**
     * Similar to `ap` but instead of taking a function it takes `some` value or `none`, then applies this `Option`'s
     * wrapped function to the `some` or `none`. If the `Option` calling `ap_` is `none` it will return `none`.
     *
     * @example
     * assert.deepEqual(some(x => x + 1).ap_(some(2)), some(3))
     * assert.deepEqual(none.ap_(some(2)), none)
     */
    ap_<B, C>(this_: Option<(b: B) => C>, fb: Option<B>): Option<C>;
    /**
     * Returns the result of applying f to this `Option`'s value if this `Option` is nonempty. Returns `None` if this
     * `Option` is empty. Slightly different from `map` in that `f` is expected to return an `Option` (which could be
     * `None`)
     */
    chain<B>(f: (a: A) => Option<B>): Option<B>;
    reduce<B>(b: B, f: (b: B, a: A) => B): B;
    /**
     * `alt` short for alternative, takes another `Option`. If this `Option` is a `Some` type then it will be returned, if
     * it is a `None` then it will return the next `Some` if it exist. If both are `None` then it will return `none`.
     *
     * @example
     * const someFn = (o: Option<number>) => o.alt(some(4))
     * assert.deepEqual(someFn(some(2)), some(2))
     * assert.deepEqual(someFn(none), none)
     */
    alt(fa: Option<A>): Option<A>;
    /**
     * Lazy version of {@link alt}
     * @since 1.6.0
     * @param {Lazy<Option<A>>} fa - thunk
     * @example
     * assert.deepEqual(some(1).orElse(() => some(2)), some(1))
     * @returns {Option<A>}
     */
    orElse(fa: Lazy<Option<A>>): Option<A>;
    extend<B>(f: (ea: Option<A>) => B): Option<B>;
    /**
     * Applies a function to each case in the data structure
     *
     * @example
     * import { none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).fold('none', a => `some: ${a}`), 'some: 1')
     * assert.strictEqual(none.fold('none', a => `some: ${a}`), 'none')
     */
    fold<B>(b: B, whenSome: (a: A) => B): B;
    /** Lazy version of `fold` */
    foldL<B>(whenNone: () => B, whenSome: (a: A) => B): B;
    /**
     * Returns the value from this `Some` or the given argument if this is a `None`
     *
     * @example
     * import { Option, none, some } from 'fp-ts/lib/Option'
     *
     * assert.strictEqual(some(1).getOrElse(0), 1)
     * assert.strictEqual((none as Option<number>).getOrElse(0), 0)
     */
    getOrElse(a: A): A;
    /** Lazy version of `getOrElse` */
    getOrElseL(f: () => A): A;
    /** Returns the value from this `Some` or `null` if this is a `None` */
    toNullable(): A | null;
    /** Returns the value from this `Some` or `undefined` if this is a `None` */
    toUndefined(): A | void;
    inspect(): string;
    toString(): string;

    /** Returns `true` if the option has an element that is equal (as determined by `S`) to `a`, `false` otherwise */
    // TODO: ako zatreba, tipizirati Setoid
    // contains(S: Setoid<A>, a: A): boolean;

    /** Returns `true` if the option is `None`, `false` otherwise */
    // isNone(): this is None<A>;
    isNone(): boolean;
    /** Returns `true` if the option is an instance of `Some`, `false` otherwise */
    // isSome(): this is Some<A>;
    isSome(): boolean;
    /**
     * Returns `true` if this option is non empty and the predicate `p` returns `true` when applied to this Option's value
     */
    exists(p: (a: A) => boolean): boolean;
    /**
     * Returns this option if it is non empty and the predicate `p` return `true` when applied to this Option's value.
     * Otherwise returns `None`
     */
    filter(p: Predicate<A>): Option<A>;
    /**
     * Returns this option refined as `Option<B>` if it is non empty and the `refinement` returns `true` when applied to
     * this Option's value. Otherwise returns `None`
     * @since 1.3.0
     */
    refine<B: A>(refinement: Refinement<A, B>): Option<B>;
  }
  declare export var none: Option<empty>

  declare export class Some<+A> {
    +value: A;
    +_tag: 'Some';
    +_A: A;
    +_URI: URI;
    constructor(value: A): Some<A>;
    map<B>(f: (a: A) => B): Option<B>;
    mapNullable<B>(f: (a: A) => B | null | void): Option<B>;
    ap<B>(fab: Option<(a: A) => B>): Option<B>;
    ap_<B, C>(this_: Option<(b: B) => C>, fb: Option<B>): Option<C>;
    chain<B>(f: (a: A) => Option<B>): Option<B>;
    reduce<B>(b: B, f: (b: B, a: A) => B): B;
    alt(fa: Option<A>): Option<A>;
    orElse(fa: Lazy<Option<A>>): Option<A>;
    extend<B>(f: (ea: Option<A>) => B): Option<B>;
    fold<B>(b: B, whenSome: (a: A) => B): B;
    foldL<B>(whenNone: () => B, whenSome: (a: A) => B): B;
    getOrElse(a: A): A;
    getOrElseL(f: () => A): A;
    toNullable(): A | null;
    toUndefined(): A | void;
    inspect(): string;
    toString(): string;

    // TODO: ako zatreba, tipizirati Setoid
    // contains(S: Setoid<A>, a: A): boolean;

    // isNone(): this is None<A>;
    isNone(): boolean;
    // isSome(): this is Some<A>;
    isSome(): boolean;
    exists(p: (a: A) => boolean): boolean;
    filter(p: Predicate<A>): Option<A>;
    refine<B: A>(refinement: Refinement<A, B>): Option<B>;
  }
  declare export var some: <A>(a: A) => Option<A>

  declare export type Option<+A> = None<A> | Some<A>
}

declare module 'fp-ts/lib/Task' {
  import type { Lazy } from 'fp-ts/lib/function'

  declare var URI_: 'Task'
  declare type URI = typeof URI_

  declare export class Task<A> {
    +run: Lazy<Promise<A>>;
    +_A: A;
    +_URI: URI;
    constructor(run: Lazy<Promise<A>>): Task<A>;
    map<B>(f: (a: A) => B): Task<B>;
    ap<B>(fab: Task<(a: A) => B>): Task<B>;
    ap_<B, C>(this_: Task<(b: B) => C>, fb: Task<B>): Task<C>;
    /**
     * Combine two effectful actions, keeping only the result of the first
     * @since 1.6.0
     */
    applyFirst<B>(fb: Task<B>): Task<A>;
    /**
     * Combine two effectful actions, keeping only the result of the second
     * @since 1.5.0
     */
    applySecond<B>(fb: Task<B>): Task<B>;
    chain<B>(f: (a: A) => Task<B>): Task<B>;
    inspect(): string;
    toString(): string;
  }
}
