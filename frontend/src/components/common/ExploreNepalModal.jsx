import React, { useEffect, useState } from 'react';

// Reusable SafeImage component to handle broken URLs gracefully
const SafeImage = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  // Reliable high-quality fallback image of Nepal (Patan Durbar Square / Kathmandu context)
  const fallbackSrc = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200"; 
  
  return (
    <img 
      src={error ? fallbackSrc : src} 
      alt={alt} 
      className={className} 
      loading="lazy" 
      onError={() => setError(true)} 
    />
  );
};

export default function ExploreNepalModal({ isOpen, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 font-['Inter'] pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 z-0 pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full h-full md:rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xl flex flex-col transform transition-all duration-500 scale-100 opacity-100 z-10 pointer-events-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          
          {/* 1. Hero Section */}
          <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center">
            <div className="absolute inset-0 z-0">
               <SafeImage 
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg" 
                alt="Mount Everest" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-slate-900/90 dark:to-slate-900"></div>
            </div>
            <div className="relative z-10 px-6 max-w-4xl mx-auto mt-20">
              <span className="inline-block text-white/90 text-sm font-bold tracking-[0.4em] uppercase mb-4 drop-shadow-md">The Roof of the World</span>
              <h1 className="text-white text-7xl md:text-9xl font-black tracking-tighter drop-shadow-2xl mb-6">NEPAL</h1>
              <p className="text-white/90 text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
                A land of breathtaking Himalayan peaks, vibrant cultures, and ancient heritage.
              </p>
            </div>
          </section>

          <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-20 px-6 md:px-12 space-y-32">
            
            {/* 1.5 Nepal Overview Map */}
            <section className="max-w-7xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
                <div className="w-full h-[300px] md:h-[500px] relative bg-[#e5f3fb] dark:bg-slate-700">
                  <SafeImage 
                    src="https://upload.wikimedia.org/wikipedia/commons/a/af/Nepal_Topography.png" 
                    alt="Map of Nepal" 
                    className="w-full h-full object-contain p-4 md:p-8" 
                  />
                </div>
                <div className="p-8 md:p-12 text-center border-t border-slate-100 dark:border-slate-700">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Geographic Overview</span>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4">The Himalayan Nation</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
                    Nestled between India and China, Nepal's geography is dramatically diverse, rising from the subtropical plains of the Terai to the towering peaks of the Himalayas in the north.
                  </p>
                </div>
              </div>
            </section>
            
            {/* 2. Geography & Nature */}
            <section className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Geography & Nature</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Majestic Landscapes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Annapurna_Circuit_Landscape.jpg', title: 'The Himalayas', desc: 'Home to 8 of the 14 highest peaks in the world, including Mt. Everest.' },
                  { img: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Chitwan_National_Park_elephant.jpg', title: 'Lush Jungles', desc: 'Tropical national parks like Chitwan teeming with rhinos and tigers.' },
                  { img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Phewa_Lake%2C_Pokhara.jpg', title: 'Serene Valleys', desc: 'Tranquil lakes and rolling hills in places like Pokhara.' }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700/50 group flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                      <SafeImage src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                    </div>
                    <div className="p-8 flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2.5 Major Highlights */}
            <section className="max-w-7xl mx-auto space-y-12">
              <div className="text-center mb-8">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Key Attractions</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Discover Nepal</h2>
              </div>
              
              {/* Pashupatinath Temple (Featured/Premium) */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-yellow-500/30 flex flex-col md:flex-row relative group">
                <div className="absolute top-6 left-6 z-10 bg-yellow-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">Featured Heritage</div>
                <div className="w-full md:w-3/5 h-80 md:h-[450px] relative overflow-hidden">
                  <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Pashupatinath_Temple_-_Kathmandu.jpg" alt="Pashupatinath Temple" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 dark:text-white">Pashupatinath Temple</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    A UNESCO World Heritage site and one of the most sacred Hindu temples of Lord Shiva in the world. Located on the banks of the Bagmati River in Kathmandu, it is a masterpiece of Hindu architecture and a vibrant center of spiritual devotion.
                  </p>
                  <div className="mt-auto flex items-center text-yellow-600 dark:text-yellow-500 font-bold">
                    <span className="material-symbols-outlined mr-2">temple_hindu</span>
                    Sacred Pilgrimage Site
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lumbini */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700/50 group flex flex-col">
                  <div className="h-72 overflow-hidden relative">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Maya_Devi_Temple_in_Lumbini%2C_Nepal.jpg" alt="Lumbini" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Lumbini</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">Birthplace of Lord Buddha</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The sacred birthplace of Siddhartha Gautama (Lord Buddha) in 623 BC. This serene pilgrimage site is home to ancient monasteries, the Maya Devi Temple, and the peaceful Ashoka Pillar, radiating profound tranquility.
                    </p>
                  </div>
                </div>

                {/* Sauraha / Chitwan */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700/50 group flex flex-col">
                  <div className="h-72 overflow-hidden relative">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Indian_Rhinoceros_in_Chitwan_National_Park.jpg" alt="Sauraha Rhinoceros" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Sauraha</h3>
                    <p className="text-green-600 dark:text-green-400 font-bold text-xs uppercase tracking-widest mb-4">Chitwan Jungle Safari</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The vibrant tourism hub on the edge of Chitwan National Park. Famous for thrilling jungle safaris, it offers rare encounters with one-horned rhinoceroses, Bengal tigers, and majestic Asian elephants in their natural habitat.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Culture & Ethnicity */}
            <section className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="w-full lg:w-1/2 space-y-6">
                  <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm block">Culture & Ethnicity</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">A Tapestry of Traditions</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Nepal is a melting pot of over 125 distinct ethnic groups, speaking more than 120 languages. The harmony between Hinduism and Buddhism is evident in everyday life, festivals, and architecture.
                  </p>
                  <ul className="space-y-4 pt-4">
                     <li className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">festival</span>
                      </div>
                      <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">Vibrant Festivals (Dashain, Tihar, Holi)</span>
                    </li>
                    <li className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">styler</span>
                      </div>
                      <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">Traditional Attire (Daura Suruwal & Gunyou Cholo)</span>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/1/15/Kumari_of_Patan.jpg" alt="Nepalese Culture" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>

            {/* 4. National Symbols */}
            <section className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">National Identity</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Symbols of Nepal</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="bg-slate-100 dark:bg-slate-800/80 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700/50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Rhododendron_arboreum_in_bhutan.jpg" alt="Rhododendron" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Rhododendron</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">The national flower (Lali Gurans), painting the Himalayan hillsides red every spring.</p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/80 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700/50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 overflow-hidden p-4">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg" alt="Flag of Nepal" className="w-full h-full object-contain drop-shadow-md" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">The Flag</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">The only non-quadrilateral national flag in the world, symbolizing the Himalayan peaks and the enduring nation.</p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/80 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-700/50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-yellow-700">cruelty_free</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">The Cow</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">The national animal, deeply revered in Hinduism and symbolizing motherhood, wealth, and non-violence.</p>
                </div>

              </div>

              {/* Danfe Bird */}
              <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row group">
                 <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Himalayan_Monal_%28Lophophorus_impejanus%29.jpg" alt="Danfe Bird" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 </div>
                 <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">The Danfe (Himalayan Monal)</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">National Bird of Nepal</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      A bird of breathtaking beauty, the Danfe is renowned for its vibrant, multi-colored plumage that shimmers like a rainbow. Thriving in the high-altitude Himalayan forests, it is a profound symbol of Nepal's vibrant natural heritage and ecological diversity.
                    </p>
                 </div>
              </div>
            </section>

            {/* 5. Landmarks & Heritage */}
            <section className="max-w-7xl mx-auto">
               <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Heritage</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Ancient Landmarks</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-80 rounded-3xl overflow-hidden group shadow-lg">
                  <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/5/52/Boudhanath_Stupa-Kathmandu-Nepal.jpg" alt="Boudhanath Stupa" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-bold text-white mb-2">Boudhanath Stupa</h3>
                    <p className="text-white/80">One of the largest spherical stupas in Nepal, a massive mandala of peace and beauty.</p>
                  </div>
                </div>
                <div className="relative h-80 rounded-3xl overflow-hidden group shadow-lg">
                  <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Patan_Durbar_Square_2019.jpg" alt="Patan Durbar Square" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-bold text-white mb-2">Patan Durbar Square</h3>
                    <p className="text-white/80">A marvel of Newa architecture showcasing centuries-old temples, palaces, and courtyards.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Historical Figures & Royalty */}
            <section className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-2 block">Founders & Figures</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Historical Legacy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Prithvi Narayan Shah */}
                <div className="bg-slate-100 dark:bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-40 h-40 rounded-full overflow-hidden mb-8 border-4 border-white dark:border-slate-700 shadow-lg">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/e/ec/King_Prithvi_Narayan_Shah.jpg" alt="Prithvi Narayan Shah" className="w-full h-full object-cover object-top" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">King Prithvi Narayan Shah</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest mb-6">The Unifier of Nepal</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    The first King of unified Nepal, he ascended to the throne of the Gorkha Kingdom in 1743. Through strategic brilliance and relentless perseverance, he integrated numerous small principalities into a single, sovereign nation, laying the foundational borders of modern Nepal.
                  </p>
                  <blockquote className="relative p-6 mt-auto bg-white dark:bg-slate-900 rounded-2xl italic text-slate-700 dark:text-slate-300 shadow-inner border-l-4 border-blue-500 w-full text-left">
                    <span className="material-symbols-outlined absolute -top-4 -left-2 text-4xl text-blue-500/20 rotate-180">format_quote</span>
                    "Nepal is a garden of four castes and thirty-six sub-castes. Let everyone understand this."
                  </blockquote>
                </div>

                {/* Queen / Rani / Apsara */}
                <div className="bg-slate-100 dark:bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-40 h-40 rounded-full overflow-hidden mb-8 border-4 border-white dark:border-slate-700 shadow-lg">
                    <SafeImage src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Apsara_from_Patan.jpg" alt="Apsara carving" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Queens & Divine Apsaras</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-widest mb-6">Grace, Power, and Divinity</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Throughout Nepalese history, fierce queens (Ranis) have served as regents and commanders, while celestial nymphs (Apsaras) grace the intricate wood carvings of ancient temples. They symbolize the powerful blend of divine femininity, artistic heritage, and historical leadership in the Himalayas.
                  </p>
                  <blockquote className="relative p-6 mt-auto bg-white dark:bg-slate-900 rounded-2xl italic text-slate-700 dark:text-slate-300 shadow-inner border-l-4 border-purple-500 w-full text-left">
                    <span className="material-symbols-outlined absolute -top-4 -left-2 text-4xl text-purple-500/20 rotate-180">format_quote</span>
                    "The beauty of the heavens resides in the courage of the queens and the grace of the apsaras."
                  </blockquote>
                </div>

              </div>
            </section>

            {/* 7. Urban Sanctuary Location (Added per request) */}
            <section className="max-w-7xl mx-auto pb-12">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col items-stretch">
                  
                  {/* Top Side: Map */}
                  <div className="w-full min-h-[300px] md:min-h-[400px] relative border-b border-slate-200 dark:border-slate-700 pointer-events-auto z-20">
                    <iframe 
                      title="Urban Sanctuary Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625950005!2d85.28493297597554!3d27.708955944431904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  {/* Bottom Side: Content */}
                  <div className="w-full p-8 md:p-12 flex flex-col justify-center text-center items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 block">Our Home</span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-6">The Urban Sanctuary</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl">
                      Located in the vibrant heart of Kathmandu, our platform connects you with the finest sanctuaries the city has to offer. Experience the perfect blend of modern luxury and ancient Himalayan charm.
                    </p>
                    <ul className="space-y-5 text-left w-full max-w-lg">
                      <li className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">location_city</span>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">Central Kathmandu</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Prime locations across the valley</span>
                        </div>
                      </li>
                      <li className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white">Local Support</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">Dedicated assistance for all your needs</span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
