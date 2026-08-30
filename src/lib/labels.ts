import type { Status } from "@/data/schema";
import type { i18n } from "./site-data";

type Dict = (typeof i18n)["ja"];

export function statusLabel(status: Status, t: Dict): string {
  switch (status) {
    case "alpha":
      return t.status_alpha;
    case "beta":
      return t.status_beta;
    case "release":
      return t.status_release;
    case "archived":
      return t.status_archived;
  }
}
