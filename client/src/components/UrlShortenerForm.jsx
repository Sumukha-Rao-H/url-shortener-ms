import React, { useState } from 'react';
import { Sparkles, LinkIcon, Pencil } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const UrlShortenerForm = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customAlias, setCustomAlias] = useState('');

  const handleShorten = () => {
    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
      setError('Please enter a valid URL starting with http:// or https://');
      setShortUrl('');
      return;
    }

    if (customMode && customAlias.trim() === '') {
      setError('Please enter a custom alias or disable custom mode.');
      setShortUrl('');
      return;
    }

    const hash = customMode ? customAlias.trim() : Math.random().toString(36).substring(2, 7);
    const short = `short.ly/${hash}`;
    setShortUrl(short);
    setError('');
  };

  return (
    <section className="bg-[#F3F3E0] min-h-[90vh] flex flex-col justify-center items-center px-6 mx-2 text-center relative overflow-hidden">
      {/* Optional Background Bubble */}
      <div className="absolute w-[600px] h-[600px] bg-[#CBDCEB] rounded-full opacity-30 -z-10 blur-3xl top-[-200px] right-[-200px]" />

      <div className="max-w-2xl space-y-6 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#133E87] flex items-center justify-center gap-2">
          <LinkIcon className="w-8 h-8 text-[#608BC1]" />
          Shorten Your Links in Seconds
        </h1>
        <p className="text-lg text-[#133E87]/80">
          Enter a long URL and instantly get a sleek, trackable short link you can share anywhere.
        </p>

        {/* Input Fields */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#608BC1] bg-white text-[#133E87]"
          />
          <button
            onClick={handleShorten}
            className="bg-[#133E87] text-white px-6 py-3 rounded-xl hover:bg-[#102f6e] transition"
          >
            Shorten
          </button>
        </div>

        {/* Custom Alias Toggle */}
        <button
          onClick={() => setCustomMode((prev) => !prev)}
          className="flex items-center gap-2 text-sm text-[#133E87] underline hover:text-[#102f6e] mt-2 transition"
        >
          <Pencil size={16} />
          {customMode ? 'Hide Custom URL Option' : 'Customize Short URL'}
        </button>

        {/* Custom Alias Field with Animation */}
        <AnimatePresence>
          {customMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-visible"
            >
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="Enter your custom short URL (e.g., my-link)"
                className="mt-4 px-4 py-3 rounded-xl border border-[#CBDCEB] focus:outline-none focus:ring-2 focus:ring-[#608BC1] bg-white text-[#133E87] w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error or Result */}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-[#133E87] bg-[#CBDCEB] px-4 py-2 rounded-lg font-mono mt-4 shadow-sm"
          >
            Short URL:{' '}
            <a
              href={`https://${shortUrl}`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortUrl}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UrlShortenerForm;
