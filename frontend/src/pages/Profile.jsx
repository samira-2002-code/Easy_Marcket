import { useEffect, useState } from "react";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";
import "../components/home/home.css";
import "../components/profile/profile.css";

export default function Profile() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/profile");

                const user =
                    response.data.data ||
                    response.data.user ||
                    response.data;

                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    password: "",
                    password_confirmation: "",
                });
            } catch (err) {
                console.error("Profile error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await api.put("/profile", form);

            const updatedUser =
                response.data.data ||
                response.data.user ||
                response.data;

            localStorage.setItem("user", JSON.stringify(updatedUser));

            setForm({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                password: "",
                password_confirmation: "",
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            console.error("Update profile error:", err);

            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setError(
                    Object.values(validationErrors)
                        .flat()
                        .join(" ")
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to update your profile."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="market-home">
                <Navbar />

                <main className="profile-page">
                    <div className="profile-loading">
                        Loading profile...
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="market-home">
            <Navbar />

            <main className="profile-page">
                <section className="profile-intro">
                    <Link to="/" className="profile-back">
                        <ArrowLeft size={18} />
                        Back to marketplace
                    </Link>

                    <div className="section-topline">
                        <span>03</span>
                        <span>ACCOUNT</span>
                    </div>

                    <div className="profile-heading">
                        <div>
                            <span className="profile-eyebrow">
                                YOUR ACCOUNT
                            </span>

                            <h1>
                                Your
                                <br />
                                <em>profile.</em>
                            </h1>
                        </div>

                        <div className="profile-heading-icon">
                            <UserRound size={42} strokeWidth={1.3} />
                        </div>
                    </div>
                </section>

                <section className="profile-content">
                    <div className="profile-card">
                        <div className="profile-card-header">
                            <span className="profile-card-number">
                                01
                            </span>

                            <h2>Personal information</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="profile-field">
                                <label htmlFor="name">
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="password">
                                    New password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Leave empty to keep current password"
                                />
                            </div>

                            <div className="profile-field">
                                <label htmlFor="password_confirmation">
                                    Confirm new password
                                </label>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                />
                            </div>

                            {message && (
                                <div className="profile-success">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="profile-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="profile-save"
                                disabled={saving}
                            >
                                {saving ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        Save changes
                                        <Save size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}