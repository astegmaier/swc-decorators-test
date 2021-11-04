import { observable } from "https://unpkg.com/@microsoft/fast-element@1.6.2/dist/esm/index.js";

export class TestObservableClass {
  // When we assign the default value of greeting through property assignment, the swc version breaks.
  @observable greeting = "Hello"

  // When we assign the default value of "greeting" through the constructor, the swc version works.
  // constructor() {
  //   super();
  //   this.greeting = "Hello";
  // }

  greetingChanged() {
    console.log("greetingChanged called!", this.greeting);
  }
}

const myObservableInstance = new TestObservableClass();
console.log("before change:", myObservableInstance.greeting);
myObservableInstance.greeting = "Hola";
console.log("after change:", myObservableInstance.greeting);

