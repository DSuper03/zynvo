import { res } from "@/hooks/useResetPw";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  onSubmit?: (oldPassword: string, newPassword: string) => Promise<void> | void;
};

export default function ResetPassword({ onSubmit }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword) {
      setError("Both current and new password are required.");
      return;
    }

    setLoading(true);
    try {
      res(oldPassword, newPassword);
      setSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Unable to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      color: "#fff",
      padding: 20,
    },
    card: {
      width: "100%",
      maxWidth: 480,
      background: "#0b0b0b",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
      border: "1px solid #1f1f1f",
    },
    header: {
      marginBottom: 18,
      textAlign: "center",
    },
    title: {
      color: "#fbbf24",
      fontSize: 20,
      margin: 0,
      fontWeight: 700,
    },
    subtitle: {
      color: "#bfbfbf",
      fontSize: 13,
      marginTop: 6,
    },
    label: {
      display: "block",
      marginBottom: 6,
      color: "#fbbf24",
      fontWeight: 600,
      fontSize: 13,
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "1px solid #333",
      background: "#111",
      color: "#fff",
      marginBottom: 12,
      outline: "none",
    },
    btn: {
      background: "#fbbf24",
      color: "#000",
      border: "none",
      padding: "10px 14px",
      borderRadius: 8,
      fontWeight: 700,
      cursor: "pointer",
      width: "100%",
    },
    note: {
      fontSize: 13,
      color: "#9ca3af",
      marginTop: 12,
      textAlign: "center",
    },
    error: {
      color: "#ff6b6b",
      marginBottom: 10,
      textAlign: "center",
    },
    success: {
      color: "#8be38b",
      marginBottom: 10,
      textAlign: "center",
    },
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit} aria-label="reset-password-form">
        <div style={styles.header}>
          <h2 style={styles.title}>Reset password</h2>
          <div style={styles.subtitle}>Enter your current password and choose a new one.</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <label htmlFor="oldPassword" style={styles.label}>
          Current password
        </label>
        <input
          id="oldPassword"
          name="oldPassword"
          type="password"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={styles.input}
          placeholder="Enter current password"
        />

        <label htmlFor="newPassword" style={styles.label}>
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={styles.input}
          placeholder="Enter new password"
        />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </button>

        <div style={styles.note}>
          Use a strong password. The theme is black and yellow.
        </div>
      </form>
    </div>
  );
}