"use client";

import { useState } from "react";
import { Button, Input } from "../UI";

export const ProposalModal = ({ job, onSubmit, onClose, loading = false }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      await onSubmit({
        job: job._id,
        amount: Number(amount),
      });
    } catch (err) {
      setError(err.message || "Failed to submit proposal");
    }
  };

  return (
    <div className="proposal-modal-overlay">
      <button
        type="button"
        className="proposal-modal-close"
        onClick={onClose}
        aria-label="Close modal"
      >
        ✕
      </button>

      <div
        className="proposal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="proposal-modal-title"
      >
        <div className="proposal-modal-header">
          <h2 id="proposal-modal-title" className="proposal-modal-title">
            Submit Proposal
          </h2>
        </div>

        <div className="proposal-modal-job-info">
          <h3 className="proposal-modal-job-title">{job.title}</h3>
          {job.description && (
            <p className="proposal-modal-job-description">{job.description}</p>
          )}
          <p className="proposal-modal-job-budget">
            Budget: <strong>NPR {job.budget?.toLocaleString()}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="proposal-modal-form">
          <Input
            type="number"
            label="Your Amount (NPR)"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
            disabled={loading}
          />

          {error && <p className="proposal-modal-error">{error}</p>}

          <div className="proposal-modal-actions">
            <Button type="submit" disabled={loading || !amount}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
