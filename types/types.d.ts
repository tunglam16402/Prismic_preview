import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    "ose-tag-click"?: string;
  }
}
