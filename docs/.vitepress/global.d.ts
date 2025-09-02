// types/global.d.ts
export {};

declare global {
  interface Window {
    /** base url */
    __BASE_URL__?: string;
  }
}
