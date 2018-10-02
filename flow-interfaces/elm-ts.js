declare module 'elm-ts/lib/Cmd' {
  import type { Task } from 'fp-ts/lib/Task'
  import type { Observable } from 'rxjs/Observable'
  import type { Option } from 'fp-ts/lib/Option'

  declare export type Cmd<msg> = Observable<Task<Option<msg>>>
  // declare export var none: Cmd<empty>;
  declare export var none: Cmd<any>
  declare export function map<a, msg>(cmd: Cmd<a>, f: (a: a) => msg): Cmd<msg>
  declare export function batch<msg>(arr: Array<Cmd<msg>>): Cmd<msg>
}

declare module 'elm-ts/lib/Sub' {
  import type { Observable } from 'rxjs/Observable'

  declare export type Sub<+msg> = Observable<msg>
  declare export var none: Sub<empty>
  declare export function map<a, msg>(sub: Sub<a>, f: (a: a) => msg): Sub<msg>
  declare export function batch<msg>(arr: Array<Sub<msg>>): Sub<msg>
}

// import { Task as TaskClass } from 'fp-ts/lib/Task';
declare module 'elm-ts/lib/Task' {
  import type { Either } from 'fp-ts/lib/Either'
  import type { Cmd } from 'elm-ts/lib/Cmd'
  declare export var Task: $PropertyType<$Exports<'fp-ts/lib/Task'>, 'Task'>
  declare export function perform<a, msg>(task: Task<a>, f: (a: a) => msg): Cmd<msg>
  declare export function sequence<a>(tasks: Array<Task<a>>): Task<Array<a>>
  declare export function attempt<e, a, msg>(
    task: Task<Either<e, a>>,
    f: (e: Either<e, a>) => msg,
  ): Cmd<msg>
}

declare module 'elm-ts/lib/Time' {
  import type { Task } from 'fp-ts/lib/Task'
  import type { Sub } from 'elm-ts/lib/Sub'

  declare export type Time = number
  declare export function now(): Task<Time>
  declare export function every<msg>(time: Time, f: (time: Time) => msg): Sub<msg>
}

declare module 'elm-ts/lib/Decode' {
  import type { Either } from 'fp-ts/lib/Either'
  import type { Type } from 'io-ts'

  declare export interface Decoder<a> {
    decode: (value: mixed) => Either<string, a>;
  }
  declare export function decodeJSON<a>(
    decoder: Decoder<a>,
    value: mixed,
  ): Either<string, a>
  declare export function map<a, b>(fa: Decoder<a>, f: (a: a) => b): Decoder<b>
  declare export function fromType<a>(type: Type<a, any, mixed>): Decoder<a>
}

declare module 'elm-ts/lib/Http' {
  import type { Cmd } from 'elm-ts/lib/Cmd'
  import type { Decoder } from 'elm-ts/lib/Decode'
  import type { Time } from 'elm-ts/lib/Time'
  import type { Either } from 'fp-ts/lib/Either'
  import type { Option } from 'fp-ts/lib/Option'

  declare export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
  declare export type Expect<a> = (value: mixed) => Either<string, a>
  declare export type Request<a> = {
    method: Method,
    headers: {
      [key: string]: string,
    },
    url: string,
    body?: mixed,
    expect: Expect<a>,
    timeout: Option<Time>,
    withCredentials: boolean,
  }
  declare export class BadUrl {
    +value: string;
    +_tag: 'BadUrl';
    constructor(value: string): BadUrl;
  }
  declare export class Timeout {
    +_tag: 'Timeout';
  }
  declare export class NetworkError {
    +value: string;
    +_tag: 'NetworkError';
    constructor(value: string): NetworkError;
  }
  declare export class BadStatus {
    +response: Response<string>;
    +_tag: 'BadStatus';
    constructor(response: Response<string>): BadStatus;
  }
  declare export class BadPayload {
    +value: string;
    +response: Response<string>;
    +_tag: 'BadPayload';
    constructor(value: string, response: Response<string>): BadPayload;
  }
  declare export type HttpError = BadUrl | Timeout | NetworkError | BadStatus | BadPayload
  declare export type Response<body> = {
    url: string,
    status: {
      code: number,
      message: string,
    },
    headers: {
      [key: string]: string,
    },
    body: body,
  }
  declare export function expectJson<a>(decoder: Decoder<a>): Expect<a>
  declare export function send<a, msg>(
    req: Request<a>,
    f: (e: Either<HttpError, a>) => msg,
  ): Cmd<msg>
  declare export function get<a>(url: string, decoder: Decoder<a>): Request<a>
}

