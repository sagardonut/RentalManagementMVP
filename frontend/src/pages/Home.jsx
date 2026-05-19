import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RoomCard from '../components/common/RoomCard';

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/rooms?limit=6&page=1')
      .then(res => res.json())
      .then(data => setFeaturedRooms(data.rooms || []))
      .catch(console.error);
  }, []);
  return (
    <>
      <Navbar />
      <main className="bg-surface dark:bg-slate-900 transition-colors">
        {/* Hero Section */}
        <section className="relative h-[870px] flex items-center justify-center pt-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA32CODe65MBP83F3-6LcGx4FgQijmjbC7hifZTIZ3hqJU4_kdjrwrxCFACDbeA2T_qqrEz-Eh_1O92BgMekz2cHroFlSmVFAmnZWMnE2Gpd46lVx8Y-MVo3IlzBDob-70KE5sNR9XIHcoMyKNjbzGm7r9A95Gbc5u6ADuxzzRI8sbADRdoP91ANRyjCxPATXIPYAIHlnI7Lq-D6Gl9zsUqp-1YHr8BfRrt_QB1YkzRMwBoXKY-7q1z2Ez5n9-12t4DODOJByIu5AMA"
              alt="Kathmandu city skyline at dusk"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-on-surface/40 dark:from-slate-900/40 via-transparent to-surface dark:to-slate-900 transition-colors"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-4">
            <span className="inline-block text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-4">Redefining Himalayan Living</span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Find your sanctuary in the <br /> <span className="text-blue-200">heart of Kathmandu.</span>
            </h1>
          </div>
        </section>

        {/* Available Rooms Section */}
        <section className="py-24 px-6 md:px-12 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-on-surface dark:text-slate-100 transition-colors">Available Sanctuaries</h2>
              <p className="text-on-surface dark:text-slate-400 max-w-md">Curated listings featuring modern amenities and traditional Kathmandu charm.</p>
            </div>
            <Link to="/rooms" className="flex items-center text-primary dark:text-blue-400 font-bold group transition-colors">
              View All Listings
              <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredRooms.map((room) => (
              <RoomCard
                key={room._id}
                id={room._id}
                title={room.title}
                price={`NPR ${room.pricePerMonth.toLocaleString()}`}
                location={room.location}
                verified={room.isVerified}
                amenities={room.amenities}
                image={room.images[0]}
              />
            ))}
          </div>
        </section>

        {/* Neighborhood Spotlight */}
        <section className="py-24 bg-surface dark:bg-slate-800 overflow-hidden">
          <div className="max-w-screen-xl mx-auto px-6 md:px-12">
            <div className="mb-16 text-center">
              <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary dark:text-blue-400 mb-2 transition-colors">Explore the City</h2>
              <h3 className="text-4xl font-extrabold tracking-tighter text-on-surface dark:text-slate-100 transition-colors">Neighborhood Spotlight</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[700px]">
              {/* Jhamsikhel */}
              <Link to="/rooms?location=Jhamsikhel" className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZTKjW9Jq4aFTMWM0yRHHXWg8EjbYwEFGdKCTSGe-Cy71N1ckyVzHEgIBzucWwY4yYQ-oreHrd4xrmwl1ImQpbjsK3QNgWyuZhdYUP4nhXADPoS3la-GtNLKCqjj3P7sLm8PW6C-xjB1ovsYt7GuIK186FncgTL0uVELAce7GlSrWkiRQW5cQwppSPCu3jUzkT1BqKGHz8SwYAdeCYP_CCMz6AIEJPK852YrB2qa78y6tPplkjAJS40xfHuANX1rrRy6HnNG0D226O" alt="Jhamsikhel area" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h4 className="text-white text-3xl font-black mb-2">Jhamsikhel</h4>
                  <p className="text-white/80 text-sm max-w-xs">Kathmandu's premium hub for dining, culture, and upscale living.</p>
                  <button className="mt-4 px-6 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-full text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Explore Area</button>
                </div>
              </Link>

              {/* Baneshwor */}
              <Link to="/rooms?location=Baneshwor" className="md:col-span-2 relative rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCre85Hg0z15Z7a3lfS3WNiL2xFM33KcSjnJpghCef-zFl4u7Off2Jp2t3Q8kVB4e6D19SqZq_gY7roolu_AXnNkSecUG1Xje27hPcTfFCBaHEXggyVgstu3_QqztlQQluatnjcWbGvfvAHJLl0MaiFw89l6vzfaPRg4DRUePGfItCDe8NpfMJ4TJhm6pYPHoI2Wf4f2vpif6bHXsqOP6CmXmgAayDikCLDmuXTl6UTX4TJAf6SOwcva2qH-mmO4SHPslDyllulJvN9" alt="Baneshwor" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white text-2xl font-black mb-1">Baneshwor</h4>
                  <p className="text-white/80 text-sm">The central heartbeat of commercial and residental activity.</p>
                </div>
              </Link>

              {/* Baluwatar */}
              <Link to="/rooms?location=Baluwatar" className="relative rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI_SirVhdIhuoDAyApiHI0eQgbJDczL14guIqxiEP-NWa8J8wTpwNNJ-Ryi_XOD9zyQ6xstVqoMkVIXT5EGjkKrjOrJnaKfOoAEKwHKY1j8-7-r6uUo8VxzvpUtlbw7Jiy6IItoCbZRmILF1GiE6C-2dG_Z2o2XR6_jh_qTUiaF50LLyrCUApZ7HQ8EHKUCVHO2ExDNTqOArLScDht8N_6CHwOb4tRX0YbFiw3UBzBg7SD3zqLvrweoD5Cu5wkGYCZ0yg3VkuXJmVg" alt="Baluwatar" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white text-xl font-black">Baluwatar</h4>
                </div>
              </Link>

              {/* Lazimpat */}
              <Link to="/rooms?location=Lazimpat" className="relative rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsBYvL3B3ZlW9Lg_jyOIeeNJs1VLtQy56Ej8_hkhnf0eZBYYm1mKK8MqZaCm5mHIZ1r2bc6cdbvMoB0sYdAdn8lFFxcCV9jVmUtiUYnvkcR58V-QdBBqsjvja8NDUbiIFjO-lzPzvyuKd87g0BGD8lsJQ_q4SwEQ_Xw1Wj0HrzGJZ6Uchhr5FQHFQary9LkzwPSyxXSx1EIJktOJdbsJ6-66oKNL33D-je37yYxXLcmu-U7QCoEHZ2DMJoMd3Joy3aIifKNgjcH3pX" alt="Lazimpat" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h4 className="text-white text-xl font-black">Lazimpat</h4>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
