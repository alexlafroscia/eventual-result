class ErrWrappingValue extends Error {
  value: unknown;

  constructor(message: string, value: unknown = undefined) {
    const errorOptions: ErrorOptions = {};

    // If `value` is an `Error` instance, make use of the `cause` feature
    if (value instanceof Error) {
      errorOptions.cause = value;
    }

    super(message, errorOptions);

    this.value = value;
  }
}

export class UnwrapError extends ErrWrappingValue {}

export class ExpectError extends ErrWrappingValue {}
