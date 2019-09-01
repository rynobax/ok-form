# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [2.0.0] - 2019-08-31

- If both `.required` and `.optional` are present, the last one to be called takes precedence

## [1.3.0] - 2019-05-24

### Changed

- Returning an empty string from `.test` will not be considered an error

## [1.2.0] - 2019-05-21

### Changed

- Changed type of ValidationResult.errors to be any so it will play nice with Formik
- Changed default types of Input/Parent/Root to any
