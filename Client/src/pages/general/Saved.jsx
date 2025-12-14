import React, { useEffect, useState } from "react";
import "../../styles/profile.css"; // reuse grid styles from profile if available
import axios from "axios";

const Saved = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:3000/api/food/saved", {
          withCredentials: true,
        });
        setItems(Array.isArray(res.data.foods) ? res.data.foods : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    }
    load();
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1 className="profile-title">Saved</h1>
        <p className="profile-subtitle">Your saved videos</p>
      </header>

      <section className="profile-grid" aria-label="Saved Videos">
        {items.length === 0 ? (
          <div className="profile-empty">No saved videos yet.</div>
        ) : (
          items.map((v) => (
            <div key={v._id} className="profile-grid-item">
              <video
                className="profile-grid-video"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                src={v.video}
                muted
              ></video>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Saved;
