'use client';

import Script from 'next/script';

export const Umami = () => {
  return (
    <Script
      defer
      src="https://analytics.putnov.ru/script.js"
      data-website-id="ad2b2d3e-b6bd-48c6-a6c8-7e68301260c1"
      id="umami"
    ></Script>
  );
};
