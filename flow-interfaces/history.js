declare module 'history' {
  declare export type Location = {
    pathname: string,
    search: string,
    state: mixed,
    hash: string,
    key?: string,
  }
}
