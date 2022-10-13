import { createContext, PropsWithChildren, useState } from "react";

export type Theme = "normal" | "batchess";

export interface IPiecesThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const PiecesThemeContext = createContext<IPiecesThemeContext>(
  {} as IPiecesThemeContext
);

export function PiecesThemeProvider(props: PropsWithChildren) {
  const [theme, setTheme] = useState<IPiecesThemeContext["theme"]>("normal");

  return (
    <PiecesThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </PiecesThemeContext.Provider>
  );
}
