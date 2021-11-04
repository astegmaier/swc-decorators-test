# SWC Decorators Test

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


## Root Cause Analysis

Here is a comparison of the relevant parts of the source code and `tsc`/`swc` transpiled output:

**Source Code:**
```ts
class TestClass {
    @testDecorator
    testProp = "hello"
}
```

**TSC Output (excerpt)**
```js
...
class TestClass {
    constructor() {
        this.testProp = "hello";
    }
}
...
```

**SWC Output (excerpt)**
```js
...
let TestClass = ((_class = class TestClass {
    constructor(){
        _initializerDefineProperty(this, "testProp", _descriptor, this);
    }
}) || _class, _descriptor = _applyDecoratedDescriptor(_class.prototype, "testProp", [
    testDecorator
], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function() {
        return "hello";
    }
}), _class);
...

function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
}
```

You can see that while the `tsc` initialization code simply assigns the value of `"hello"` to `testProp` in the constructor, which invokes the getters and setters for that property on the prototype, `swc` initialization code uses `Object.defineProperty` which bypasses the prototype.

## Real-life examples

You'll also find two other real-life examples that have the same root cause - one using the `@observer` decorator from `@microsoft/fast-elements` (see [docs](https://www.fast.design/docs/fast-element/observables-and-state)), and another using the `@customElement` and `@attr` decorators from the same package (see [docs](https://www.fast.design/docs/fast-element/defining-elements)).