import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/home/Navbar";
import "../components/home/home.css";
import "../components/dashboard/dashboard.css";
import "../components/notifications/notifications.css";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const response = await api.get("/notifications");
                setNotifications(response.data?.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load notifications.");
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, []);

    const markAsRead = async (notification) => {
        if (notification.read_at) return;

        try {
            const response = await api.patch(`/notifications/${notification.id}/read`);
            const updated = response.data?.data || { ...notification, read_at: new Date().toISOString() };
            setNotifications((current) => current.map((item) => item.id === notification.id ? updated : item));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update this notification.");
        }
    };

    return (
        <div className="market-home">
            <Navbar />
            <main className="notifications-page">
                <section className="dashboard-intro">
                    <div className="section-topline"><span>07</span><span>NOTIFICATIONS</span></div>
                    <div className="dashboard-heading">
                        <div><span className="dashboard-eyebrow">STAY IN THE LOOP</span><h1>Your<br /><em>notifications.</em></h1></div>
                        <p>Messages, reports and marketplace activity that need your attention.</p>
                    </div>
                </section>
                <section className="dashboard-content">
                    {error && <div className="dashboard-error">{error}</div>}
                    {loading && <div className="dashboard-state">Loading notifications...</div>}
                    {!loading && !notifications.length && <div className="dashboard-state">You are all caught up.</div>}
                    {!loading && notifications.length > 0 && (
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <article className={`notification-item ${notification.read_at ? "is-read" : "is-unread"}`} key={notification.id}>
                                    <div className="notification-icon"><Bell size={17} /></div>
                                    <div className="notification-copy"><span>{notification.type?.replaceAll("_", " ") || "activity"}</span><p>{notification.message}</p><small>{new Date(notification.created_at).toLocaleString()}</small></div>
                                    {!notification.read_at && <button type="button" onClick={() => markAsRead(notification)} aria-label="Mark notification as read"><Check size={17} /></button>}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
