import { useState } from "react";

const API_URL = "https://aidoctor-bknd.onrender.com";

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [booking, setBooking] = useState({
    name: "",
    doctor: "",
    time: "",
    symptoms: "",
  });

  const sendSymptoms = async () => {
    if (!text.trim()) return;

    setChat((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setDoctors(data.doctors || []);

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            `Prediction: ${data.prediction}\n\n` +
            `Details: ${data.details}\n\n` +
            `Suggested Tests: ${(data.suggested_tests || []).join(", ")}`,
        },
      ]);
    } catch (e) {
      setChat((prev) => [
        ...prev,
        { role: "bot", content: "Server error or backend not reachable" },
      ]);
    }

    setLoading(false);
    setText("");
  };

  const bookAppointment = async () => {
    try {
      await fetch(`${API_URL}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      alert("Appointment booked successfully");
    } catch {
      alert("Booking failed");
    }
  };

  const downloadReport = async () => {
    try {
      const res = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: booking.symptoms || "general checkup",
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "medical_report.pdf";
      a.click();
    } catch {
      alert("Report generation failed");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🏥 AI Hospital Assistant</h1>

      {/* CHAT BOX */}
      <div style={styles.card}>
        <div style={styles.chatBox}>
          {chat.map((m, i) => (
            <div key={i} style={styles.msg}>
              <b>{m.role === "user" ? "You" : "AI"}:</b>
              <pre style={styles.pre}>{m.content}</pre>
            </div>
          ))}

          {loading && <p>Thinking...</p>}
        </div>

        <div style={styles.row}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter symptoms..."
            style={styles.textarea}
          />
          <button onClick={sendSymptoms} style={styles.button}>
            Send
          </button>
        </div>
      </div>

      {/* DOCTORS */}
      <div style={styles.grid}>
        {doctors.map((d, i) => (
          <div key={i} style={styles.card}>
            <h3>{d.name}</h3>
            <p>{d.specialty}</p>
            <p>{d.phone}</p>
            <p>{d.availability}</p>
          </div>
        ))}
      </div>

      {/* BOOKING */}
      <div style={styles.card}>
        <input
          placeholder="Your Name"
          style={styles.input}
          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
        />

        <input
          placeholder="Doctor Name"
          style={styles.input}
          onChange={(e) => setBooking({ ...booking, doctor: e.target.value })}
        />

        <input
          placeholder="Time"
          style={styles.input}
          onChange={(e) => setBooking({ ...booking, time: e.target.value })}
        />

        <input
          placeholder="Symptoms"
          style={styles.input}
          onChange={(e) =>
            setBooking({ ...booking, symptoms: e.target.value })
          }
        />

        <div style={styles.row}>
          <button onClick={bookAppointment} style={styles.greenBtn}>
            Book Appointment
          </button>

          <button onClick={downloadReport} style={styles.grayBtn}>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* SIMPLE INLINE STYLES (NO LIBRARIES NEEDED) */
const styles = {
  page: {
    fontFamily: "Arial",
    padding: 20,
    background: "#f5f7ff",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  chatBox: {
    height: 300,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: 10,
    background: "#fafafa",
  },
  msg: {
    marginBottom: 10,
  },
  pre: {
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  textarea: {
    flex: 1,
    padding: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  greenBtn: {
    padding: "10px 20px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  grayBtn: {
    padding: "10px 20px",
    background: "gray",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 10,
  },
};