interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className="my-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
        <img
          src={src}
          alt={alt}
          className="block h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-slate-500 font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
