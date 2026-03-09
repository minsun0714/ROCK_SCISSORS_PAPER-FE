import { createContext } from "react";

export type LoginModalContextType = {
  isLoggedIn: boolean;
  requireLogin: () => void;
};

export const LoginModalContext = createContext<LoginModalContextType>({
  isLoggedIn: false,
  requireLogin: () => {},
});
