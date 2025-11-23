import { useMutation } from "@tanstack/react-query";
import { signup, type SignupPayload, type AuthResponse } from "../api/auth";

export function useSignup() {
  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: signup
  });
}
