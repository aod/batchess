import {
  SquareNotation,
  extractSNotation,
  squareNotation,
} from "@/lib/AN/Square";
import Rank from "@/lib/Rank";
import File from "@/lib/File";
import { nxtChr } from "@/util/string";

export function* horiz(from: SquareNotation): Generator<SquareNotation> {
  yield* horizR(from);
  yield* horizL(from);
}

export function* vert(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  yield* vertT(from);
  yield* vertB(from);
}

export function* diags(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  yield* diagsTL(from);
  yield* diagsTR(from);
  yield* diagsBL(from);
  yield* diagsBR(from);
}

export function* horizR(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const [f, r] = extractSNotation(from);
  for (let i = nxtChr(f); i <= "h"; i = nxtChr(i)) {
    yield squareNotation(i as File, r);
  }
}

export function* horizL(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const [f, r] = extractSNotation(from);
  for (let i = nxtChr(f, -1); i >= "a"; i = nxtChr(i, -1)) {
    yield squareNotation(i as File, r);
  }
}

export function* vertT(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const [f, r] = extractSNotation(from);
  for (let i = r + 1; i <= 8; i++) {
    yield squareNotation(f, i as Rank);
  }
}

export function* vertB(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const [f, r] = extractSNotation(from);
  for (let i = r - 1; i >= 1; i--) {
    yield squareNotation(f, i as Rank);
  }
}

export function* diagsTL(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const hlIt = horizL(from);
  for (const vt of vertT(from)) {
    const hl = hlIt.next();
    if (hl.done) break;
    const [, rvt] = extractSNotation(vt);
    const [fhl] = extractSNotation(hl.value);
    yield squareNotation(fhl, rvt);
  }
}

export function* diagsTR(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const hrIt = horizR(from);
  for (const vt of vertT(from)) {
    const hr = hrIt.next();
    if (hr.done) break;
    const [, rvt] = extractSNotation(vt);
    const [fhl] = extractSNotation(hr.value);
    yield squareNotation(fhl, rvt);
  }
}

export function* diagsBL(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const hlIt = horizL(from);
  for (const vb of vertB(from)) {
    const hl = hlIt.next();
    if (hl.done) break;
    const [, rvt] = extractSNotation(vb);
    const [fhl] = extractSNotation(hl.value);
    yield squareNotation(fhl, rvt);
  }
}

export function* diagsBR(
  from: Readonly<SquareNotation>
): Generator<SquareNotation> {
  const hrIt = horizR(from);
  for (const vb of vertB(from)) {
    const hr = hrIt.next();
    if (hr.done) break;
    const [, rvt] = extractSNotation(vb);
    const [fhl] = extractSNotation(hr.value);
    yield squareNotation(fhl, rvt);
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("should return all left squares of d5", () => {
    const it = horizL("d5");
    const actual = [...it];
    const expected = ["c5", "b5", "a5"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return all right squares of d5", () => {
    const it = horizR("d5");
    const actual = [...it];
    const expected = ["e5", "f5", "g5", "h5"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return all left and right squares of d5", () => {
    const it = horiz("d5");
    const actual = [...it];
    const expected = ["c5", "b5", "a5", "e5", "f5", "g5", "h5"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return all top squares of d5", () => {
    const it = vertT("d5");
    const actual = [...it];
    const expected = ["d6", "d7", "d8"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return all bottom squares of d5", () => {
    const it = vertB("d5");
    const actual = [...it];
    const expected = ["d4", "d3", "d2", "d1"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return all top and bottom squares of d5", () => {
    const it = vert("d5");
    const actual = [...it];
    const expected = ["d6", "d7", "d8", "d4", "d3", "d2", "d1"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });

  it("should return correct diaganol squares of d5", () => {
    const it = diags("b5");
    const actual = [...it];
    const expected = ["a6", "c6", "d7", "e8", "a4", "c4", "d3", "e2", "f1"];
    expect(actual.sort()).toStrictEqual(expected.sort());
  });
}
