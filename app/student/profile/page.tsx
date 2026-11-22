"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function StudentProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/");
        return;
      }

      setUserId(userData.user.id);
      const [{ data: profile }, { data: studentProfile }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", userData.user.id).single(),
        supabase.from("student_profiles").select("gender, date_of_birth, phone, emergency_contact_name, emergency_contact_phone").eq("id", userData.user.id).maybeSingle(),
      ]);

      setFullName(profile?.full_name ?? "");
      setGender(studentProfile?.gender ?? "");
      setDateOfBirth(studentProfile?.date_of_birth ?? "");
      setPhone(studentProfile?.phone ?? "");
      setEmergencyName(studentProfile?.emergency_contact_name ?? "");
      setEmergencyPhone(studentProfile?.emergency_contact_phone ?? "");
    }

    void loadProfile();
  }, [router]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.from("student_profiles").upsert({
      id: userId,
      gender: gender || null,
      date_of_birth: dateOfBirth || null,
      phone: phone || null,
      emergency_contact_name: emergencyName || null,
      emergency_contact_phone: emergencyPhone || null,
      profile_completed: Boolean(dateOfBirth && phone && emergencyName && emergencyPhone),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Your profile has been saved.");
  };

  return (
    <main className="profile-shell">
      <section className="profile-card">
        <button className="dashboard-back-link" type="button" onClick={() => router.push("/student/dashboard")}>← Back to dashboard</button>
        <p className="dashboard-eyebrow">Student profile</p>
        <h1>Complete your profile</h1>
        <p className="profile-intro">Add the remaining information the school needs after your registration is approved.</p>
        <form className="profile-form" onSubmit={saveProfile}>
          <label>
            Full Name
            <input value={fullName} readOnly />
          </label>
          <label>
            Gender
            <input value={gender} readOnly />
          </label>
          <label>
            Date of birth
            <input type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
          </label>
          <label>
            Phone number
            <input type="tel" placeholder="Your phone number" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label>
            Emergency contact name
            <input placeholder="Full name" value={emergencyName} onChange={(event) => setEmergencyName(event.target.value)} />
          </label>
          <label>
            Emergency contact phone
            <input type="tel" placeholder="Phone number" value={emergencyPhone} onChange={(event) => setEmergencyPhone(event.target.value)} />
          </label>
          <button className="dashboard-button" type="submit">Save profile</button>
          {(message || errorMessage) && <p className="profile-status" role="status">{errorMessage || message}</p>}
        </form>
      </section>
    </main>
  );
}
