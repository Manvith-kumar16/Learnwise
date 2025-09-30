import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const LoginTest = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    if (!formData.email || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (formData.role === "teacher" && !formData.password) {
      alert("Teachers must enter their access code");
      return;
    }
    
    signIn({ 
      email: formData.email, 
      name: formData.name, 
      role: formData.role as "student" | "teacher" 
    });
    
    if (formData.role === "teacher") {
      navigate('/class-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(to bottom right, #e0f2fe, #f0f9ff)"
    }}>
      <div style={{ 
        background: "white", 
        padding: "2rem", 
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
          LearnWise Login (Test)
        </h1>
        
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>I am a:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={(e) => {
                    console.log("Role changed to:", e.target.value);
                    setFormData(prev => ({ ...prev, role: e.target.value }));
                  }}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={(e) => {
                    console.log("Role changed to:", e.target.value);
                    setFormData(prev => ({ ...prev, role: e.target.value }));
                  }}
                />
                Teacher
              </label>
            </div>
          </div>

          {/* Name Input */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="test-name" style={{ display: "block", marginBottom: "8px" }}>
              Full Name *
            </label>
            <input
              id="test-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log("Name input:", newValue);
                setFormData(prev => ({ ...prev, name: newValue }));
              }}
              placeholder="Enter your full name"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
              Current value: {formData.name || "(empty)"}
            </div>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="test-email" style={{ display: "block", marginBottom: "8px" }}>
              Email Address *
            </label>
            <input
              id="test-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log("Email input:", newValue);
                setFormData(prev => ({ ...prev, email: newValue }));
              }}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
              Current value: {formData.email || "(empty)"}
            </div>
          </div>

          {/* Teacher Password */}
          {formData.role === "teacher" && (
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="test-password" style={{ display: "block", marginBottom: "8px" }}>
                Teacher Access Code *
              </label>
              <input
                id="test-password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  const newValue = e.target.value;
                  console.log("Password input:", newValue);
                  setFormData(prev => ({ ...prev, password: newValue }));
                }}
                placeholder="Enter access code"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Sign In as {formData.role === "teacher" ? "Teacher" : "Student"}
          </button>
        </form>

        {/* Debug Info */}
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          background: "#f0f0f0", 
          borderRadius: "4px",
          fontSize: "12px"
        }}>
          <strong>Debug Info:</strong><br/>
          Name: {formData.name || "(empty)"}<br/>
          Email: {formData.email || "(empty)"}<br/>
          Role: {formData.role}<br/>
          {formData.role === "teacher" && `Password: ${formData.password ? "***" : "(empty)"}`}
        </div>
        
        {/* Uncontrolled Input Test */}
        <div style={{ 
          marginTop: "20px", 
          padding: "10px", 
          background: "#fff3cd", 
          borderRadius: "4px"
        }}>
          <strong>Uncontrolled Input Test (No React State):</strong><br/>
          <input 
            type="text" 
            placeholder="Try typing here (uncontrolled)" 
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "10px",
              border: "1px solid #000",
              borderRadius: "4px"
            }}
            onInput={(e) => console.log("Uncontrolled input:", (e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginTest;