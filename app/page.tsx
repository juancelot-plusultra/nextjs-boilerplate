import Image from "next/image";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Why BearFit", href: "#why" },
  { label: "Pricing", href: "#pricing" },
  { label: "Facilities", href: "#facilities" },
  { label: "Contact", href: "#contact" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight">
              Bear<span className="text-[#f37120]">Fit</span>PH
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="rounded-full border border-[#f37120] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-orange-50"
            >
              Login
            </a>
            <a
              href="#contact"
              className="rounded-full bg-[#f37120] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Join Now
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative">
        <div className="relative h-[520px] w-full md:h-[580px]">
          <Image
            src="/hero.jpg"
            alt="BearFit PH"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f37120]/85 via-[#f37120]/55 to-black/25" />

          <div className="absolute inset-0">
            <div className="mx-auto flex h-full max-w-6xl items-center px-4">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                  Better Fitness Begins Here.
                  <br />
                  Better You Begins Now.
                </h1>

                <p className="mt-4 max-w-xl text-sm text-white/90 md:text-base">
                  Assessment-led training, expert coaching, and sustainable programs—
                  built for long-term progress.
                </p>

                {/* CTA buttons stack on mobile */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#contact"
                    className="rounded-full bg-[#f37120] px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
                  >
                    Start Your Journey
                  </a>
                  <a
                    href="#pricing"
                    className="rounded-full border border-white/80 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-white/10"
                  >
                    View Pricing
                  </a>
                </div>

                <p className="mt-5 text-xs text-white/85">
                  Book your FREE assessment today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold md:text-5xl">
            Why does <span className="text-[#f37120]">#BetterFitness</span> work?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
            We keep it simple: assess first, coach properly, and build a plan you can
            actually sustain.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card
            title="Science-Driven Training & Movement Assessment"
            icon="🧠"
            text={
              <>
                <strong>We don’t guess — we assess.</strong> Using the Functional
                Movement System (FMS), Omron smart scale body composition analysis, and
                a full fitness consultation, we build a clear starting point for your
                training journey.
              </>
            }
          />
          <Card
            title="Certified & Experienced Coaches"
            icon="💪"
            highlight
            text={
              <>
                Train with coaches who know the science and the grind. Our strength
                coaches are <strong>UP Diliman Sports Science</strong> grads, and our
                cardio coaches are experienced <strong>mixed martial artists</strong>.
                Form, progress, and safety—always the priority.
              </>
            }
          />
          <Card
            title="Personalized, Sustainable Programs"
            icon="📈"
            text={
              <>
                Your program is built around your goals, schedule, and assessment
                results. By-appointment-only sessions mean your time is respected. With{" "}
                <strong>one-on-one training</strong>, every rep and set is intentional.
              </>
            }
          />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-y bg-slate-50/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold md:text-5xl">Choose Your Plan</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
              Replace these with your real BearFit packages (24 Full, 24 Staggered, 48 Full).
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <PriceCard
              name="24 Sessions (Full)"
              price="₱____"
              sessions="24 Sessions"
              features={["Assessment-led plan", "1-on-1 coaching", "Progress tracking"]}
            />
            <PriceCard
              name="24 Sessions (Staggered)"
              price="₱____"
              sessions="24 Sessions"
              features={["Flexible payment", "Focused coaching", "Structured progress"]}
              popular
            />
            <PriceCard
              name="48 Sessions (Full)"
              price="₱____"
              sessions="48 Sessions"
              features={["Best value", "Long-term structure", "Maximum support"]}
            />
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section id="facilities" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold md:text-5xl">Our Facilities</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
            Upload your real gym photos into <strong>/public</strong>.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            "/facility1.jpg",
            "/facility2.jpg",
            "/facility3.jpg",
            "/facility4.jpg",
            "/facility5.jpg",
            "/facility6.jpg",
          ].map((src) => (
            <div
              key={src}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
            >
              <Image src={src} alt="Facility" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <section id="contact" className="bg-slate-900 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-white">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="text-xl font-extrabold">
                Bear<span className="text-[#f37120]">Fit</span> PH
              </div>
              <p className="mt-3 text-sm text-white/75">
                Better form. Better function. Better fitness.
              </p>
            </div>

            <div>
              <div className="text-sm font-semibold">Quick Links</div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a className="hover:text-white" href={item.href}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Contact</div>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>📍 Add your address</li>
                <li>📞 Add your phone</li>
                <li>✉️ Add your email</li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold">Follow</div>
              <div className="mt-3 flex gap-3 text-sm text-white/80">
                <a className="hover:text-white" href="https://www.facebook.com/BearFitPH">
                  Facebook
                </a>
                <span>•</span>
                <a className="hover:text-white" href="#">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60">
            © {new Date().getFullYear()} BearFit PH. All rights reserved.
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({
  title,
  icon,
  text,
  highlight,
}: {
  title: string;
  icon: string;
  text: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl bg-slate-50 p-8 text-center shadow-sm",
        highlight ? "ring-2 ring-[#f37120]" : "ring-1 ring-slate-200",
      ].join(" ")}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f37120]/10 text-2xl">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-extrabold text-slate-800">{title}</h3>
      <div className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-500">
        {text}
      </div>
    </div>
  );
}

function PriceCard({
  name,
  price,
  sessions,
  features,
  popular,
}: {
  name: string;
  price: string;
  sessions: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div
      className={[
        "relative rounded-2xl bg-white p-8 shadow-sm",
        popular ? "ring-2 ring-[#f37120]" : "ring-1 ring-slate-200",
      ].join(" ")}
    >
      {popular && (
        <div className="absolute right-6 top-6 rounded-full bg-[#f37120] px-3 py-1 text-xs font-bold text-white">
          POPULAR
        </div>
      )}

      <div className="text-center">
        <div className="text-lg font-extrabold">{name}</div>
        <div className="mt-4 text-4xl font-extrabold text-[#f37120]">{price}</div>
        <div className="mx-auto mt-4 w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
          {sessions} Included
        </div>
      </div>

      <ul className="mt-6 space-y-3 text-sm text-slate-600">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-[2px] text-[#f37120]">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="mt-8 block rounded-full bg-[#f37120] px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
      >
        Select Plan
      </a>
    </div>
  );
}
