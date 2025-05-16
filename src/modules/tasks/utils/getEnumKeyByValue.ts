export const getEnumKeyByValue = <T extends Record<string, any>>(
  enumObj: T,
  value: number
): keyof T | undefined =>
  Object.keys(enumObj).find((key) => enumObj[key] === value) as keyof T | undefined;
