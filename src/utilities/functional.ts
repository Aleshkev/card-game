
let nextId = 1
export const newId = () => nextId++


/** Prefix of `xs` of length `n`. Empty for negative `n`. */
export function take<T>(xs: T[], n: number): T[] {
  return n <= 0 ? [] : xs.slice(0, n)
}

/** Split a list into a prefix of length `n` and the rest. */
export function splitAt<T>(xs: T[], n: number): [T[], T[]] {
  return n <= 0 ? [[], xs] : [xs.slice(0, n), xs.slice(n)];
}

/** Shuffle a list. */
export function shuffle<T>(xs: T[]): T[] {
  let xs_ = xs.slice()
  for (let i = xs_.length; i > 0;) {
    let j = Math.random() * i | 0
    --i;
    [xs_[i], xs_[j]] = [xs_[j], xs_[i]]
  }
  return xs_
}

/** Sort a list. */
export function sort<T>(xs: T[], compare: (a: T, b: T) => number): T[] {
  return xs.slice().sort(compare)
}

/** Returns elements in `xs` and not in `ys`, using `eq` to check equality. O(nm). */
export function diff<TX, TY>(xs: TX[], ys: TY[], eq: (x: TX, y: TY) => boolean): TX[] {
  return xs.filter(x => ys.every(y => !eq(x, y)))
}

/** Returns elements in `xs` that have an id not present in `ys`. O(nm). */
export function diffById<TId, T extends { id: TId }>(xs: T[], ys: T[]) {
  return diff(xs, ys, (x, y) => x.id === y.id)
}

/** Returns `xs` filtered by predicate `p` and also by `!p`. */
export function partition<T>(xs: T[], p: (x: T) => boolean): [T[], T[]] {
  let xsT: T[] = [], xsF: T[] = []
  xs.forEach(x => (p(x) ? xsT : xsF).push(x))
  return [xsT, xsF]
}

export function count<T>(xs: T[], p: (x: T) => boolean): number {
  return xs.reduce((s, x) => p(x) ? s + 1 : s, 0);
}

export function enumFromTo(a: number, b: number): number[] {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i)
}

export function pivot<T, TKey extends number>(xs: T[], toKey: (x: T) => TKey): Map<TKey, T[]> {
  const map: Map<TKey, T[]> = new Map()
  for (const x of xs) {
    const key = toKey(x)
    const l = map.get(key)
    if (l === undefined) {
      map.set(key, [x])
    } else {
      l.push(x)
    }
  }
  return new Map([...map.entries()].sort(([a, _], [b, _2]) => a - b))
}

export function bucket<T>(xs: T[], toIndex: (x: T) => number, n: number): T[][] {
  const arr: T[][] = Array.from({ length: n }, () => [])
  for (const x of xs) {
    const i = toIndex(x)
    console.assert(i < n, `Out of range: ${i}, ${n}`)
    arr[i].push(x)
  }
  return arr
}

export function maxBy<T>(xs: T[], toKey: (x: T) => number): T | null {
  if (xs.length === 0) return null
  let maxX = xs[0]
  let maxKey = toKey(xs[0])
  for (let x of xs) {
    const key = toKey(x)
    if (key > maxKey) {
      maxX = x
      maxKey = key
    }
  }
  return maxX
}