import React, { FunctionComponent, ReactNode } from "react";
import "./GlobalStyles.css";

interface GlobalStyleProps {
  children: ReactNode;
}

const GlobalStyle: FunctionComponent<GlobalStyleProps> = ({ children }) => {
  return <>{children}</>;
};

export default GlobalStyle;
