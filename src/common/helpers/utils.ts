import fs from "fs";

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') {
    return value === "";
  }
  return true;
}

export async function loadDataFromFileAsType<T>(filePath: string): Promise<T> {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

export async function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
