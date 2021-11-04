## SWC Decorators Test

This repo contains a reproduction of an issues with the way SWC currently transpiles typescript decorators.

## Simple Repro Steps

1. Run `yarn` to install dependencies.
2. Run `yarn build` to build the typescript source code with both `swc` and `tsc`
3. Run `yarn serve` to start a development server on `http://localhost:8080` that will allow you to run both output files and compare.
4. Visit these sites in the browser, and compare console output:
  - `swc` output: http://localhost:8080/simple_swc.html
  - `tsc` output: http://localhost:8080/simple_tsc.html

## Results

Typescript output works as expected - you are able to define a decorator that overrides a getter and setter for the decorated property to log to the console when the property is accessed or changed. You'll see `console.log` output indicating that these getters and setters are actually hit.

SWC output does not work as expected. Neither the getter nor the setter defined in the decorator are hit.