import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const WorkingLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }
    signIn({ name, email, role });
    navigate(role === "teacher" ? "/class-dashboard" : "/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0f1c, #0f172a)", // dark bg
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e293b", // card darker slate
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          minWidth: 340,
          width: "100%",
          maxWidth: 380,
          color: "#f3f4f6", // light text
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 28,
            color: "#3b82f6", // blue accent
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Sign In
        </h2>

        {/* Name Input */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#e5e7eb", // light label
            }}
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f9fafb",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="Enter your name"
          />
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#e5e7eb",
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#0f172a",
              color: "#f9fafb",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="Enter your email"
          />
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#e5e7eb",
            }}
          >
            Role
          </label>
          <div style={{ display: "flex", gap: 24 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 400,
                color: "#f3f4f6",
              }}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                style={{ accentColor: "#3b82f6" }}
              />{" "}
              Student
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 400,
                color: "#f3f4f6",
              }}
            >
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
                style={{ accentColor: "#3b82f6" }}
              />{" "}
              Teacher
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            cursor: "pointer",
            transition: "background 0.2s, transform 0.1s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#3b82f6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default WorkingLogin;
