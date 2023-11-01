import { curry, set, view } from 'ramda';

/**
 * Async version of Ramda's `over` lens utility.
 */
const overA = curry(async (lens, f, x) => {
  const value = await f(view(lens, x));
  return set(lens, value, x);
});

export { overA };
