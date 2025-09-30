import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const WorkingLogin = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }
    signIn({ name, email, role: role as "student" | "teacher" });
    navigate(role === "teacher" ? "/class-dashboard" : "/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fa",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 4px 24px #0002",
          minWidth: 340,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 28,
            color: "#2563eb",
          }}
        >
          Sign In
        </h2>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#222",
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
              border: "1px solid #e5e7eb",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="Enter your name"
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#222",
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
              border: "1px solid #e5e7eb",
              fontSize: 16,
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
              color: "#222",
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
                color: "#222",
              }}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                style={{ accentColor: "#2563eb" }}
              />{" "}
              Student
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 400,
                color: "#222",
              }}
            >
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
                style={{ accentColor: "#2563eb" }}
              />{" "}
              Teacher
            </label>
          </div>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px #2563eb22",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default WorkingLogin;
