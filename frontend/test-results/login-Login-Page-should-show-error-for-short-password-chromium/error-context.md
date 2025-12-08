# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "HealthPulse" [level=3] [ref=e7]
  - generic [ref=e10]:
    - heading "Log in" [level=4] [ref=e12]
    - alert [ref=e13]:
      - img [ref=e15]
      - generic [ref=e17]: Invalid email or password
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: Email
        - generic [ref=e21]:
          - textbox "Email" [ref=e22]:
            - /placeholder: Enter your email
            - text: test@example.com
          - group:
            - generic: Email
      - generic [ref=e23]:
        - generic [ref=e24]: Password
        - generic [ref=e25]:
          - textbox "Password" [ref=e26]:
            - /placeholder: Enter your password
            - text: "12345"
          - button [ref=e28] [cursor=pointer]:
            - img [ref=e29]
          - group:
            - generic: Password
    - button "Log in" [ref=e31] [cursor=pointer]: Log in
    - generic [ref=e32]:
      - paragraph [ref=e33]:
        - text: Don't have an account?
        - button "Register" [ref=e34] [cursor=pointer]
      - button "Forgot password?" [ref=e35] [cursor=pointer]
```