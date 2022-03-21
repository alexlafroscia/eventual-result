# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Changed

- Removed distinct `Option` union type and `OptionMethods` interface in favor of
  a single interface that `Option` and `None` implement
- Removed distinct `Result` union type and `ResultMethods` interface in favor of
  a single interface that `Ok` and `Err` implement
- `isSome`, `isNone`, `isOk` and `isErr` are now methods, rather than properties

## 0.5.3 - 2022-03-17

### Fixed

- Support updated `Error` definition for `es2022` that limits the supported
  types for `cause`

## 0.5.2 - 2022-03-12

### Added

- Changelog generation script
