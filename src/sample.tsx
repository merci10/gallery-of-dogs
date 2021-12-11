export {};

function mapFromArray<T, U extends keyof T>(arr: T[], key: U) {
  const result = new Map<T[U], T>();
  for (const obj of arr) {
    result.set(obj[key], obj);
  }
  return result;
}

// 使用例
const data = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Mary Sue" },
  { id: 100, name: "Taro Yamada" },
];
const dataMap = mapFromArray(data, "name");
/*
dataMapは
Map {
  1 => { id: 1, name: 'John Smith' },
  2 => { id: 2, name: 'Mary Sue' },
  100 => { id: 100, name: 'Taro Yamada' }
}
というMapになる
*/

// エラー例
mapFromArray(data, "age");

// ============================================================================================

type MyPartial<T> = { [P in keyof T]?: T[P] };

// 使用例
/*
 * T1は { foo?: number; bar?: string; } となる
 */
type T1 = MyPartial<{
  foo: number;
  bar: string;
}>;
/*
 * T2は { hoge?: { piyo: number; } } となる
 */
type T2 = MyPartial<{
  hoge: {
    piyo: number;
  };
}>;

// ============================================================================================

interface EventPayloads {
  start: {
    user: string;
  };
  stop: {
    user: string;
    after: number;
  };
  end: {};
}

interface EventPayloads2 {
  start: {
    user: string;
  };
  pending: {
    user: string;
    next: string;
  };
  end: {
    nextUser: string;
  };
}

class EventDischarger<E> {
  emit<T extends keyof E>(eventName: T, payload: E[T]) {
    // 省略
  }
}

// 使用例
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
  user: "user1",
});
ed.emit("stop", {
  user: "user1",
  after: 3,
});
ed.emit("end", {});

ed.emit("stop", {
  user: "yuma",
});
const ed2 = new EventDischarger<EventPayloads2>();
ed2.emit("start", {
  user: "user1",
});
ed2.emit("pending", {
  user: "user1",
  next: "next-user",
});
ed2.emit("end", {
  nextUser: "next-user",
});

// エラー例
ed.emit("start", {
  user: "user2",
  after: 0,
});
ed.emit("stop", {
  user: "user2",
});
ed.emit("foobar", {
  foo: 123,
});

// ============================================================================================
type Action =
  | {
      type: "increment";
      amount: number;
    }
  | {
      type: "decrement";
      amount: number;
    }
  | {
      type: "reset";
      value: number;
    }
  | {
      type: "time";
      value: number;
    };

const reducer = (state: number, action: Action): number => {
  switch (action.type) {
    case "increment":
      return state + action.amount;
    case "decrement":
      return state - action.amount;
    case "reset":
      return action.value;
    case "time":
      return state * action.value;
  }
};

// 使用例
reducer(100, {
  type: "increment",
  amount: 10,
}) === 110;
reducer(100, {
  type: "decrement",
  amount: 55,
}) === 45;
reducer(500, {
  type: "reset",
  value: 0,
}) === 0;
reducer(200, {
  type: "reset",
  amount: 70000000,
});

// エラー例
reducer(0, {
  type: "increment",
  value: 100,
});

// ============================================================================================

// type Func<A, R> = (arg: A) => R;
type Func<A, R> = undefined extends A ? (arg?: A) => R : (arg: A) => R;

// 使用例
const f1: Func<number, number> = (num) => num + 10;
const v1: number = f1(10);

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = (num) => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// エラー例
const v6: number = f1();

// ============================================================================================

declare function getFoo2<T extends object>(
  obj: T
): "foo" extends keyof T ? T["foo"] : unknown;

function getFoo<T extends object>(
  obj: T
): T extends { foo: infer U } ? U : unknown {
  return (obj as any).foo;
}

// 使用例
// numはnumber型
const num = getFoo2({
  foo: 123,
});
// strはstring型
const str = getFoo2({
  foo: "hoge",
  bar: 0,
});
// unkはunknown型
const unk = getFoo2({
  hoge: true,
});

// エラー例
getFoo(123);
getFoo(null);

const foo: object = { foo: "string", bar: 100 };

// ============================================================================================

function giveId<T extends object>(obj: T): Omit<T, "id"> & { id: string } {
  const id = "本当はランダムがいいけどここではただの文字列";
  return {
    ...obj,
    id,
  };
}

// 使用例
/*
 * obj1の型は { foo: number; id: string } 型
 */
const obj1 = giveId({ foo: 123 });
/*
 * obj2の型は { num : number; id: string } 型
 */
const obj2 = giveId({
  num: 0,
  id: 100,
});
// obj2のidはstring型なので別の文字列を代入できる
obj2.id = "";

