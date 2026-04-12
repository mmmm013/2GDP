export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-amber-400 flex flex-col items-center justify-center px-6 py-20">
      <h1 className="text-4xl font-bold mb-6">Contact G Putnam Music</h1>
      <p className="text-lg text-amber-200 mb-8 max-w-xl text-center">
        Reach out for licensing, collaboration, press inquiries, or general questions.
      </p>
      <div className="space-y-4 text-center">
        <p className="text-amber-300">
          <span className="font-semibold">Email: </span>
          <a href="mailto:Gputnam@gputnammusic.com" className="underline hover:text-white">
            Gputnam@gputnammusic.com
          </a>
        </p>
        <p className="text-amber-300">
          <span className="font-semibold">Website: </span>
          <a href="https://www.gputnammusic.com" className="underline hover:text-white">
            www.gputnammusic.com
          </a>
        </p>
      </div>
    </main>
  );
}
