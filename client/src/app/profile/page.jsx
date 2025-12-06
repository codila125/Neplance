"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/dashboard/Header";
import { JobCard } from "../../components/dashboard/JobCard";
import { EmptyState } from "../../components/dashboard/EmptyState";
import { apiCall } from "../../lib/api";
import { getAuthToken, getAuthUser, clearAuthCookies } from "../../lib/auth-cookies";
import "../../styles/dashboard.css";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from cookies initially
    useEffect(() => {
        const storedUser = getAuthUser();
        if (!storedUser) {
            router.push("/");
            return;
        }
        setUser(storedUser);
    }, [router]);

    const fetchProfileData = useCallback(async () => {
        const token = getAuthToken();
        const currentUser = getAuthUser();

        if (!token || !currentUser) return;

        try {
            setLoading(true);

            // Check active role (first in array)
            const isFreelancer = currentUser.role?.[0] === "freelancer";
            let completed = [];

            if (isFreelancer) {
                const proposalsData = await apiCall("/proposals/myProposals", token);
                if (proposalsData.status === "success") {
                    completed = proposalsData.data
                        .filter(
                            (p) =>
                                p.status === "accepted" &&
                                p.job &&
                                (p.job.status === "completed" || p.job.status === "closed")
                        )
                        .map((p) => ({
                            ...p.job,
                            client: p.job.client,
                            status: p.job.status,
                            // Since we don't have a review API, we'll attach a null review property 
                            // which can be populated later if API allows
                            review: null
                        }));
                }
            } else {
                const jobsData = await apiCall("/jobs/myJobs", token);
                if (jobsData.status === "success") {
                    completed = jobsData.data
                        .filter((job) => job.status === "completed" || job.status === "closed")
                        .map((job) => ({
                            ...job,
                            client: job.client && typeof job.client === 'object' && job.client.name
                                ? job.client
                                : currentUser,
                            review: null
                        }));
                }
            }

            setCompletedJobs(completed);

        } catch (err) {
            console.error("Error fetching profile data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchProfileData();
        }
    }, [user, fetchProfileData]);

    const handleLogout = () => {
        clearAuthCookies();
        router.push("/");
    };

    const handleRoleSwitch = (updatedUser) => {
        setUser(updatedUser);
        fetchProfileData();
    };

    if (!user) return null;

    // Calculate generic stats
    // Note: Rating is mocked as 0 until backend supports it
    const averageRating = 0;
    const currentRole = user.role?.[0] || 'freelancer';

    return (
        <div className="dashboard">
            <Header user={user} onLogout={handleLogout} onRoleSwitch={handleRoleSwitch} />

            <main className="profile-container">
                {/* Top Section: Profile Header */}
                <section className="profile-header-section">
                    {/* 1. Big Profile Picture */}
                    <div className="profile-header-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* 2. Horizontal Axis Info */}
                    <div className="profile-header-info">
                        <div className="profile-info-item">
                            <span className="profile-info-label">Name</span>
                            <span className="profile-info-value">{user.name}</span>
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value" style={{ fontSize: "1rem" }}>{user.email}</span>
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Current Role</span>
                            <span className="profile-role-badge">{currentRole}</span>
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Completed Works</span>
                            <span className="profile-info-value">{completedJobs.length}</span>
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Rating</span>
                            <span className="profile-info-value">
                                {averageRating > 0 ? averageRating : "N/A"}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Lower Half: Completed Jobs */}
                <section className="completed-jobs-section">
                    <h2 className="section-title">Completed Jobs</h2>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading profile data...</div>
                    ) : completedJobs.length > 0 ? (
                        completedJobs.map((job) => (
                            <div key={job._id} className="job-review-row">
                                {/* Left Side: Job Card */}
                                <div className="job-column">
                                    <JobCard job={job} variant="default" />
                                </div>

                                {/* Right Side: Rating & Review */}
                                <div className="review-column">
                                    <div className="review-card">
                                        {job.review ? (
                                            <div className="review-content">
                                                <div className="review-header">
                                                    <span className="profile-info-label">Client Review</span>
                                                    <div className="review-rating">
                                                        {"★".repeat(job.review.rating)}
                                                        <span style={{ color: "var(--color-border)" }}>
                                                            {"★".repeat(5 - job.review.rating)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="review-comment">"{job.review.comment}"</p>
                                            </div>
                                        ) : (
                                            <div className="review-placeholder">
                                                No review available for this job
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyState
                            title="No Completed Jobs"
                            description="Jobs you have successfully completed will appear here along with their reviews."
                        />
                    )}
                </section>
            </main>
        </div>
    );
}
