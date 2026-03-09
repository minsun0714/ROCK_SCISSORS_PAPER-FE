import { useContext } from "react";
import { LoginModalContext } from "@/features/auth/loginModalContext";

export const useLoginModal = () => useContext(LoginModalContext);
