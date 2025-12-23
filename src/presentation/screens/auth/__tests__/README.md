# Auth Screen Tests

- LoginScreen.test.tsx — Screen: LoginScreen; Flows: renders header and configures Google Signin; validation errors for invalid email/weak password; navigates to signup CTA; email/password login success (tokens cached, profile cached, navigation reset); forgot password modal submit (valid + invalid email); social auth buttons (Google/Apple) invoke hooks and reset navigation.
- SignUpScreen.test.tsx — Screen: SignUpScreen; Flows: renders header; validates missing name, invalid email, password mismatch; back button navigation; successful signup (tokens cached, profile cached, navigation reset).
