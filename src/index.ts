import { FASTElement, customElement, attr } from "https://unpkg.com/@microsoft/fast-element@1.6.2/dist/esm/index.js";

@customElement("name-tag")
export class NameTag extends FASTElement {
  // When we assign the default value of greeting through property assignment, the swc version breaks.
  @attr greeting = "Hello"

  // When we assign the default value of "greeting" through the constructor, the swc version works.
  // constructor() {
  //   super();
  //   this.greeting = "Hello";
  // }

  greetingChanged() {
    console.log("greetingChanged called!", this.greeting);
    this.shadowRoot!.innerHTML = this.greeting;
  }
}
