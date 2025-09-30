import React from "react";

const SimpleTest = () => {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    console.log("SimpleTest component mounted");
    if (inputRef.current) {
      console.log("Input ref is available:", inputRef.current);
    }
  }, []);

  return (
    <div>
      <h1>Simple Test - No External Dependencies</h1>
      
      <div>
        <h2>Controlled Input (with state):</h2>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            console.log("onChange fired:", e.target.value);
            setValue(e.target.value);
          }}
          onInput={(e) => {
            console.log("onInput fired:", (e.target as HTMLInputElement).value);
          }}
          onKeyDown={(e) => {
            console.log("onKeyDown fired:", e.key);
          }}
          style={{ 
            padding: "8px", 
            fontSize: "16px",
            border: "2px solid blue",
            width: "300px"
          }}
          placeholder="Try typing here..."
        />
        <p>Current value: {value}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h2>Uncontrolled Input (no state):</h2>
        <input
          type="text"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            console.log("Uncontrolled input:", target.value);
            const display = document.getElementById("uncontrolled-display");
            if (display) display.textContent = target.value;
          }}
          style={{ 
            padding: "8px", 
            fontSize: "16px",
            border: "2px solid green",
            width: "300px"
          }}
          placeholder="Uncontrolled input..."
        />
        <p>Value: <span id="uncontrolled-display"></span></p>
      </div>
    </div>
  );
};

export default SimpleTest;