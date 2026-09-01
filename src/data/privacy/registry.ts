import { html as caflogPrivacy } from "./caflog";
import { html as sublogPrivacy } from "./sublog";

/**
 * アプリ固有の法務本文。
 * 掲載アプリは必ずここへ同じ slug で登録し、テストで registry と完全一致させる。
 */
export const privacyDocuments: Readonly<Record<string, string>> = {
  sublog: sublogPrivacy,
  caflog: caflogPrivacy,
};
