import { MyEasyElement } from './main';

declare global {
  interface HTMLElementTagNameMap {
    'easy-element': MyEasyElement
  }
}

type GetChars<S> =
  S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;

type GetChars<S> = GetCharsHelper<S, never>;
type GetCharsHelper<S, Acc> =
  S extends `${infer Char}${infer Rest}` ? GetCharsHelper<Rest, Char | Acc> : Acc;


type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function area(shape: Shape): number {
  // Extract out the 'kind' field first.
  const { kind } = shape;

  if (kind === "circle") {
    // We know we have a circle here!
    return Math.PI * shape.radius ** 2;
  } else {
    // We know we're left with a square here!
    return shape.sideLength ** 2;
  }
}

area({
  kind: 'square',
  
})