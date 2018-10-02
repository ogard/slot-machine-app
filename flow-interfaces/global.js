declare function assertNever<T>(impossible: empty): T

declare type ExtractNullaryCons = <T>({ type: T }) => {| +type: T |}
declare type NullaryCons<C> = $Call<ExtractNullaryCons, C>
declare type ExtractUnaryCons = <T, V>(
  (V) => { type: T, value: V },
) => {| type: T, value: V |}
declare type UnaryCons<C> = $Call<ExtractUnaryCons, C>
