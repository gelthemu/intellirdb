"use client";

const IntelliURL = ({ isOpen = true }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full p-0 space-y-4">
      <div className="w-full h-full bg-beige/50 border border-dark/50">
        <iframe
          src="https://intelliurl.vercel.app/"
          className="w-full h-full border-none overflow-hidden"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

const TransAudio = ({ isOpen = true }: { isOpen: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full h-full p-0 space-y-4">
      <div className="w-full h-full bg-beige/50 border border-dark/50">
        <iframe
          src="https://transaudio.vercel.app/"
          className="w-full h-full border-none overflow-hidden"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export { IntelliURL, TransAudio };
