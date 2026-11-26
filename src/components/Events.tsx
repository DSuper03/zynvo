import Link from 'next/link';

export default function Events() {
  return (
    <section
      className="bg-yellow-300 px-6 py-24"
      aria-labelledby="campus-events-title"
    >
      <div className="mx-auto max-w-4xl rounded-3xl bg-black p-8 text-center sm:p-12">
        <p className="text-sm font-semibold text-slate-200">
          Campus Events &amp; Clubs
        </p>
        <h2
          id="campus-events-title"
          className="mt-4 text-3xl font-bold text-white sm:text-5xl"
        >
          Explore campus life on Zynvo
        </h2>
        <p className="mt-5 text-slate-200">
          Your one place for campus, clubs and events.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/for-students"
            className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-200 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300"
          >
            For students
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-yellow-300 px-6 py-3 font-semibold text-black hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Join free
          </Link>
        </div>
      </div>
    </section>
  );
}
