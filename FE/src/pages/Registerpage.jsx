import React, { useState } from "react";
import { Link } from "react-router-dom";
import country from "country-list-js";

const languageNames = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", 
  "Belarusian", "Bengali", "Bosnian", "Bulgarian", "Burmese", "Catalan", "Cebuano", 
  "Chichewa", "Chinese", "Corsican", "Croatian", "Czech", "Danish", "Dutch", 
  "English", "Esperanto", "Estonian", "Filipino", "Finnish", "French", "Galician", 
  "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", 
  "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", 
  "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", 
  "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", "Luxembourgish", "Macedonian", 
  "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", 
  "Nepali", "Norwegian", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", 
  "Romanian", "Russian", "Samoan", "Serbian", "Sesotho", "Shona", "Sindhi", 
  "Sinhala", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", 
  "Swedish", "Tajik", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", 
  "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [message, setMessage] = useState("");

  const countryList = country.names();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || username.length < 3) {
      alert("Username must be at least 3 characters long.");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    if (!fullname) {
      alert("Please enter your full name.");
      return;
    }

    if (!selectedCountry) {
      alert("Please select a country.");
      return;
    }

    if (!selectedLanguage) {
      alert("Please select a language.");
      return;
    }

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        fullname,
        country: selectedCountry,
        language: selectedLanguage,
      }),
    });

    if (response.ok) {
      setUsername("");
      setPassword("");
      setEmail("");
      setFullname("");
      setSelectedCountry("");
      setSelectedLanguage("");
      setMessage("Registration successful!");
    } else {
      const errorData = await response.json();
      setMessage(`Registration failed: ${errorData.error || "Unknown error"}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <Link to="/main-page" className="btn btn-primary mb-3 float-start">
            Home
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <select className="form-control" id="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                <option value="">Select a country</option>
                {countryList.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="language" className="form-label">Preferred Language</label>
              <select className="form-control" id="language" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                <option value="">Select your language</option>
                {languageNames.map((language, index) => (
                  <option key={index} value={language}>{language}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          <div className="mt-3">{message}</div>
        </div>
      </div> 
    </div>
  );
}
