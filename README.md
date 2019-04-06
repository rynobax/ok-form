# ok-form

minimal js object validation

## Notes

if number is null, dont run "number" tests, but still run "any" tests
required just does different message for "cant parse" vs "nullish"

# Todo

- [ ] refactor min/max to push fns
- [ ] handle casting bad schema
- [ ] array
- [ ] path
- [ ] boolean
- [ ] string
- [ ] Async
- [ ] Support throwing error in .test?
- [ ] Babel target browsers?
- [ ] Search for OSS projects using joi / yup and see what validators they use
- [ ] .compile?
- [ ] jsdoc comments
- [ ] Travis CI
- [ ] Bundlesize in CI
- [ ] See if formik wants to suggest it (check # of issues related to yup)
  - Want to help others, not just promote my stuff

# Why not...

## joi

Hard to set error msgs

## yup

converting string -> number is a pain
dsl for conditional validation is strange
circular references
