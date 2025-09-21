const PROD = process.env.NODE_ENV === 'production'
const DEV = process.env.NODE_ENV === 'development';
const TEST = process.env.NODE_ENV === 'test';
const NO_PROD = !PROD;

export const Env = {
  PROD,
  DEV,
  TEST,
  NO_PROD,
}
