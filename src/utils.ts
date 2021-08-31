import { snakeCase, trim } from 'lodash';

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const keysToSnakeCase = (val: object | null): object => {
  return Object.fromEntries(
    Object.entries(val ?? {}).map(([key, value]) => {
      const snakeKey = Array.isArray(value) ? key : snakeCase(trim(key));

      return [
        snakeKey,
        typeof value === 'object' ? keysToSnakeCase(value) : value,
      ];
    }),
  );
};
