# ok-form

minimal js object validation

# WORK IN PROGRESS

[![Build Status](https://travis-ci.com/rynobax/ok-form.svg?branch=master)](https://travis-ci.com/rynobax/ok-form)
[![Stable Release](https://img.shields.io/npm/v/ok-form.svg)](https://npm.im/ok-form)
[![gzip size](TODO)](TODO)
[![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

## Keywords

simple, predictable
minimal

## Notes

if number is null, dont run "number" tests, but still run "any" tests

required just does different message for "cant parse" vs "nullish"

note about required vs constructor

# Todo

## Core

- [ ] generate api docs from jsdoc?
- [ ] Write readme

## Util

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
