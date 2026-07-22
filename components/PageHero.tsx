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
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
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
      {/* Brand-blue tinted overlay (RGB 15,42,87) for text legibility over the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,42,87,0.58) 0%, rgba(15,42,87,0.7) 55%, rgba(15,42,87,0.82) 100%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-content px-[var(--page-gutter)] text-center">
        <p className="font-body text-[15px] tracking-[0.22em] text-white/80 sm:text-base md:text-lg">
          {eyebrow}
        </p>
        <h1
          className="mx-auto mt-4 text-balance font-display text-white"
          style={{ fontSize: "clamp(2.25rem, 4vw, 4.5rem)", lineHeight: 1.15 }}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mx-auto mt-5 max-w-2xl text-balance text-white/85"
            style={{ fontSize: "clamp(1.0625rem, 1vw + 0.75rem, 1.375rem)", lineHeight: 1.6 }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
