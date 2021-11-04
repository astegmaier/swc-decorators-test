import { FASTElement, customElement, attr } from "@microsoft/fast-element";

@customElement("name-tag")
export class NameTag extends FASTElement {
  @attr greeting = "Hello";

  greetingChanged() {
    console.log("greetingChanged called!", this.greeting);
    this.shadowRoot!.innerHTML = this.greeting;
  }
}