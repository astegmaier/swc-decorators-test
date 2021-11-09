# SWC Decorators Test

This repo contains a reproduction of [an issue](https://github.com/swc-project/swc/issues/2655) with the way SWC currently transpiles typescript decorators.

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
const testDecorator = <T extends {}>(target: T, key: keyof T) => {
    const privateField = Symbol();
    // We define getters and setters for the property on the prototype of the class
    // A real application might use this to intercept changes to the decorated property..
    Reflect.defineProperty(target, key, {
        get: function () {
            console.log(`called getter for property ${key}.`)
            return (target as any)[privateField]
        },
        set: function (newValue) {
            console.log(`called setter for property ${key} with newValue ${newValue}.`)
            return (target as any)[privateField] = newValue
        }
    })
    console.log("called testDecorator!");
  };

class TestClass {
    @testDecorator
    testProp = "hello"
}

const instance = new TestClass();
// SWC console output:
//    "called testDecorator!"
// TSC console output:
//    "called testDecorator!"
//    "called setter for property testProp with newValue hello"

instance.testProp = "goodbye";
// SWC console output:
//    <nothing>
// TSC console output:
//    "called setter for property testProp with newValue goodbye."

console.log("testProp is now", instance.testProp);
// SWC console output:
//    "testProps is now goodbye"
// TSC console output:
//    "called getter for property testProp."
//    "testProps is now goodbye"
```

**TSC Output (excerpt):**
```js
...

class TestClass {
    constructor() {
        this.testProp = "hello";
    }
}

...
```

**SWC Output (excerpt):**
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
