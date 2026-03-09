import { useContext } from "react";
import { LoginModalContext } from "@/features/auth/loginModalStateContext";

export const useLoginModal = () => useContext(LoginModalContext);
