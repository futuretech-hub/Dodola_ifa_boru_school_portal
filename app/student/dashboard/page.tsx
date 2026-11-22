"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DashboardState = {
  fullName: string;
  accountStatus: string;
  applicationStatus: string;
  gender: string;
  grade: number | null;
  section: string;
  profileComplete: boolean;
  announcements: { id: string; title: string; message: string; published_at: string | null }[];
};

export default function StudentDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/");
        return;
      }

      const userId = userData.user.id;
      const [{ data: profile, error: profileError }, { data: application }, { data: studentProfile }, { data: announcements }] = await Promise.all([
        supabase.from("profiles").select("full_name, role, account_status").eq("id", userId).single(),
        supabase.from("student_applications").select("status, grade, section, gender").eq("user_id", userId).maybeSingle(),
        supabase.from("student_profiles").select("gender, profile_completed").eq("id", userId).maybeSingle(),
        supabase.from("announcements").select("id, title, message, published_at").order("published_at", { ascending: false }).limit(5),
      ]);

      if (profileError) {
        setErrorMessage(`Supabase could not read your profile: ${profileError.message}`);
        setLoading(false);
        return;
      }

      if (!profile) {
        setErrorMessage("Your Auth account exists, but no matching public.profiles record was found.");
        setLoading(false);
        return;
      }

      if (profile.role !== "student") {
        setErrorMessage(`This account has the role “${profile.role}”, not “student”.`);
        setLoading(false);
        return;
      }

      setDashboard({
        fullName: profile.full_name,
        accountStatus: profile.account_status,
        applicationStatus: application?.status ?? "pending",
        gender: studentProfile?.gender ?? application?.gender ?? "Not set",
        grade: application?.grade ?? null,
        section: application?.section ?? "Not set",
        profileComplete: studentProfile?.profile_completed ?? false,
        announcements: announcements ?? [],
      });
      setLoading(false);
    }

    void loadDashboard();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return <main className="dashboard-shell"><p className="dashboard-loading">Loading your student portal…</p></main>;
  }

  if (errorMessage || !dashboard) {
    return (
      <main className="dashboard-shell">
        <section className="dashboard-message-card">
          <Image src="/images/school-logo.png" alt="Dodola Ifa Boru School" width={86} height={86} />
          <h1>Student portal unavailable</h1>
          <p>{errorMessage || "We could not load your student account."}</p>
          <button className="dashboard-button" type="button" onClick={signOut}>Return to login</button>
        </section>
      </main>
    );
  }

  if (dashboard.accountStatus !== "active" || dashboard.applicationStatus !== "approved") {
    return (
      <main className="dashboard-shell">
        <section className="dashboard-message-card">
          <Image src="/images/school-logo.png" alt="Dodola Ifa Boru School" width={86} height={86} />
          <p className="dashboard-eyebrow">Student portal</p>
          <h1>Your application is under review</h1>
          <p>Your account will open after your homeroom teacher approves your registration request.</p>
          <div className="status-pill">Application: {dashboard.applicationStatus}</div>
          <button className="dashboard-button" type="button" onClick={signOut}>Log out</button>
        </section>
      </main>
    );
  }

  const profilePercent = dashboard.profileComplete ? 100 : 25;

  return (
    <main className="dashboard-shell">
      <div className="dashboard-frame">
        <header className="dashboard-header">
          <div className="dashboard-brand">
            <Image src="/images/school-logo.png" alt="Dodola Ifa Boru School" width={54} height={54} />
            <div>
              <p className="dashboard-eyebrow">Dodola Ifa Boru</p>
              <strong>Student Portal</strong>
            </div>
          </div>
          <div className="dashboard-account">
            <span className="dashboard-avatar">{dashboard.fullName.charAt(0).toUpperCase()}</span>
            <span>{dashboard.fullName}</span>
            <button className="dashboard-link-button" type="button" onClick={signOut}>Log out</button>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">Your school overview</p>
            <h1>Welcome, {dashboard.fullName}</h1>
            <p>Stay up to date with your class, profile, and school announcements.</p>
          </div>
          <button className="dashboard-button" type="button" onClick={() => router.push("/student/profile")}>Complete profile</button>
        </section>

        <section className="dashboard-card-grid" aria-label="Student summary">
          <article className="dashboard-stat-card">
            <span className="stat-label">My class</span>
            <strong>{dashboard.grade ? `Grade ${dashboard.grade}` : "Not assigned"}</strong>
            <span>Section {dashboard.section}</span>
          </article>
          <article className="dashboard-stat-card">
            <span className="stat-label">Profile completion</span>
            <strong>{profilePercent}%</strong>
            <span>{dashboard.profileComplete ? "Profile complete" : "More details can be added"}</span>
          </article>
          <article className="dashboard-stat-card">
            <span className="stat-label">Attendance</span>
            <strong>—</strong>
            <span>No attendance records yet</span>
          </article>
          <article className="dashboard-stat-card">
            <span className="stat-label">Latest result</span>
            <strong>—</strong>
            <span>No results published</span>
          </article>
        </section>

        <section className="dashboard-content-grid">
          <article className="dashboard-panel">
            <div className="panel-heading-row">
              <div>
                <p className="dashboard-eyebrow">School updates</p>
                <h2>Recent announcements</h2>
              </div>
            </div>
            {dashboard.announcements.length === 0 ? (
              <p className="empty-dashboard-state">No announcements have been published yet.</p>
            ) : (
              <div className="announcement-list">
                {dashboard.announcements.map((announcement) => (
                  <article className="announcement-item" key={announcement.id}>
                    <h3>{announcement.title}</h3>
                    <p>{announcement.message}</p>
                    {announcement.published_at && <time dateTime={announcement.published_at}>{new Date(announcement.published_at).toLocaleDateString()}</time>}
                  </article>
                ))}
              </div>
            )}
          </article>

          <aside className="dashboard-panel quick-actions">
            <p className="dashboard-eyebrow">Quick actions</p>
            <h2>Keep your profile current</h2>
            <p>Add your date of birth, photo, phone number, and emergency contact after approval.</p>
            <button className="dashboard-outline-button" type="button" onClick={() => router.push("/student/profile")}>Open my profile</button>
          </aside>
        </section>
      </div>
    </main>
  );
}
