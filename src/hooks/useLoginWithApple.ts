import { useMutation } from "@tanstack/react-query";
import { loginWithApple, type SocialLoginPayload, type AuthResponse } from "../api/auth";

export function useLoginWithApple() {
  return useMutation<AuthResponse, Error, SocialLoginPayload>({
    mutationFn: loginWithApple
  });
}
