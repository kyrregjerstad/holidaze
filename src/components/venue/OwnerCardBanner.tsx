'use client';

export const OwnerCardBanner = ({
  url,
  alt,
}: {
  url: string | null;
  alt: string | null;
}) => {
  return (
    <img
      src={url || '/holidaze-fallback-square.webp'}
      alt={alt || 'Holidaze owner banner'}
      width={48}
      height={48}
      className="absolute left-0 top-0 h-full w-full rounded-lg object-cover opacity-30"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = '/assets/holidaze-bg-3.webp';
      }}
    />
  );
};
