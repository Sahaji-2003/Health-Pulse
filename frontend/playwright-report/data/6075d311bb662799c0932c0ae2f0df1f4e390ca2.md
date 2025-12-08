# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "HealthPulse" [level=3] [ref=e7]
  - generic [ref=e10]:
    - heading "Log in" [level=4] [ref=e12]
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic: Email
        - generic [ref=e15]:
          - textbox "Email" [ref=e16]:
            - /placeholder: Enter your email
          - group:
            - generic: Email
      - generic [ref=e17]:
        - generic: Password
        - generic [ref=e18]:
          - textbox "Password" [ref=e19]:
            - /placeholder: Enter your password
          - button [ref=e21] [cursor=pointer]:
            - img [ref=e22]
          - group:
            - generic: Password
    - button "Log in" [ref=e24] [cursor=pointer]
    - generic [ref=e25]:
      - paragraph [ref=e26]:
        - text: Don't have an account?
        - button "Register" [ref=e27] [cursor=pointer]
      - button "Forgot password?" [ref=e28] [cursor=pointer]
```