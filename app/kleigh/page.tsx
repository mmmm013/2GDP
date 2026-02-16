import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GlobalPlayer from '@/components/GlobalPlayer';
import { Play, Mic2, BookOpen } from 'lucide-react';

// BEHIND THE MUSIC: Artist stories from Kleigh's own words
const TRACK_STORIES = [
  {
    title: 'Beautiful World (Album)',
    type: 'Album',
    quote: 'It was one of the most intense 10 days of my life.',
    story: `The album Beautiful World was recorded over an extraordinary 10-day session in Tari, North New South Wales. Kleigh traveled four hours from Apollo Bay to Bendigo, then another 16 hours by car to reach the studio. Working with an incredibly supportive producer, the sessions were so intense that Kleigh lost 13 kilograms during the recording \u2014 pushed hard in the studio, drenched in sweat, drinking five or six liters of water a day. The result is an album treasured by many.`,
  },
  {
    title: 'Devil Get Away from Me',
    type: 'Album',
    quote: 'This is a turning point and I\u2019m not going to put up with your crap anymore.',
    story: `Written during a major turning point while living in a suburb of Bendigo, Victoria. After leaving a six-year job and battling seven years of fear, paranoia, and illness, Kleigh set up a small home studio \u2014 black curtains, a modest PC, guitar, and piano. Devil Get Away from Me became the pilot album that led to the Beautiful World recording sessions in Tari. It is the sound of standing up, getting strong, and refusing to be held back any longer.`,
  },
  {
    title: 'A Better Me',
    type: 'Track',
    quote: 'It didn\u2019t click with me at first, but then with a bit more effort, it just turned.',
    story: `A Better Me almost didn\u2019t happen. Kleigh wasn\u2019t happy with the initial version \u2014 no guitars, something missing. Then friend and collaborator Bill stepped in at the new studio (the Purple Room at mum\u2019s place), came up with a guitar riff on the spot, and over a couple of hours laid down tracks that transformed the song. Kleigh reproduced the whole thing, re-sang it, and A Better Me came alive. It\u2019s about the universal pursuit of becoming a better self.`,
  },
  {
    title: 'Bounce Back',
    type: 'Track',
    quote: 'Sometimes you just got to ignore the haters.',
    story: `Born from years of dealing with jealousy and a lack of support from those closest to him, Bounce Back is Kleigh\u2019s anthem of resilience. To this day, external listeners have resonated deeply with his music while those nearest have held back. The song is a lesson in self-belief \u2014 if you believe in what you\u2019ve got, that\u2019s a massive step forward, even when people deliberately choose not to give your work a chance.`,
  },
  {
    title: 'Beautiful World (Title Track)',
    type: 'Track',
    quote: 'My cat tore up the lyrics while I was recording.',
    story: `Written in Apollo Bay, Victoria, inside a two-story Western Red Cedar home overlooking the ocean. Kleigh had just recovered from bronchitis when the song came together \u2014 starting as nothing more than piano and vocal. The cat famously shredded the handwritten lyrics mid-session, but the pages were pieced back together for the pilot vocal. When a friend heard the demo, he shouted that it was amazing. Recorded later in Tari for the album, the title track captures a moment in a truly beautiful place.`,
  },
];

export default function KleighPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] text-[#2C241B]">
      <Header />

      {/* HEADER HERO */}
      <section className="relative pt-20 pb-20 bg-gradient-to-br from-[#A0522D] to-[#8B4513] text-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FFFDF5]/10 backdrop-blur-md mb-6 border border-[#FFFDF5]/20">
            <Mic2 size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Kleigh</h1>
          <p className="text-xl font-serif italic opacity-80">The Legacy Collection</p>
        </div>
      </section>

      {/* TRACK LISTING */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-[#A0522D] mb-8 border-b border-[#A0522D]/20 pb-4">Essential Tracks</h2>

        <div className="space-y-4">
          {/* TRACK 1 */}
          <div className="group flex items-center justify-between p-6 bg-white rounded-lg shadow-sm border border-[#A0522D]/10 hover:shadow-md hover:border-[#A0522D]/40 transition cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#A0522D]/10 flex items-center justify-center text-[#A0522D] group-hover:bg-[#A0522D] group-hover:text-white transition">
                <Play size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-bold text-[#5D4037]">Bought Into Your Game</h3>
                <p className="text-xs font-serif text-[#A0522D]">Original Mix</p>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A0522D]/60">3:42</span>
          </div>
        </div>
      </section>

      {/* BEHIND THE MUSIC */}
      <section className="py-16 bg-[#2C241B] text-[#FFFDF5]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <BookOpen size={28} className="text-[#C8A882]" />
            <h2 className="text-2xl font-bold uppercase tracking-widest text-[#C8A882]">Behind the Music</h2>
          </div>
          <p className="text-[#FFFDF5]/60 text-sm mb-12 max-w-2xl">
            In Kleigh{"'"}{"s"} own words — the stories, struggles, and turning points behind the songs.
          </p>

          <div className="space-y-8">
            {TRACK_STORIES.map((item, i) => (
              <div
                key={i}
                className="border border-[#C8A882]/20 rounded-xl p-6 md:p-8 hover:border-[#C8A882]/40 transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/20">
                    {item.type}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#FFFDF5]">{item.title}</h3>
                </div>
                <blockquote className="text-[#C8A882] font-serif italic text-base md:text-lg mb-4 pl-4 border-l-2 border-[#C8A882]/30">
                  “{item.quote}”
                </blockquote>
                <p className="text-[#FFFDF5]/70 text-sm leading-relaxed">
                  {item.story}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <GlobalPlayer />
    </main>
  );
}
