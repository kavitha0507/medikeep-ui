'use client';

import { useEffect, useState } from 'react';
import { Trash2, Volume2, Check } from 'lucide-react'; // Added missing imports

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const [medications, setMedications] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');

  // 1. Fetch data from Spring Boot
  useEffect(() => {
    fetch('http://localhost:8080/api/medications')
      .then((res) => res.json())
      .then((data) => setMedications(data))
      .catch((err) => console.error("Check if Backend is running!", err));
  }, []);

  // 2. Add Medication
  const addMedication = async (e: any) => {
    e.preventDefault();
    const newMed = { name, dosage, reminderTime: time, isTaken: false };

    await fetch('http://localhost:8080/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMed),
    });
    window.location.reload(); 
  };

  // 3. Delete Medication
  const deleteMedication = async (id: number) => {
    if(confirm("Are you sure you want to remove this?")) {
      await fetch(`http://localhost:8080/api/medications/${id}`, {
        method: 'DELETE',
      });
      window.location.reload();
    }
  };

  // 4. Mark as Taken (Fixed the missing function)
  const markAsTaken = async (id: number, medName: string) => {
  // 1. Send the update to your Spring Boot backend
  await fetch(`http://localhost:8080/api/medications/${id}/taken`, {
    method: 'PUT',
  });

  // 2. TRIGGER THE VOICE COMMAND
  const feedback = new SpeechSynthesisUtterance(`Excellent. ${medName} has been recorded as taken.`);
  feedback.rate = 0.9;
  window.speechSynthesis.speak(feedback);

  // 3. Wait a moment for the voice to start before refreshing
  setTimeout(() => {
    window.location.reload();
  }, 2000); 
};
  // 5. Voice Instructions
  const speakInstructions = (name: string, dosage: string, time: string) => {
    const message = `Reminder: Please take your ${dosage} of ${name} scheduled for ${time}.`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };
// --- ADD THIS LOGIC HERE ---
  const totalMeds = medications.filter((med: any) => med.name).length;
  const takenMeds = medications.filter((med: any) => med.isTaken || med.taken).length;
  const progressPercentage = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;
  // Filter for only medications that have been taken
const takenHistory = medications.filter((med: any) => med.isTaken || med.taken);
  
  // Get today's date in a friendly format
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
return (
  <div className="flex min-h-screen flex-col items-center bg-slate-50 p-8 font-sans text-black">
    <main className="w-full max-w-4xl flex flex-col gap-8">
      
      {/* 1. HEADER SECTION */}
      <header className="mt-10">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          My Daily Medications
        </h1>
        <p className="text-xl text-slate-500 mt-2 font-medium">Today is {today}</p>
      </header>

      {/* 2. ADD MEDICATION FORM (The missing part!) */}
      <form onSubmit={addMedication} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-slate-800">Add New Medicine</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            className="border-2 p-4 rounded-xl text-xl text-black" 
            placeholder="Name (e.g. Calcium)" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
          />
          <input 
            className="border-2 p-4 rounded-xl text-xl text-black" 
            placeholder="Dosage (500mg)" 
            value={dosage}
            onChange={(e) => setDosage(e.target.value)} 
            required
          />
          <input 
            className="border-2 p-4 rounded-xl text-xl text-black" 
            placeholder="Time (10:00 AM)" 
            value={time}
            onChange={(e) => setTime(e.target.value)} 
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition-colors">
          + Save Medication
        </button>
      </form>

      {/* 3. PROGRESS TRACKER */}
      <div className="w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800">Daily Progress</h2>
          <span className="text-2xl font-black text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-lg text-slate-500 mt-4 font-medium">
          {takenMeds} of {totalMeds} medications taken today.
        </p>
      </div>

      <hr className="border-slate-200" />

      {/* 4. MEDICATIONS LIST (Grid with Voice & Delete) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {medications
          .filter((med: any) => med.name)
          .map((med: any) => (
            <div key={med.id} className="relative bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
              
              {/* Delete Icon */}
              <button 
                onClick={() => deleteMedication(med.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-extrabold text-slate-900">{med.name}</h2>
                <button 
                  onClick={() => speakInstructions(med.name, med.dosage, med.reminderTime)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                >
                  <Volume2 size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dosage</p>
                  <p className="text-xl font-bold text-slate-800">{med.dosage}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</p>
                  <p className="text-xl font-bold text-slate-800">{med.reminderTime}</p>
                </div>
              </div>
<div className="mt-8">
  {(med.isTaken || med.taken) ? (
    <div className="flex flex-col items-center gap-1 bg-green-50 text-green-600 px-6 py-4 rounded-2xl w-full border border-green-100">
      <div className="flex items-center gap-3">
        <Check size={28} strokeWidth={3} />
        <span className="text-xl font-bold uppercase">Taken</span>
      </div>
      
      {/* --- ADDED REAL TIMESTAMP HERE --- */}
      {med.takenAt && (
        <p className="text-sm font-medium text-green-700/70">
          at {new Date(med.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  ) : (
    <button 
      onClick={() => markAsTaken(med.id, med.name)}
      className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
    >
      Mark as Taken
    </button>
  )}
</div>
            </div>
        ))}
      </div>
      {/* --- MEDICATION HISTORY SECTION --- */}
<div className="mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-green-100 p-2 rounded-lg">
      <Check className="text-green-600" size={24} />
    </div>
    <h2 className="text-2xl font-bold text-slate-800">Completion History</h2>
  </div>

  {takenHistory.length === 0 ? (
    <p className="text-slate-400 italic text-lg">No medications recorded yet today.</p>
  ) : (
    <div className="flex flex-col gap-4">
      {takenHistory.map((med: any) => (
        <div key={`history-${med.id}`} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-xl font-bold text-slate-800">{med.name}</p>
            <p className="text-sm text-slate-500 uppercase font-bold tracking-tight">Dose: {med.dosage}</p>
          </div>
          <div className="text-right">
            {/* Shows a placeholder time since we aren't storing the 'Taken At' time in the DB yet */}
            <p className="text-lg font-bold text-green-600">✓ Completed</p>
            <p className="text-sm text-slate-400">Scheduled: {med.reminderTime}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
    </main>
  </div>
);
}