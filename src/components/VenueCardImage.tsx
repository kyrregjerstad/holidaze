'use client';

export const VenueCardImage = ({
  url,
  name,
  description,
}: {
  url: string | undefined;
  name: string;
  description: string;
}) => {
  return (
    <img
      alt={`Holidaze featured Home: ${name} - ${description}`}
      className="aspect-square size-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      height="200"
      src={url || '/holidaze-fallback-square.webp'}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/holidaze-fallback-square.webp';
      }}
      style={{
        aspectRatio: '300/200',
        objectFit: 'cover',
      }}
      width="300"
    />
  );
};
