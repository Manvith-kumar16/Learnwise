import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

const InputDiagnostics = () => {
  const [htmlValue, setHtmlValue] = useState("");
  const [shadcnValue, setShadcnValue] = useState("");
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const shadcnInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for overlaying elements
    const checkOverlay = () => {
      const allElements = document.querySelectorAll("*");
      const overlays: any[] = [];
      
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const zIndex = style.zIndex;
        const position = style.position;
        const pointerEvents = style.pointerEvents;
        
        if ((zIndex !== "auto" && parseInt(zIndex) > 100) || pointerEvents === "none") {
          overlays.push({
            element: el.tagName,
            className: el.className,
            zIndex,
            position,
            pointerEvents
          });
        }
      });
      
      if (overlays.length > 0) {
        console.warn("Potential overlay elements found:", overlays);
      }
    };
    
    checkOverlay();
    
    // Add global focus listeners
    const handleGlobalFocus = (e: FocusEvent) => {
      console.log("Global focus event:", e.target);
    };
    
    document.addEventListener("focusin", handleGlobalFocus);
    
    return () => {
      document.removeEventListener("focusin", handleGlobalFocus);
    };
  }, []);

  const checkInputProperties = (ref: React.RefObject<HTMLInputElement>, name: string) => {
    if (ref.current) {
      const input = ref.current;
      const computedStyle = window.getComputedStyle(input);
      
      console.log(`${name} Input Properties:`, {
        disabled: input.disabled,
        readOnly: input.readOnly,
        tabIndex: input.tabIndex,
        type: input.type,
        value: input.value,
        style: {
          pointerEvents: computedStyle.pointerEvents,
          userSelect: computedStyle.userSelect,
          cursor: computedStyle.cursor,
          zIndex: computedStyle.zIndex,
          position: computedStyle.position,
          opacity: computedStyle.opacity,
          visibility: computedStyle.visibility,
          display: computedStyle.display
        },
        rect: input.getBoundingClientRect()
      });
      
      // Check if anything is overlaying the input
      const rect = input.getBoundingClientRect();
      const elementAtPoint = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      
      if (elementAtPoint !== input) {
        console.warn(`${name} input is being overlapped by:`, elementAtPoint);
      }
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Input Diagnostics</h1>
      
      {/* Test 1: Plain HTML Input */}
      <div style={{ 
        marginBottom: "40px", 
        padding: "20px", 
        border: "2px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Test 1: Plain HTML Input</h2>
        <input
          ref={htmlInputRef}
          type="text"
          value={htmlValue}
          onChange={(e) => {
            console.log("HTML Input onChange:", e.target.value);
            setHtmlValue(e.target.value);
          }}
          onFocus={() => {
            setFocusedElement("html");
            checkInputProperties(htmlInputRef, "HTML");
          }}
          onBlur={() => setFocusedElement(null)}
          onKeyDown={(e) => console.log("HTML Input keydown:", e.key)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            border: "3px solid #4CAF50",
            borderRadius: "4px",
            outline: focusedElement === "html" ? "3px solid #ff0000" : "none"
          }}
          placeholder="Plain HTML input - try typing here..."
        />
        <div style={{ marginTop: "10px" }}>
          <strong>Value:</strong> {htmlValue || "(empty)"}
          <br />
          <strong>Length:</strong> {htmlValue.length}
          <br />
          <strong>Focused:</strong> {focusedElement === "html" ? "YES" : "NO"}
        </div>
      </div>

      {/* Test 2: ShadCN Input Component */}
      <div style={{ 
        marginBottom: "40px", 
        padding: "20px", 
        border: "2px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Test 2: ShadCN Input Component</h2>
        <Input
          ref={shadcnInputRef}
          type="text"
          value={shadcnValue}
          onChange={(e) => {
            console.log("ShadCN Input onChange:", e.target.value);
            setShadcnValue(e.target.value);
          }}
          onFocus={() => {
            setFocusedElement("shadcn");
            checkInputProperties(shadcnInputRef, "ShadCN");
          }}
          onBlur={() => setFocusedElement(null)}
          onKeyDown={(e) => console.log("ShadCN Input keydown:", e.key)}
          placeholder="ShadCN Input component - try typing here..."
          className="border-3 border-blue-500"
        />
        <div style={{ marginTop: "10px" }}>
          <strong>Value:</strong> {shadcnValue || "(empty)"}
          <br />
          <strong>Length:</strong> {shadcnValue.length}
          <br />
          <strong>Focused:</strong> {focusedElement === "shadcn" ? "YES" : "NO"}
        </div>
      </div>

      {/* Test 3: Uncontrolled Input */}
      <div style={{ 
        marginBottom: "40px", 
        padding: "20px", 
        border: "2px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Test 3: Uncontrolled Input</h2>
        <input
          type="text"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            console.log("Uncontrolled input value:", target.value);
            const display = document.getElementById("uncontrolled-value");
            if (display) display.textContent = target.value;
          }}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            border: "3px solid #ff9800",
            borderRadius: "4px"
          }}
          placeholder="Uncontrolled input (no React state)..."
        />
        <div style={{ marginTop: "10px" }}>
          <strong>Value:</strong> <span id="uncontrolled-value">(empty)</span>
        </div>
      </div>

      {/* Test 4: Inline Input */}
      <div style={{ 
        marginBottom: "40px", 
        padding: "20px", 
        border: "2px solid #ccc",
        borderRadius: "8px",
        background: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "10px", color: "#333" }}>Test 4: Minimal Inline Input</h2>
        <input type="text" placeholder="Absolute minimal input..." />
      </div>

      {/* Diagnostic Buttons */}
      <div style={{ 
        marginTop: "40px", 
        padding: "20px", 
        background: "#333",
        color: "#fff",
        borderRadius: "8px"
      }}>
        <h3>Diagnostic Actions</h3>
        <button
          onClick={() => {
            const allInputs = document.querySelectorAll("input");
            allInputs.forEach((input, index) => {
              console.log(`Input ${index}:`, {
                disabled: input.disabled,
                readOnly: input.readOnly,
                type: input.type,
                value: input.value,
                placeholder: input.placeholder
              });
            });
          }}
          style={{
            padding: "10px 20px",
            margin: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Check All Inputs
        </button>
        
        <button
          onClick={() => {
            document.querySelectorAll("*").forEach(el => {
              const style = window.getComputedStyle(el);
              if (style.pointerEvents === "none") {
                console.warn("Element with pointer-events: none found:", el);
              }
            });
          }}
          style={{
            padding: "10px 20px",
            margin: "10px",
            background: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Find Blocking Elements
        </button>
        
        <button
          onClick={() => {
            // Force enable all inputs
            document.querySelectorAll("input").forEach(input => {
              input.disabled = false;
              input.readOnly = false;
              (input as HTMLElement).style.pointerEvents = "auto";
            });
            console.log("All inputs force-enabled");
          }}
          style={{
            padding: "10px 20px",
            margin: "10px",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Force Enable All Inputs
        </button>
      </div>
    </div>
  );
};

export default InputDiagnostics;