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
    <section className="relative flex h-[300px] items-end overflow-hidden sm:h-[360px] md:h-[400px]">
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
        style={{ background: "linear-gradient(to top, rgba(15,42,87,0.88), rgba(15,42,87,0.35))" }}
      />
      <div className="relative z-10 mx-auto w-full max-w-content px-4 pb-10 sm:px-6">
        <p className="font-body text-sm tracking-[0.2em] text-white/80">{eyebrow}</p>
        <h1 className="mt-3 text-balance font-display text-3xl text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-white/80">{description}</p>}
      </div>
    </section>
  );
}
