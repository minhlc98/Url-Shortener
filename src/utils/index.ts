import { createHash } from "crypto";

const createHashMD5 = (data: string): string => {
  return createHash('md5').update(data).digest('hex');
}

export { createHashMD5 };