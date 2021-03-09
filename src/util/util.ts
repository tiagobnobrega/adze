import { Defaults, LogLevels, LevelFilter, LogRender } from '../_contracts';
import { isString, isArray, isDefined } from './type-guards';
import { Env } from '../Env';

/**
 * Capitalizes the first character of the provided string.
 */
export function initialCaps(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a level value of '*' to an array of numbers up to the highest
 * value defined by the user configuration. If levels is already a number array
 * it is returned unchanged.
 */
export function formatLevels(
  cfg: Defaults | null,
  levels: LevelFilter
): number[] {
  if (isString(levels)) {
    if (levels === '*') {
      return createArrayOfNumbers(0, getMaxLevel(cfg));
    }
    if (isRange(levels)) {
      return createArrayOfNumbers(...parseRange(levels));
    }
    console.warn(
      'The provided level filter string is invalid. This will cause logs to stop printing.'
    );
  } else if (isArray(levels)) {
    return levels;
  }
  return [] as number[];
}

/**
 * Type Guard that validates that a given string represents a
 * range of numbers.
 */
export function isRange(val: string): boolean {
  const vals = val.split('-');
  const [low, high] = vals;
  return vals.length === 2 && Number(low) !== NaN && Number(high) !== NaN;
}

/**
 * Returns the highest level from the provided configuration.
 */
export function getMaxLevel(cfg: Defaults | null): number {
  return Math.max(...[8, ...levelsFromConfig(cfg?.custom_levels ?? {})]);
}

/**
 * Parse a range string into a tuple of numbers containing low and high.
 */
export function parseRange(range: string): [number, number] {
  const [low, high] = range.split('-');
  return [Number(low), Number(high)];
}

/**
 * Get all level values from a config of type LogLevels.
 */
export function levelsFromConfig(
  lvls: LogLevels | Partial<LogLevels>
): number[] {
  return Object.values(lvls)
    .map((lvl) => lvl?.level)
    .filter(isDefined);
}

/**
 * Create an array of number containing every number from the start value to end value.
 */
export function createArrayOfNumbers(start: number, end: number): number[] {
  const arr = [];
  for (let i = start; i <= end; i += 1) {
    arr.push(i);
  }
  return arr;
}

// TODO: Updated toConsole to utilize chalk styles if the render contains them.
// OR, apply chalk styles at Print time and put the rendered string with chalk
// styles applied in the log render.

/**
 * Render the log. If the ADZE_ENV is set to "dev" the log will not render and
 * will be returned for unit testing purposes.
 */
export function toConsole(render: LogRender | null): void {
  if (render && Env.global().ADZE_ENV !== 'dev') {
    const [method, args] = render;
    console[method](...args);
  }
}

/**
 * Check if the given object has any keys set.
 * NOTE: Currently unused.
 */
// export function hasKeys(obj: Record<string, unknown>): boolean {
//   return Object.keys(obj).length > 0;
// }
