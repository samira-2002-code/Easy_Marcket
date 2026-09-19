import { useEffect, useMemo, useState } from "react";
import {
    MessageCircle,
    Search,
    Send,
    ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/home/Navbar";

import "../components/home/home.css";
import "../components/products/products.css";

export default function Messages() {
    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);
    const [text, setText] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadMessages = async () => {
            try {
                const response = await api.get("/messages");

                if (!cancelled) {
                    setMessages(response.data?.data || []);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Messages error:", err);

                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                            "Unable to load messages."
                    );
                    setLoading(false);
                }
            }
        };

        loadMessages();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * Création des conversations
     */
    const conversations = useMemo(() => {
        const grouped = {};

        messages.forEach((message) => {
            const otherUser =
                message.sender_id === user?.id
                    ? message.receiver
                    : message.sender;

            const key = `${otherUser?.id}-${message.product_id}`;

            if (!grouped[key]) {
                grouped[key] = {
                    id: key,
                    user: otherUser,
                    product: message.product,
                    messages: [],
                };
            }

            grouped[key].messages.push(message);
        });

        return Object.values(grouped).map((conversation) => ({
            ...conversation,
            messages: conversation.messages.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            ),
        }));
    }, [messages, user?.id]);

    const filteredConversations = conversations.filter(
        (conversation) => {
            const value = search.toLowerCase();

            return (
                conversation.user?.name
                    ?.toLowerCase()
                    .includes(value) ||
                conversation.product?.title
                    ?.toLowerCase()
                    .includes(value)
            );
        }
    );

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() || !selected || sending) {
            return;
        }

        try {
            setSending(true);

            const response = await api.post("/messages", {
                product_id: selected.product.id,
                message: text.trim(),
            });

            const newMessage = response.data?.data;

            if (newMessage) {
                setMessages((current) => [
                    ...current,
                    newMessage,
                ]);

                setSelected((current) => ({
                    ...current,
                    messages: [
                        ...current.messages,
                        newMessage,
                    ],
                }));
            }

            setText("");
        } catch (err) {
            console.error("Send message error:", err);

            alert(
                err.response?.data?.message ||
                    "Unable to send message."
            );
        } finally {
            setSending(false);
        }
    };

    const getInitial = (name) =>
        name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f3f0e8",
            }}
        >
            <Navbar />

            <main
                style={{
                    padding: "40px 5vw 70px",
                }}
            >
                {/* HEADER */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "28px",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                letterSpacing: "0.2em",
                                color: "#65764d",
                                marginBottom: "10px",
                            }}
                        >
                            06 — INBOX
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                color: "#172019",
                                fontSize:
                                    "clamp(42px, 6vw, 72px)",
                                lineHeight: "0.9",
                                letterSpacing: "-0.05em",
                            }}
                        >
                            Your{" "}
                            <em
                                style={{
                                    fontFamily:
                                        "Georgia, serif",
                                    fontWeight: "400",
                                }}
                            >
                                conversations.
                            </em>
                        </h1>
                    </div>

                    <Link
                        to="/products"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#172019",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: "700",
                        }}
                    >
                        <ArrowLeft size={16} />
                        Marketplace
                    </Link>
                </div>

                {/* ERROR */}

                {error && (
                    <div
                        style={{
                            marginBottom: "20px",
                            padding: "12px 16px",
                            background: "#f8d7da",
                            color: "#842029",
                            fontSize: "13px",
                            border: "1px solid #f1aeb5",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* MESSENGER */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "350px 1fr",
                        height: "650px",
                        maxWidth: "1250px",
                        margin: "0 auto",
                        background: "#faf9f4",
                        border:
                            "1px solid rgba(23,32,25,.14)",
                        boxShadow:
                            "0 20px 60px rgba(23,32,25,.08)",
                        overflow: "hidden",
                    }}
                >
                    {/* LEFT */}

                    <aside
                        style={{
                            background: "#172019",
                            color: "#f3f0e8",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                padding:
                                    "24px 22px 18px",
                                borderBottom:
                                    "1px solid rgba(255,255,255,.1)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        "18px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "11px",
                                        letterSpacing:
                                            ".15em",
                                        fontWeight: "700",
                                    }}
                                >
                                    MESSAGES
                                </span>

                                <MessageCircle size={19} />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    background:
                                        "rgba(255,255,255,.08)",
                                    padding:
                                        "11px 13px",
                                }}
                            >
                                <Search
                                    size={16}
                                    opacity=".6"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search..."
                                    style={{
                                        width: "100%",
                                        border: 0,
                                        outline: 0,
                                        background:
                                            "transparent",
                                        color: "#fff",
                                        fontSize:
                                            "13px",
                                    }}
                                />
                            </div>
                        </div>

                        {/* CONVERSATIONS */}

                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                            }}
                        >
                            {loading && (
                                <div
                                    style={{
                                        padding:
                                            "30px 20px",
                                        opacity: ".6",
                                        fontSize:
                                            "13px",
                                    }}
                                >
                                    Loading...
                                </div>
                            )}

                            {!loading &&
                                !error &&
                                filteredConversations.length ===
                                    0 && (
                                    <div
                                        style={{
                                            padding:
                                                "30px 20px",
                                            opacity: ".6",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        No conversations
                                        found.
                                    </div>
                                )}

                            {!loading &&
                                filteredConversations.map(
                                    (
                                        conversation
                                    ) => {
                                        const last =
                                            conversation
                                                .messages[
                                                conversation
                                                    .messages
                                                    .length -
                                                    1
                                            ];

                                        const active =
                                            selected?.id ===
                                            conversation.id;

                                        return (
                                            <button
                                                key={
                                                    conversation.id
                                                }
                                                onClick={() =>
                                                    setSelected(
                                                        conversation
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "100%",
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "12px",
                                                    padding:
                                                        "17px 18px",
                                                    border: 0,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,.07)",
                                                    background:
                                                        active
                                                            ? "#d8e99e"
                                                            : "transparent",
                                                    color:
                                                        active
                                                            ? "#172019"
                                                            : "#f3f0e8",
                                                    textAlign:
                                                        "left",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width:
                                                            "43px",
                                                        height:
                                                            "43px",
                                                        minWidth:
                                                            "43px",
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        justifyContent:
                                                            "center",
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            active
                                                                ? "#172019"
                                                                : "#65764d",
                                                        color:
                                                            "#fff",
                                                        fontWeight:
                                                            "700",
                                                    }}
                                                >
                                                    {getInitial(
                                                        conversation
                                                            .user
                                                            ?.name
                                                    )}
                                                </div>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            0,
                                                    }}
                                                >
                                                    <strong
                                                        style={{
                                                            display:
                                                                "block",
                                                            fontSize:
                                                                "14px",
                                                        }}
                                                    >
                                                        {conversation
                                                            .user
                                                            ?.name ||
                                                            "User"}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            display:
                                                                "block",
                                                            marginTop:
                                                                "3px",
                                                            fontSize:
                                                                "10px",
                                                            opacity:
                                                                ".65",
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                    >
                                                        {
                                                            conversation
                                                                .product
                                                                ?.title
                                                        }
                                                    </span>

                                                    <p
                                                        style={{
                                                            margin:
                                                                "5px 0 0",
                                                            fontSize:
                                                                "11px",
                                                            opacity:
                                                                ".65",
                                                            overflow:
                                                                "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {
                                                            last?.message
                                                        }
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                        </div>
                    </aside>

                    {/* RIGHT */}

                    <section
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                            background:
                                "#faf9f4",
                        }}
                    >
                        {!selected ? (
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    justifyContent:
                                        "center",
                                    alignItems:
                                        "center",
                                    textAlign:
                                        "center",
                                    padding: "30px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "75px",
                                        height: "75px",
                                        display:
                                            "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "#d8e99e",
                                        color:
                                            "#172019",
                                        marginBottom:
                                            "18px",
                                    }}
                                >
                                    <MessageCircle
                                        size={30}
                                    />
                                </div>

                                <h2
                                    style={{
                                        margin: 0,
                                        color: "#172019",
                                        fontSize:
                                            "24px",
                                    }}
                                >
                                    Select a conversation
                                </h2>

                                <p
                                    style={{
                                        maxWidth:
                                            "360px",
                                        color:
                                            "#777b72",
                                        fontSize:
                                            "13px",
                                        lineHeight:
                                            "1.6",
                                    }}
                                >
                                    Choose a conversation
                                    from the left to
                                    continue chatting.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* CHAT HEADER */}

                                <header
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        padding:
                                            "18px 24px",
                                        borderBottom:
                                            "1px solid rgba(23,32,25,.1)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width:
                                                    "45px",
                                                height:
                                                    "45px",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    "#172019",
                                                color:
                                                    "#fff",
                                                fontWeight:
                                                    "700",
                                            }}
                                        >
                                            {getInitial(
                                                selected
                                                    .user
                                                    ?.name
                                            )}
                                        </div>

                                        <div>
                                            <strong
                                                style={{
                                                    display:
                                                        "block",
                                                    color:
                                                        "#172019",
                                                }}
                                            >
                                                {selected
                                                    .user
                                                    ?.name ||
                                                    "User"}
                                            </strong>

                                            <span
                                                style={{
                                                    fontSize:
                                                        "11px",
                                                    color:
                                                        "#65764d",
                                                }}
                                            >
                                                {
                                                    selected
                                                        .product
                                                        ?.title
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/products/${selected.product?.id}`}
                                        style={{
                                            color:
                                                "#172019",
                                            fontSize:
                                                "11px",
                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        View item →
                                    </Link>
                                </header>

                                {/* MESSAGES */}

                                <div
                                    style={{
                                        flex: 1,
                                        overflowY:
                                            "auto",
                                        padding:
                                            "25px",
                                    }}
                                >
                                    <div
                                        style={{
                                            textAlign:
                                                "center",
                                            marginBottom:
                                                "30px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                display:
                                                    "inline-block",
                                                padding:
                                                    "7px 13px",
                                                background:
                                                    "#eeece4",
                                                color:
                                                    "#65764d",
                                                fontSize:
                                                    "9px",
                                                letterSpacing:
                                                    ".12em",
                                                fontWeight:
                                                    "700",
                                            }}
                                        >
                                            {
                                                selected
                                                    .product
                                                    ?.title
                                            }
                                        </span>
                                    </div>

                                    {selected.messages.map(
                                        (message) => {
                                            const mine =
                                                message.sender_id ===
                                                user?.id;

                                            return (
                                                <div
                                                    key={
                                                        message.id
                                                    }
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            mine
                                                                ? "flex-end"
                                                                : "flex-start",
                                                        marginBottom:
                                                            "12px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            maxWidth:
                                                                "65%",
                                                            padding:
                                                                "12px 15px 8px",
                                                            background:
                                                                mine
                                                                    ? "#172019"
                                                                    : "#e5e2d9",
                                                            color:
                                                                mine
                                                                    ? "#f8f6f0"
                                                                    : "#172019",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin:
                                                                    0,
                                                                fontSize:
                                                                    "13px",
                                                                lineHeight:
                                                                    "1.5",
                                                            }}
                                                        >
                                                            {
                                                                message.message
                                                            }
                                                        </p>

                                                        <span
                                                            style={{
                                                                display:
                                                                    "block",
                                                                marginTop:
                                                                    "5px",
                                                                textAlign:
                                                                    "right",
                                                                fontSize:
                                                                    "9px",
                                                                opacity:
                                                                    ".5",
                                                            }}
                                                        >
                                                            {message.created_at
                                                                ? new Date(
                                                                      message.created_at
                                                                  ).toLocaleTimeString(
                                                                      "fr-FR",
                                                                      {
                                                                          hour: "2-digit",
                                                                          minute: "2-digit",
                                                                      }
                                                                  )
                                                                : ""}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                {/* SEND */}

                                <form
                                    onSubmit={
                                        sendMessage
                                    }
                                    style={{
                                        display:
                                            "flex",
                                        gap: "10px",
                                        padding:
                                            "15px 18px",
                                        borderTop:
                                            "1px solid rgba(23,32,25,.1)",
                                        background:
                                            "#eeece4",
                                    }}
                                >
                                    <input
                                        value={text}
                                        onChange={(e) =>
                                            setText(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Write a message..."
                                        style={{
                                            flex: 1,
                                            border: 0,
                                            outline: 0,
                                            padding:
                                                "13px 15px",
                                            background:
                                                "#faf9f4",
                                            color:
                                                "#172019",
                                            fontSize:
                                                "13px",
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            sending ||
                                            !text.trim()
                                        }
                                        style={{
                                            width:
                                                "48px",
                                            border: 0,
                                            background:
                                                "#172019",
                                            color:
                                                "#fff",
                                            display:
                                                "flex",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