type Fooo = Pick<{ foo: string; bar: number; baz: boolean }, "foo" | "baz">;
type Fooo2 = Omit<{ foo: string; bar: number; baz: boolean }, "bar">;

// ============================================================================================

// 使用例
type PartiallyPartial<T, U extends keyof T> = Partial<Pick<T, U>> & Omit<T, U>;

// 元のデータ
interface Data {
  foo: number;
  bar: string;
  baz: string;
}
/*
 * T1は { foo?: number; bar?: string; baz: string } 型
 */
type T11 = PartiallyPartial<Data, "foo" | "bar">;
const t11: T11 = {
  baz: "taco",
};

// ============================================================================================

type AtLeastOne<T, K extends keyof T = keyof T> = K extends string
  ? PartiallyPartial<T, Exclude<keyof T, K>>
  : never;

// type AtLeastOne<T, K extends keyof T = keyof T> = K extends string
//   ? Partial<T> & { [k in K]: T[K] }
//   : never;

// 使用例
interface Options {
  foo: number;
  bar: string;
  baz: boolean;
}
function test(options: AtLeastOne<Options>) {
  const { foo, bar, baz } = options;
  // 省略
}
test({
  foo: 123,
  bar: "bar",
});
test({
  baz: true,
});

// エラー例
test({});

// PartiallyPartial<Options, "foo" | "bar"> | PartiallyPartial<Options, "foo" | "baz"> | PartiallyPartial<Options, "bar" | "baz">

// ============================================================================================
// 4-6

type Page =
  | {
      page: "top";
    }
  | {
      page: "mypage";
      userName: string;
    }
  | {
      page: "ranking";
      articles: string[];
    };

type PageGenerators = {
  [P in Page["page"]]: (page: Extract<Page, { page: P }>) => string;
};

type TEST = Extract<
  { foo: string; bar: number } | { foo: string; hoge: boolean },
  { bar: number }
>;

const pageGenerators: PageGenerators = {
  top: () => "<p>top page</p>",
  mypage: ({ userName }) => `<p>Hello, ${userName}!</p>`,
  ranking: ({ articles }) =>
    `<h1>ranking</h1>
         <ul>
        ${articles.map((name) => `<li>${name}</li>`).join("")}</ul>`,
};
const renderPage = (page: Page) => pageGenerators[page.page](page as any);

// ============================================================================================
// 4-7

type KeysOfType<Obj, Val> = {
  [P in keyof Obj]-?: Obj[P] extends Val ? P : never;
}[keyof Obj];

// 使用例
type Data2 = {
  foo: string;
  bar: number;
  baz: boolean;

  hoge?: string;
  fuga: string;
  piyo?: number;
};

type Data2Keys = {
  foo: "foo";
  bar: never;
  baz: never;

  hoge?: never;
  fuga: "fuga";
  piyo?: never;
};

// "foo" | "fuga"
// ※ "hoge" は string | undefiendなので含まない
type StringKeys = KeysOfType<Data2, string>;

function useNumber<Obj>(obj: Obj, key: KeysOfType<Obj, number>) {
  // ヒント: ここはanyを使わざるを得ない
  const num: number = (obj as any)[key];
  return num * 10;
}

declare const data2: Data2;

// これはOK
useNumber(data2, "bar");
// これは型エラー
useNumber(data2, "baz");

// ============================================================================================
// 4-8

type OptionalKeys<Obj> = {
  [P in keyof Obj]-?: Omit<Obj, P> extends Obj ? P : never;
}[keyof Obj];

// type PickUndefined<Obj> = {
//   [K in keyof Obj]-?: undefined extends Obj[K] ? K : never
// }[keyof Obj];

// type MapToNever<Obj> = {
//   [K in keyof Obj] : never
// }

// type OptionalKeys<Obj> = PickUndefined<MapToNever<Obj>>

// 使用例
type Data3 = {
  foo: string;
  bar?: number;
  baz?: boolean;

  hoge: undefined;
  piyo?: undefined;
};

// "bar" | "baz" | "piyo"
type T = OptionalKeys<Data3>;

type Data3mod = {
  foo: never;
  bar: "bar";
  baz: "baz";

  hoge: never;
  piyo: "piyo";
};

// ============================================================================================

import { useState, useEffect } from "react";

type FetchState<T> = {
  data: T | undefined;
  loading: boolean;
  error?: unknown;
};
function useFetch<T>(...args: Parameters<typeof fetch>) {
  const [info, init] = args;
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    loading: true,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      fetch(info, init)
        .then((r) => r.json())
        .then((data) => setState({ loading: false, data }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false, error }));
    }
  }, [info, init]);

  return state;
}

const [hoge, setHoge] = useState("");
const state = useFetch(`https://api.github.com/y-hiraoka?foo=${hoge}`);
