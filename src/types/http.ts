export enum TypeResult {
  Success = 1,
  Warning = 2,
  Error = 3,
}

export type TypeResultType =
  | TypeResult.Success
  | TypeResult.Warning
  | TypeResult.Error;

export interface IRes<T> {
  content: T;
  message: string;
  typeResult?: TypeResult.Success | TypeResult.Warning | TypeResult.Error;
}