declare module 'elm-ts/lib/Platform' {
  import type { Observable } from 'rxjs/Observable'
  import type { Cmd } from 'elm-ts/lib/Cmd'
  import type { Sub } from 'elm-ts/lib/Sub'

  declare export interface Dispatch<msg> {
    (msg: msg): void;
  }
  declare export interface Program<model, msg> {
    dispatch: Dispatch<msg>;
    cmd$: Cmd<msg>;
    sub$: Sub<msg>;
    model$: Observable<model>;
  }
  declare export function program<model, msg>(
    init: [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    subscriptions?: (model: model) => Sub<msg>,
  ): Program<model, msg>
  declare export function programWithFlags<flags, model, msg>(
    init: (flags: flags) => [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    subscriptions?: (model: model) => Sub<msg>,
  ): (flags: flags) => Program<model, msg>
  declare export function run<model, msg>(program: Program<model, msg>): Observable<model>
}

declare module 'elm-ts/lib/Html' {
  import type { Observable } from 'rxjs/Observable'
  import type { Program as Program_, Dispatch } from 'elm-ts/lib/Platform'
  import type { Cmd } from 'elm-ts/lib/Cmd'
  import type { Sub } from 'elm-ts/lib/Sub'

  declare export interface Html<dom, msg> {
    (dispatch: Dispatch<msg>): dom;
  }
  declare export interface Renderer<dom> {
    (dom: dom): void;
  }
  declare export function map<dom, a, msg>(
    ha: Html<dom, a>,
    f: (a: a) => msg,
  ): Html<dom, msg>
  declare export interface Program<model, msg, dom> extends Program_<model, msg> {
    html$: Observable<Html<dom, msg>>;
  }
  declare export function program<model, msg, dom>(
    init: [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): Program<model, msg, dom>
  declare export function programWithFlags<flags, model, msg, dom>(
    init: (flags: flags) => [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): (flags: flags) => Program<model, msg, dom>
  declare export function run<model, msg, dom>(
    program: Program<model, msg, dom>,
    renderer: Renderer<dom>,
  ): Observable<model>
}

declare module 'elm-ts/lib/React' {
  import type { Cmd } from 'elm-ts/lib/Cmd'
  import type { Observable } from 'rxjs/Observable'
  import type { Sub } from 'elm-ts/lib/Sub'
  import type { Program as Program_, Html as Html_, Renderer } from 'elm-ts/lib/Html'

  declare export type dom = React$Element<any>
  declare export type Html<msg> = Html_<dom, msg>
  declare export function map<a, msg>(ha: Html<a>, f: (a: a) => msg): Html<msg>
  declare export type Program<model, msg> = Program_<model, msg, dom>
  declare export function program<model, msg>(
    init: [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html_<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): Program<model, msg>
  declare export function programWithFlags<flags, model, msg>(
    init: (flags: flags) => [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html_<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): (flags: flags) => Program<model, msg>
  declare export function run<model, msg>(
    program: Program<model, msg>,
    renderer: Renderer<dom>,
  ): Observable<model>
}

declare module 'elm-ts/lib/Navigation' {
  import type { Location as HistoryLocation } from 'history'
  import type { Cmd } from 'elm-ts/lib/Cmd'
  import type { Sub } from 'elm-ts/lib/Sub'
  import type { Program, Html } from 'elm-ts/lib/Html'

  declare export type Location = HistoryLocation
  declare export function push<msg>(url: string): Cmd<msg>
  declare export function program<model, msg, dom>(
    locationToMessage: (location: Location) => msg,
    init: (location: Location) => [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): Program<model, msg, dom>
  declare export function programWithFlags<flags, model, msg, dom>(
    locationToMessage: (location: Location) => msg,
    init: (flags: flags) => (location: Location) => [model, Cmd<msg>],
    update: (msg: msg, model: model) => [model, Cmd<msg>],
    view: (model: model) => Html<dom, msg>,
    subscriptions?: (model: model) => Sub<msg>,
  ): (flags: flags) => Program<model, msg, dom>
}
