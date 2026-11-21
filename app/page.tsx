export default function Home() {
  return (
    <main className="min-h-screen bg-emerald-950 text-emerald-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between border-b border-emerald-800/70 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Dodola Ifa Boru
            </p>
            <p className="mt-1 text-sm text-emerald-200/80">
              Special Boarding School · Grades 9–12
            </p>
          </div>
          <span className="rounded-full border border-emerald-700 px-3 py-1 text-xs text-emerald-200">
            Foundation ready
          </span>
        </header>

        <section className="max-w-2xl py-20">
          <p className="mb-5 text-sm font-medium text-amber-300">School portal</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            A prepared school day starts here.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-emerald-100/75 sm:text-lg">
            The Next.js foundation is in place. The public landing page, school information,
            and role-based portal experiences will be built on this base.
          </p>
        </section>

        <footer className="border-t border-emerald-800/70 pt-5 text-sm text-emerald-200/70">
          Next.js · React · TypeScript · Vercel-ready
        </footer>
      </div>
    </main>
  );
}
