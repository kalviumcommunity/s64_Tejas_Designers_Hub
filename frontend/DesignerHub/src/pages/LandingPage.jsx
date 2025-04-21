import React from 'react';
import './LandingPage.css'; // optional custom styles
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-yellow-100 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-purple-300 shadow-md">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900">DesignerHub</h1>
        <div className="flex space-x-4">
          <button><i className="fas fa-search text-xl"></i></button>
          <button><i className="fas fa-shopping-cart text-xl"></i></button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="text-center mt-8 px-4">
        <div className="rounded-3xl overflow-hidden shadow-lg max-w-4xl mx-auto">
          <img
            src="https://i.imgur.com/TaULLU6.png" // replace with your main banner image
            alt="Hero"
            className="w-full object-cover h-80"
          />
        </div>
        <h2 className="text-5xl font-bold mt-6">Welcome</h2>
        <button className="mt-4 bg-gray-800 text-white py-2 px-6 rounded-full hover:bg-gray-600">
          Explore
        </button>
      </section>
      {/* Categories */}
      <section className="flex justify-center gap-6 mt-20 px-10 flex-wrap">
        {/* Men */}
        <div className="text-center">
          <img
            // src = "https://i.imgur.com/2YbQXDU.jpeg"
            alt="Men"
            className="w-10 h-10 object-cover rounded-full shadow-md"
          />
          <button className="shop-button mt-3">Shop Now</button>
        </div>
        {/* Women */}
        <div className="text-center2">
          <img
            // src="https://i.imgur.com/SMXCKlT.jpeg"
            alt="Women"
            className="w-40 h-40 object-cover rounded-full shadow-md"
          />
          <button className="shop-button mt-3">Shop Now</button>
        </div>

        {/* Kids */}
        <div className="text-center3">
          <img
            // src="https://i.imgur.com/G8uQCMa.jpeg"
            alt="Kids"
            className="w-40 h-40 object-cover rounded-full shadow-md"
          />
          <button className="shop-button mt-3">Shop Now</button>
        </div>
      </section>
      {/* Footer Sections */}
      <footer className="mt-12 px-4 py-8 bg-purple-100 rounded-t-3xl">
        <div className="flex justify-around flex-wrap text-sm">
          <div className="info-section">💧 <strong>About DesignerHub:</strong><br /> A one-stop destination for fashion lovers!</div>
          <div className="info-section">🌟 <strong>What We Offer:</strong><br /> Trendy fashion for Men, Women, and Kids</div>
          <div className="info-section">📘 <strong>Why Choose Us?</strong><br /> Unique designs, top quality, and great deals</div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
