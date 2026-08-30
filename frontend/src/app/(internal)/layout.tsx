import type { ReactNode } from "react";

type InternalLayoutProps = {
  children: ReactNode;
};

export default function InternalLayout({
  children,
}: InternalLayoutProps) {
  return children;
}