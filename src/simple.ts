export const testDecorator = <T>(target: T, key: keyof T) => {
    console.log("called testDecorator with target", target, "and key", key);
  };

class TestClass {
    @testDecorator
    testProp = "hello"
}

const instance = new TestClass();
console.log(instance.testProp);