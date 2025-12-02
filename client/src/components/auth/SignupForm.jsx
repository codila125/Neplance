"use client";

import { useState } from "react";
import { Button, Input } from "../UI";

export const SignupForm = ({ onSubmit, loading = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(new Set());

  const toggleRole = (role) => {
    setSelectedRoles((prev) => {
      const newRoles = new Set(prev);
      if (newRoles.has(role)) {
        newRoles.delete(role);
      } else {
        newRoles.add(role);
      }
      return newRoles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({
      name,
      email,
      password,
      passwordConfirm,
      roles: Array.from(selectedRoles),
    });
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    password &&
    passwordConfirm &&
    selectedRoles.size > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
        disabled={loading}
      />
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        disabled={loading}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        disabled={loading}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        required
        autoComplete="new-password"
        disabled={loading}
      />

      <div className="space-y-3">
        <div className="input-label">Select your role</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => toggleRole("freelancer")}
            disabled={loading}
            className={`btn border border-solid ${
              selectedRoles.has("freelancer")
                ? "btn-primary border-primary"
                : "btn-secondary border-border"
            }`}
            aria-pressed={selectedRoles.has("freelancer")}
          >
            Freelancer
          </button>
          <button
            type="button"
            onClick={() => toggleRole("client")}
            disabled={loading}
            className={`btn border border-solid ${
              selectedRoles.has("client")
                ? "btn-primary border-primary"
                : "btn-secondary border-border"
            }`}
            aria-pressed={selectedRoles.has("client")}
          >
            Client
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading || !isFormValid}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};
