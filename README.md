# ok-form

minimal js object validation

## Keywords

simple, predictable
minimal

## Notes

if number is null, dont run "number" tests, but still run "any" tests
required just does different message for "cant parse" vs "nullish"
note about required vs constructor

# Todo

## Core

- [ ] jsdoc comments
- [ ] Write readme

## Util

- [ ] Travis CI
- [ ] Bundlesize in CI
- [ ] Deploy script

## Branding

- [ ] See if formik wants to suggest it (check # of issues related to yup)
  - Want to help others, not just promote my stuff

# Why not...

## joi

Hard to set error msgs

## yup

converting string -> number is a pain
dsl for conditional validation is strange
circular references
