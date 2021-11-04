import { observable } from "https://unpkg.com/@microsoft/fast-element@1.6.2/dist/esm/index.js";

// This is a real-life example that has the same root cause as the example in "simple.ts".

export class TestObservableClass {
  // When we assign the default value of greeting through property assignment, the swc version breaks.
  @observable greeting = "Hello"

  // When we assign the default value of "greeting" through the constructor, the swc version works.
  // constructor() {
  //   super();
  //   this.greeting = "Hello";
  // }

  greetingChanged() {
    // In typescript, this function is called whenever "greeting" is set.
    // In swc, it is not.
    console.log("greetingChanged called!", this.greeting);
  }
}

const myObservableInstance = new TestObservableClass();
myObservableInstance.greeting = "Hola";

