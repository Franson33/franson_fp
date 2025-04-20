// src/Either.ts

/**
 * Represents the failure case of an operation.
 * It holds an error value of type L (for "Left").
 * The `_tag` property is a literal type used by TypeScript
 * to distinguish this interface from `Right` within the `Either` union.
 * Properties are marked `readonly` to encourage immutability.
 */
interface Left<L> {
  readonly _tag: 'Left'; // The discriminant property
  readonly value: L; // The error value
}

/**
 * Represents the success case of an operation.
 * It holds a success value of type R (for "Right").
 * The `_tag` property distinguishes it from `Left`.
 * Properties are marked `readonly`.
 */
interface Right<R> {
  readonly _tag: 'Right'; // The discriminant property
  readonly value: R; // The success value
}

/**
 * Represents a value that can be one of two possibilities:
 * - Left<L>: Represents a failure/error case, holding an error value of type L.
 * - Right<R>: Represents a success case, holding a success value of type R.
 *
 * This is a tagged union type, discriminated by the `_tag` property.
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Constructs a Left value.
 * Represents the failure case of an operation.
 *
 * @param value The error value to wrap.
 * @returns An Either object tagged as "Left".
 */
export const left = <L, R = never>(value: L): Either<L, R> => ({
  _tag: 'Left',
  value,
});

/**
 * Constructs a Right value.
 * Represents the success case of an operation.
 *
 * @param value The success value to wrap.
 * @returns An Either object tagged as "Right".
 */
export const right = <R, L = never>(value: R): Either<L, R> => ({
  _tag: 'Right',
  value,
});

/**
 * Type guard function to check if an Either value is Left.
 * If it returns true, TypeScript narrows the type of `e` to `Left<L>`
 * within the scope where the check is performed.
 *
 * @param e The Either value to check.
 * @returns True if `e` is Left, false otherwise.
 */
export const isLeft = <L, R>(e: Either<L, R>): e is Left<L> => e._tag === 'Left';

/**
 * Type guard function to check if an Either value is Right.
 * If it returns true, TypeScript narrows the type of `e` to `Right<R>`
 * within the scope where the check is performed.
 *
 * @param e The Either value to check.
 * @returns True if `e` is Right, false otherwise.
 */
export const isRight = <L, R>(e: Either<L, R>): e is Right<R> => e._tag === 'Right';

/**
 * Takes two functions, `onLeft` and `onRight`, and applies the appropriate
 * function based on whether the `Either` is Left or Right.
 * This is the primary way to "get a value out" of an Either in a safe way,
 * as it forces handling both cases.
 *
 * @param onLeft Function to execute if the Either is Left. Takes the Left value (L) and returns a value of type T.
 * @param onRight Function to execute if the Either is Right. Takes the Right value (R) and returns a value of type T.
 * @param e The Either value to fold.
 * @returns The result of executing either onLeft or onRight (type T).
 */
export const fold =
  <L, R, T>(onLeft: (l: L) => T, onRight: (r: R) => T) =>
  (e: Either<L, R>): T => {
    switch (e._tag) {
      case 'Left':
        return onLeft(e.value);
      case 'Right':
        return onRight(e.value);
    }
  };

/**
 * Applies a function `f` to the value inside a `Right`, returning a new `Right`
 * containing the result. If the `Either` is `Left`, it returns the original `Left`
 * unchanged (but with potentially updated types).
 * This allows transforming the success value without leaving the `Either` context.
 *
 * @param f The function to apply to the Right value. Takes R, returns R2.
 * @param e The Either value to map over.
 * @returns A new Either<L, R2>. If the input was Left<L>, it returns Left<L>.
 *          If the input was Right<R>, it returns Right<R2>.
 */
export const map =
  <R, R2>(f: (r: R) => R2) =>
  <L>(e: Either<L, R>): Either<L, R2> =>
    isRight(e) ? right(f(e.value)) : e;

// TODO: Continue to add the methods, flatMap, compose, pipe, etc.
