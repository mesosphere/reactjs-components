import React from "react";

import CodeBlock from "../components/CodeBlock";
import ComponentExample from "../components/ComponentExample";
import ComponentExampleWrapper from "../components/ComponentExampleWrapper";
import ComponentWrapper from "../components/ComponentWrapper";
import Select from "../../../src/Select/Select.js";
import SelectOption from "../../../src/Select/SelectOption.js";
import PropertiesAPIBlock from "../components/PropertiesAPIBlock";

class SelectExample extends React.Component {
  render() {
    return (
      <ComponentWrapper
        title="Select"
        srcURI="https://github.com/mesosphere/reactjs-components/blob/master/src/Select/Select.js"
      >
        <p className="lead flush-bottom">
          To allow a enclosing
          {" "}
          <code>form</code>
          {" "}
          recognize the change of a
          {" "}
          <code>Dropdown</code>
          , it is necceccary that there is an
          {" "}
          <code>input</code>
          {" "}
          element which emits a proper
          {" "}
          <code>change</code>
          {" "}
          event. This is solved by this component.
        </p>
        <PropertiesAPIBlock
          propTypesBlock={"PROPTYPES_BLOCK(src/Select/Select.js)"}
        />
        <PropertiesAPIBlock
          propTypesBlock={"PROPTYPES_BLOCK(src/Select/SelectOption.js)"}
        />
        <ComponentExampleWrapper>
          <ComponentExample>
            <div className="row row-flex">
              <div className="column-6">
                <Select
                  name={"Select example"}
                  className="dropdown-select"
                  onChange={selectedItem => console.log("prop", selectedItem)}
                  placeholder="Select your Option…"
                >
                  <SelectOption value="Foobar" label="Foobar Label">
                    <strong>Foobar</strong>
                    <p>Description</p>
                  </SelectOption>
                  <SelectOption value="baz" label="baz Label">
                    <strong>baz</strong>
                    <p>Description</p>
                  </SelectOption>
                </Select>
              </div>
            </div>
          </ComponentExample>
          <CodeBlock>
            {`import { Select } from "reactjs-components";
import React from "react";

class SimpleSelectExample extends React.Component {
  render() {
    return (
      <Select
        name={"Select example"}
        className="dropdown-select"
        onChange={selectedItem => console.log("prop", selectedItem)}
        placeholder="Select your Option…"
      >
        <SelectOption value="Foobar" label="Foobar Label">
          <strong>Foobar</strong>
          <p>Description</p>
        </SelectOption>
        <SelectOption value="baz" label="baz Label">
          <strong>baz</strong>
          <p>Description</p>
        </SelectOption>
      </Select>
    );
  }
}`}
          </CodeBlock>
        </ComponentExampleWrapper>
      </ComponentWrapper>
    );
  }
}

module.exports = SelectExample;
