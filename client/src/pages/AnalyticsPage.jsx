import React from 'react';

const HomePage = () => {
  return (
    <div>
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-semibold">Page 1 - Analytiks</h1>
      </section>
      <section className="h-screen flex items-center justify-center bg-[#CBDCEB]">
        <h1 className="text-4xl font-semibold text-[#133E87]">Page 2 - Pricing</h1>
      </section>
      <section className="h-screen flex items-center justify-center bg-[#608BC1] text-white">
        <h1 className="text-4xl font-semibold">Page 3 - About</h1>
      </section>
    </div>
  );
};

export default HomePage;
