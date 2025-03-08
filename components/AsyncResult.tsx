export type AsyncResult<T> =
  | { status: "pending" }
  | { status: "error"; error: unknown }
  | { status: "idle"; value: T };

export function RenderAsyncResult<T>({
  result,
  pending,
  error,
  idle,
}: {
  result: AsyncResult<T>;
  pending: (() => React.ReactNode) | null;
  error: ((e: unknown) => React.ReactNode) | null;
  idle: (value: T) => React.ReactNode;
}) {
  switch (result.status) {
    case "pending":
      return pending ? pending() : null;
    case "error":
      return error ? error(result.error) : null;
    case "idle":
      return idle(result.value);
  }
}
