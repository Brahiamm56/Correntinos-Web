import type { ReactNode } from "react";

export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <div className="route-template">{children}</div>;
}
