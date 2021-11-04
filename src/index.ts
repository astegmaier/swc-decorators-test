import { FASTElement, customElement, attr } from "https://unpkg.com/@microsoft/fast-element@1.6.2/dist/esm/index.js";

@customElement("name-tag")
export class NameTag extends FASTElement {
  @attr greeting = "Hello";

  greetingChanged() {
    console.log("greetingChanged called!", this.greeting);
    this.shadowRoot!.innerHTML = this.greeting;
  }
}