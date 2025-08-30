import React, { useEffect, useRef, useState } from "react";
import { Leaf, Zap, Globe, ArrowRight, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Add this import

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const featuresRef = useRef(null);
  const navigate = useNavigate(); // <-- Add this line

  useEffect(() => {
    // Smooth fade-in animations
    const animate = (ref, delay = 200) => {
      if (ref.current) {
        ref.current.style.opacity = "0";
        ref.current.style.transform = "translateY(20px)";
        setTimeout(() => {
          ref.current.style.transition = "all 0.8s ease-out";
          ref.current.style.opacity = "1";
          ref.current.style.transform = "translateY(0)";
        }, delay);
      }
    };

    animate(logoRef, 100);
    animate(navRef, 200);
    animate(titleRef, 400);
    animate(subtitleRef, 600);
    animate(buttonsRef, 800);

    // Animate feature cards
    if (featuresRef.current) {
      Array.from(featuresRef.current.children).forEach((child, index) => {
        child.style.opacity = "0";
        child.style.transform = "translateY(40px)";
        setTimeout(() => {
          child.style.transition = "all 0.8s ease-out";
          child.style.opacity = "1";
          child.style.transform = "translateY(0)";
        }, 1000 + index * 200);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden relative">
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-green-300 rounded-full opacity-15 blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-emerald-400 rounded-full opacity-20 blur-2xl" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-green-200 rounded-full opacity-25 blur-2xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">GCX</h1>
              <p className="text-xs text-emerald-600 font-medium">
                Green Hydrogen
              </p>
            </div>
          </div>

          {/* Desktop nav */}
          <div ref={navRef} className="hidden md:flex items-center space-x-4">
            <button
              className="px-6 py-2 font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-xl shadow hover:bg-emerald-700"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="px-6 py-2 border border-emerald-400 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
              onClick={() => navigate("/guest")}
            >
              View as Guest
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-emerald-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur border-t shadow-xl mt-2 rounded-xl">
            <div className="flex flex-col p-4 space-y-2">
              <button
                className="px-4 py-2 text-emerald-700 font-semibold hover:bg-emerald-50 rounded-xl"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </button>
              <button
                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-xl shadow"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/register");
                }}
              >
                Register
              </button>
              <button
                className="px-4 py-2 border border-emerald-400 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/guest");
                }}
              >
                View as Guest
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <main className="relative z-10 px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
              Green Coin X
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600"
          >
            Join the renewable energy revolution with GreenCoinX — trade,
            invest, and contribute to a sustainable hydrogen economy with full
            transparency and trust.
          </p>

          <div
            ref={buttonsRef}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow hover:bg-emerald-700 flex items-center gap-2"
              onClick={() => navigate("/login")}
            >
              Let's get started <ArrowRight className="w-5 h-5" />
            </button>
            {/* <button
              className="px-8 py-4 border border-emerald-400 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button> */}
          </div>

          {/* Features */}
          <div
            ref={featuresRef}
            className="grid md:grid-cols-3 gap-8 mt-20 px-6"
          >
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-white" />}
              title="Clean Energy"
              desc="Harness the power of renewable hydrogen energy for a zero-emission future."
              gradient="from-emerald-500 to-green-600"
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-white" />}
              title="Global Impact"
              desc="Connect with a worldwide network of green energy pioneers and contribute to sustainability goals."
              gradient="from-green-500 to-emerald-600"
            />
            <FeatureCard
              icon={<Leaf className="w-8 h-8 text-white" />}
              title="Eco-Friendly"
              desc="Every transaction promotes carbon reduction and sustainable hydrogen production."
              gradient="from-emerald-600 to-green-500"
            />
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="relative z-10 px-6 py-16 bg-gradient-to-r from-emerald-600 to-green-700 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">
          Ready to Join the Green Revolution?
        </h3>
        <p className="text-emerald-100 mb-8">
          Be part of the sustainable energy transformation with GreenCoinX.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-2xl shadow hover:scale-105"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
          <button
            className="px-8 py-4 border border-white text-white font-bold rounded-2xl hover:bg-white hover:text-emerald-600"
            onClick={() => navigate("/explore")}
          >
            Explore Platform
          </button>
        </div>
        <p className="mt-8 text-sm text-emerald-200">
          © {new Date().getFullYear()} GreenCoinX | HackOut’25
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, gradient }) => (
  <div className="bg-white/70 backdrop-blur p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-emerald-100">
    <div
      className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default LandingPage;
