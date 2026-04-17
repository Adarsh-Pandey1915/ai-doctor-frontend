import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

    const userMsg = { role: "user", content: text };
    setChat((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setDoctors(data.doctors || []);

      const botMsg = {
        role: "bot",
        content:
          `Prediction: ${data.prediction}\n\n` +
          `Details: ${data.details}\n\n` +
          `Suggested Tests: ${data.suggested_tests?.join(", ")}`,
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (e) {
      setChat((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to server" },
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
    } catch (e) {
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
    } catch (e) {
      alert("Report generation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-purple-100 p-4">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold text-center mb-6"
      >
        🏥 AI Hospital Assistant
      </motion.h1>

      {/* CHAT */}
      <div className="max-w-5xl mx-auto bg-white rounded p-4 shadow">
        <div className="h-96 overflow-y-auto border rounded p-2 bg-gray-50">
          {chat.map((m, i) => (
            <div key={i} className="mb-2 whitespace-pre-wrap">
              <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" /> Thinking...
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter symptoms..."
            className="w-full border p-2 rounded"
          />
          <button
            onClick={sendSymptoms}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>

      {/* DOCTORS */}
      <div className="max-w-5xl mx-auto mt-6 grid md:grid-cols-3 gap-4">
        {doctors.map((d, i) => (
          <div key={i} className="bg-white p-4 shadow rounded">
            <h2 className="font-bold">{d.name}</h2>
            <p>{d.specialty}</p>
            <p>📞 {d.phone}</p>
            <p>⏰ {d.availability}</p>
          </div>
        ))}
      </div>

      {/* BOOKING */}
      <div className="max-w-5xl mx-auto mt-6 bg-white p-4 shadow rounded">
        <input
          placeholder="Your Name"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setBooking({ ...booking, name: e.target.value })
          }
        />

        <input
          placeholder="Doctor Name"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setBooking({ ...booking, doctor: e.target.value })
          }
        />

        <input
          placeholder="Time"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setBooking({ ...booking, time: e.target.value })
          }
        />

        <input
          placeholder="Symptoms"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setBooking({ ...booking, symptoms: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={bookAppointment}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Book Appointment
          </button>

          <button
            onClick={downloadReport}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}