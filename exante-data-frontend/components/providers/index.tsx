"use client";

import ReduxProvider from "@/redux/provider";
import ReactQueryProvider from "./ReactQueryProvider";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ReactQueryProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </ReactQueryProvider>
  );
}
