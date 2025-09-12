export function isObject(val: any) {
  return typeof val === 'object' && val !== null;
}

// 判断值有没有发生变化，使用Object.is，因为NaN === NaN是false，所以需要使用Object.is
export function hasChanged(newValue: any, oldValue: any) {
  return !Object.is(newValue, oldValue);
}

export function isFunction(val: any) {
  return typeof val === 'function';
}

export function isOn(key: string) {
  return /^on[A-Z]/.test(key);
}

export const isArray = Array.isArray;

export function isString(value: any) {
  return typeof value === 'string';
}

export function isNumber(value: any) {
  return typeof value === 'number';
}
