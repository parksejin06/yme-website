import Image from "next/image";

export default function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/main-bg.png",
  imageAlt = "",
  imagePosition = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
}) {
  // Editorial subpage hero: bottom-left anchored, serif title, brass eyebrow
  // over a hairline -- replaces the centered eyebrow/title/description stack.
  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ height: "var(--hero-height)" }}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,29,64,0.55) 0%, rgba(8,29,64,0.4) 45%, rgba(8,29,64,0.82) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-content px-[var(--page-gutter)] pb-12 sm:pb-16">
        <p className="flex items-center gap-4 font-body text-xs font-medium tracking-[0.28em] text-white/70 sm:text-sm">
          <span className="h-px w-8 bg-white/50 sm:w-12" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1
          className="mt-4 max-w-4xl text-balance font-display text-white"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3.75rem)", lineHeight: 1.15 }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-4 max-w-2xl text-balance text-white/80"
            style={{ fontSize: "clamp(1rem, 0.8vw + 0.75rem, 1.1875rem)", lineHeight: 1.65 }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
