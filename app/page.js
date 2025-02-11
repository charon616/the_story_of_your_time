"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Inter } from "next/font/google";

const inter = Inter({
  weight: '400',
})

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    age: '24',
    gender: 'Male',
    occupation: 'Student',
    country: 'UK'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ローディング状態を開始

    // format formData to prompt
    let prompt = JSON.stringify(formData);

    const res = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt })
    });

    let data = await res.json();
    data = JSON.parse(data);
    // combine data with formData
    data = { ...formData, ...data };

    console.log(data);

    // データをlocalStorageに保存
    localStorage.setItem('resultData', JSON.stringify(data));

    setLoading(false); // ローディング状態を終了

    router.push('/result');
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-12 bg-image-home">
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
                <option value="student">Student</option>
                <option value="engineer">Engineer</option>
                <option value="artist">Artist</option>
                <option value="doctor">Doctor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="text-2xl font-medium">Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className={`p-2 border rounded-md ${inter.className}`}>
                <option value="uk">UK</option>
                <option value="usa">USA</option>
                <option value="germany">Chine</option>
                <option value="japan">Japan</option>
                <option value="germany">Germany</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className={`text-xl text-white px-4 py-2 rounded-full transition ${loading ? 'cursor-not-allowed bg-slate-700' : 'cursor-pointer bg-black hover:bg-slate-700'}`}>
              {loading ? 'Loading...' : "Let's Start 📜"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
