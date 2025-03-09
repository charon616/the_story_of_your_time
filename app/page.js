"use client";

// main page
import p5 from "p5"; 
import { sketch } from "./lib/sketch_home"; // load sketch from external file
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Inter } from "next/font/google";

const inter = Inter({
  weight: '400',
  subsets: ['latin']
})

export default function Home() {
  const sketchRef = useRef(null); // p5 canvas ref
  const router = useRouter()
  const [formData, setFormData] = useState({ // default form data
    age: '24',
    gender: 'Male',
    occupation: 'Student',
    country: 'UK'
  });
  const [loading, setLoading] = useState(false); // button loading state

  // useEffect(() => {
  //   const p5Instance = new p5(sketch, sketchRef.current); // create p5 instance
  //   return () => p5Instance.remove(); // cleanup
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start button loading

    // calc birthyear and deathyear
    const age = parseInt(formData.age);
    const currentYear = new Date().getFullYear();
    const birthyear = currentYear - age;
    const deathyear = currentYear + Math.floor(Math.random() * 100 - 20);

    // determine cause of death based on probabilities
    let causeOfDeath = "Other";
    if (formData.gender === "Male") {
      const rand = Math.random() * 100;
      if (rand <= 22.5) {
        causeOfDeath = "Heart Disease";
      } else if (rand <= 22.5 + 18.6) {
        causeOfDeath = "Cancer";
      } else if (rand <= 22.5 + 18.6 + 8.8) {
        causeOfDeath = "Unintentional injuries";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0) {
        causeOfDeath = "COVID-19";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2) {
        causeOfDeath = "Stroke";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2 + 4.0) {
        causeOfDeath = "Chronic lower respiratory disease";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2 + 4.0 + 3.3) {
        causeOfDeath = "Diabetes";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2 + 4.0 + 3.3 + 2.3) {
        causeOfDeath = "Suicide";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2 + 4.0 + 3.3 + 2.3 + 2.2) {
        causeOfDeath = "Alzheimer disease";
      } else if (rand <= 22.5 + 18.6 + 8.8 + 6.0 + 4.2 + 4.0 + 3.3 + 2.3 + 2.2 + 2.0) {
        causeOfDeath = "Chronic liver disease and cirrhosis";
      } 
    } else {
      const rand = Math.random() * 100;
      if (rand <= 20.3) {
        causeOfDeath = "Heart Disease";
      } else if (rand <= 20.3 + 18.5) {
        causeOfDeath = "Cancer";
      } else if (rand <= 20.3 + 18.5 + 6.0) {
        causeOfDeath = "Stroke";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4) {
        causeOfDeath = "COVID-19";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3) {
        causeOfDeath = "Alzheimer disease";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3 + 5.0) {
        causeOfDeath = "Chronic lower respiratory disease";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3 + 5.0 + 4.8) {
        causeOfDeath = "Unintentional injuries";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3 + 5.0 + 4.8 + 2.8) {
        causeOfDeath = "Diabetes";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3 + 5.0 + 4.8 + 2.8 + 1.8) {
        causeOfDeath = "Kidney disease";
      } else if (rand <= 20.3 + 18.5 + 6.0 + 5.4 + 5.3 + 5.0 + 4.8 + 2.8 + 1.8 + 1.5) {
        causeOfDeath = "Hypertension";
      } 
    }

    // format formData to prompt
    let newFormData = { ...formData, "birthyear" : birthyear, "deathyear" : deathyear, "causeOfDeath" : causeOfDeath };
    let prompt = JSON.stringify(newFormData);

    // fetch data from backend api
    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt })
    });

    // receive data from backend api
    let data = await res.json();
    data = JSON.parse(data);
    data = { ...formData, ...data }; // combine data with formData
    localStorage.setItem('resultData', JSON.stringify(data)); // save data to localStorage

    setLoading(false); // end button loading

    router.push('/result'); // redirect to result page
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-12">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-6xl font-bold">The Story of Your Time</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex flex-col">
              <label htmlFor="age" className="text-2xl font-medium">Age</label>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className={`p-2 border rounded-md ${inter.className}`} />
            </div>
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-2xl font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={`p-2 border rounded-md ${inter.className}`}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="occupation" className="text-2xl font-medium">Occupation</label>
              <select name="occupation" value={formData.occupation} onChange={handleChange} className={`p-2 border rounded-md ${inter.className}`}>
                <option value="Student">Student</option>
                <option value="Engineer">Engineer</option>
                <option value="Artist">Artist</option>
                <option value="Designer">Designer</option>
                <option value="Researcher">Researcher</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="text-2xl font-medium">Country</label>
              <input
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className={`p-2 border rounded-md ${inter.className}`}
                placeholder="Enter your country"
              />
            </div>
            <button type="submit" className={`text-2xl text-black px-4 py-4 rounded-full transition ${loading ? 'cursor-not-allowed text-gray-600 bg-[#FF7E68]' : 'cursor-pointe bg-[#FF6347] hover:bg-[#FF7E68] hover:text-gray-800'}`}>
              {loading ? 'Loading...' : "Let's Start!"}
            </button>
          </form>
        </div>
      </main>

      <div ref={sketchRef} /> {/* p5 canvas for walking animation */}
    </div>
  );
}
