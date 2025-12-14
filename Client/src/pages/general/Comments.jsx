import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Comments = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food/${foodId}/comments`,
        {
          withCredentials: true,
        }
      );
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [foodId]);

  async function submitComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post(
        "http://localhost:3000/api/food/comments",
        { foodId, text },
        { withCredentials: true }
      );
      setText("");
      await load(); // refresh list to show newest first
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)} aria-label="Back">
        ← Back
      </button>
      <h2>Comments</h2>

      <form onSubmit={submitComment} style={{ marginBottom: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          maxLength={500}
          style={{ width: "100%", padding: 8 }}
        />
        <button type="submit" style={{ marginTop: 8 }}>
          Post
        </button>
      </form>

      {loading ? (
        <div>Loading…</div>
      ) : comments.length === 0 ? (
        <div>No comments yet.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {comments.map((c) => (
            <li
              key={c._id}
              style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}
            >
              <div style={{ fontSize: 13, color: "#666" }}>
                {new Date(c.createdAt).toLocaleString()}
              </div>
              <div style={{ fontSize: 15 }}>{c.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
