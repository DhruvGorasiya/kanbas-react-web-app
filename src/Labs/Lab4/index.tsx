import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ChildStateComponent from "./ChildStateComponent";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import EventObject from "./EventObject";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import StringStateVariables from "./StringStateVariables";
import ReduxExamples from "./ReduxExamples";
export default function Lab4() {
  function sayHello() {
    alert("Hello");
  }

    return (
      <div id="wd-lab4">
        <h2>Lab 4</h2>
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction={() => alert(sayHello())} />
        <EventObject    />
        <Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <DateStateVariable />
        <ObjectStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
        <ReduxExamples />
      </div>
    );
  }
  