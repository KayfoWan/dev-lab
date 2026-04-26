import app from "ags/gtk4/app"
import style from "./style.scss"
import Gtk from "gi://Gtk?version=4.0"
import { Gdk } from "ags/gtk4"
import { createState, createComputed } from "ags"
import { createPoll } from "ags/time"
import { With, Accessor } from "ags";
import { For } from "ags";

function Bar(monitor = 0) {
  return(
    <window visible class={"bar"} monitor={monitor}>
      <box>Content of the widget</box>
    </window>
  )
}


//Nesting

function MyButton() {
  return (
    <button onClicked={(self) => console.log(self, "clicked")}>
      <label label={"Click Me!"}/>
    </button>
  )
}

function MyBar() {
  return(
    <window visible>
      <box>
        Click The Button
        <MyButton/>
      </box>
    </window>
  )
}


// Displaying Data

function MyWidget() {
  const label = "hello";
  // return <button>{label}</button>
  // OR
  return <button label={label}/>
}


// Conditional Rendering

// function MyWidget() {
//   let content;
//   if(condition) {
//     content = <True/>
//   } else {
//     content = <False/>
//   }

//   return <box>{content}</box>
// }

// OR

// function MyWidget() {
//   return <box>{conditon ? <True/> : <False/>}</box>
// }

// OR (no else)

// function MyWidget() {
//   return <box>{condition && <True/>}</box>
// }


// Rendering Lists

function MyRenderingList() {
  const labels = ["label1", "label2", "label3", "label4", "label5"];

  return (
    <box>
      {labels.map((label) => (
        <label label={label} />
      ))}
    </box>
  )
}


// Widget Signal Handler

function MyWidgetSignalHandler() {
  function onClicked(self: Gtk.Button) {
    console.log(self, "Was Clicked")
  }

  return <button onClicked={onClicked} />
}

// Using Gtk4, you can use EventControllers for more complex event handling.
{/* <box>
  <Gtk.GestureClick
    propagationPhase={Gtk.PropagationPhase.CAPTURE}
    button={Gdk.BUTTON_PRIMARY}
    onPressed={() => print("clicked with primary button")}
  />
</box> */}


// How Properties are Passed

type Props = {
  myprop: string,
  children?: JSX.Element | Array<JSX.Element>
}
function MyPropertyWidget({ myprop, children} : Props) {
  //
}

// JSX.Element is an alias to GObject.Object

// Children prop of MyWidget is the box 
// return (
//   <MyWidget myprop="hello">
//     <box/>
//   </MyWidget>
// )

// Children prop of MyWidget is [box, box]
// return (
//   <MyWidget myprop="hello">
//     <box />
//     <box/>
//   </MyWidget>
// )


// State Management

function Counter() {
  const [count, setCount] = createState(0);

  function increment() {
    setCount((v) => v + 1);
  }

  const label = createComputed(() => count().toString());

  return (
    <box>
      <label label={label} />
      <button onClicked={increment}>Click to increment</button>
    </box>
  )
}

// Shorthand for createComputed
// These two lines mean and do the same thing:

// const label = createComputed(()=> count().toString());
// const label = count((c)=> c.toString);


// Integrating external programs

// const date = createPoll("", 1000, `bash -c "date +%H:%M`)
// return <label label={date}/>

//WARNING
// Running subprocesses are relatively expensive, so always prefer to use a library when available.

// const date = createPoll("", 1000, () => new Date().toString())
// return <label label={date} />

// Avoid polling when possible.
// Keep in mind that polling is generally considered bad practice. You should use events and signals whenever possible which will only do operations when necessary.


// Dynamic Rendering

// let value: Accessor<{ member: string} | null>
// return (
//   <box>
//     <With value={value}>
//       {(value) => value && <label label={value.member}/>}
//     </With>
//   </box>
// )

// TIP:
// In most cases it is better to always render the component and set its visible property instead. Use <With> in cases when you need to unpack a nullable object or when you need to access nested values.

// WARNING
// When the value changes and the widget is re-rendered the previous one is removed from the parent component and the new one is appended. Order of widgets are not kept so make sure to wrap <With> in a container to avoid it. This is due to Gtk not having a generic API on containers to sort widgets.


// Dynamic List Rendering

// let list: Accessor<Array<any>>
// return (
//   <box>
//     <For each={list}>
//       {(item, index: Accessor<number>) => (
//         <label label={index((i)=> `${i}. ${item}`)} />
//       )}
//     </For>
//   </box>
// )

// WARNING
// Similarly to <With>, when the list changes and a new item is added it is simply appended to the parent. Order of widgets are not kept so make sure to wrap <For> in a container to avoid this.

app.start({
  css: style,
  main() {
    // Bar(0)
    // Bar(1) // Instantiate for each monitor


  },
})
