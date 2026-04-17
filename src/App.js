import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
      setChat((prev) => [...prev, { role: "bot", content: "Error connecting to server" }]);
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
        body: JSON.stringify({ text: booking.symptoms || "general checkup" }),
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

      <Tabs defaultValue="chat" className="max-w-5xl mx-auto">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="chat">AI Doctor</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        {/* CHAT */}
        <TabsContent value="chat">
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="h-96 overflow-y-auto border rounded p-2 bg-white">
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
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter symptoms..."
                />
                <Button onClick={sendSymptoms}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCTORS */}
        <TabsContent value="doctors">
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {doctors.map((d, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h2 className="font-bold">{d.name}</h2>
                  <p>{d.specialty}</p>
                  <p>📞 {d.phone}</p>
                  <p>⏰ {d.availability}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* BOOKING */}
        <TabsContent value="booking">
          <Card className="mt-4">
            <CardContent className="p-4 space-y-3">
              <Input placeholder="Your Name" onChange={(e) => setBooking({ ...booking, name: e.target.value })} />
              <Input placeholder="Doctor Name" onChange={(e) => setBooking({ ...booking, doctor: e.target.value })} />
              <Input placeholder="Time" onChange={(e) => setBooking({ ...booking, time: e.target.value })} />
              <Input placeholder="Symptoms" onChange={(e) => setBooking({ ...booking, symptoms: e.target.value })} />

              <div className="flex gap-2">
                <Button onClick={bookAppointment}>Book Appointment</Button>
                <Button variant="secondary" onClick={downloadReport}>
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
