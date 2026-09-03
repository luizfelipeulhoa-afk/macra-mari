import Reveal from "./Reveal";

/* Bainha de tecido: a borda arrematada que costura o ateliê ao rodapé —
   zigue-zague de fios e franjinhas que se soltam no scroll. */
export default function HemDivider() {
  const fringes = Array.from({ length: 48 });

  return (
    <div className="relative overflow-hidden border-y-2 border-ink bg-ink">
      <Reveal>
        <svg
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
          className="block h-20 w-full sm:h-24"
          aria-hidden="true"
        >
          {/* costura em zigue-zague, dois fios entrelaçados */}
          <path
            d="M0 30 L40 54 L80 30 L120 54 L160 30 L200 54 L240 30 L280 54 L320 30 L360 54 L400 30 L440 54 L480 30 L520 54 L560 30 L600 54 L640 30 L680 54 L720 30 L760 54 L800 30 L840 54 L880 30 L920 54 L960 30 L1000 54 L1040 30 L1080 54 L1120 30 L1160 54 L1200 30 L1240 54 L1280 30 L1320 54 L1360 30 L1400 54 L1440 30"
            fill="none"
            stroke="var(--color-clay)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 54 L40 30 L80 54 L120 30 L160 54 L200 30 L240 54 L280 30 L320 54 L360 30 L400 54 L440 30 L480 54 L520 30 L560 54 L600 30 L640 54 L680 30 L720 54 L760 30 L800 54 L840 30 L880 54 L920 30 L960 54 L1000 30 L1040 54 L1080 30 L1120 54 L1160 30 L1200 54 L1240 30 L1280 54 L1320 30 L1360 54 L1400 30 L1440 54"
            fill="none"
            stroke="var(--color-ocre)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* carreira de pontos corridos */}
          <line
            x1="0"
            y1="74"
            x2="1440"
            y2="74"
            stroke="var(--color-cream)"
            strokeWidth="2"
            strokeDasharray="3 10"
            opacity="0.55"
          />
          {/* franjas que se soltam da bainha */}
          {fringes.map((_, i) => (
            <line
              key={i}
              className="hem-line"
              style={{ transitionDelay: `${(i % 12) * 40}ms` }}
              x1={15 + i * 30}
              y1="74"
              x2={15 + i * 30 + (i % 3 === 0 ? 4 : -3)}
              y2={i % 4 === 0 ? 96 : 88}
              stroke={i % 3 === 0 ? "var(--color-clay)" : i % 3 === 1 ? "var(--color-cream)" : "var(--color-ocre)"}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </Reveal>
    </div>
  );
}
