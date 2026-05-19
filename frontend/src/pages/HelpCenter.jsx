import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoriesRef = useRef(null);
  const faqsRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { id: 1, icon: 'book_online', title: 'Booking Help', desc: 'Questions about making or managing a reservation.' },
    { id: 2, icon: 'payments', title: 'Payments & Billing', desc: 'Invoices, payment methods, and charges.' },
    { id: 3, icon: 'manage_accounts', title: 'Account & Login', desc: 'Password resets, profile updates, and access.' },
    { id: 4, icon: 'home_work', title: 'Room Management', desc: 'Guides for adding and updating property listings.' },
    { id: 5, icon: 'free_cancellation', title: 'Cancellations', desc: 'Refund policies and cancellation rules.' },
    { id: 6, icon: 'support_agent', title: 'Technical Support', desc: 'Bug reports and platform functionality.' }
  ];

  const faqs = [
    { id: 1, categoryId: 4, q: 'How do I list my property on The Urban Sanctuary?', a: 'To list a property, you must sign up as an Agent or Agency. Once logged in, navigate to your Dashboard and click "New Listing". Fill in the property details, upload photos, and hit Publish.' },
    { id: 2, categoryId: 5, q: 'When will I receive my refund for a cancelled booking?', a: 'Refunds are processed automatically if cancelled within the free cancellation window. It typically takes 3-5 business days for the funds to reflect in your account.' },
    { id: 3, categoryId: 3, q: 'Can I change my account email address?', a: 'Yes, you can update your email address from your Profile section inside the dashboard. A verification email will be sent to confirm the change.' },
    { id: 4, categoryId: 6, q: 'What is the standard response time for support tickets?', a: 'Our support team operates 24/7. Standard inquiries are typically answered within 2 hours, while technical escalations may take up to 24 hours.' },
    { id: 5, categoryId: 1, q: 'How do I modify my reservation dates?', a: 'To modify your booking dates, go to your Dashboard under "My Bookings", select the active booking, and choose "Modify Dates". Modifications are subject to availability.' },
    { id: 6, categoryId: 2, q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and secure online payment gateways like PayPal and local mobile wallets depending on your region.' },
    { id: 7, categoryId: 1, q: 'What happens if I arrive later than my check-in time?', a: 'If you expect to arrive late, please message the property agent directly through your booking details page to coordinate.' },
    { id: 8, categoryId: 3, q: 'I forgot my password, how can I reset it?', a: 'Click the "Forgot Password" link on the login page. We will send a secure password reset link to your registered email address.' }
  ];

  const distance = (a, b) => {
    if(a.length === 0) return b.length; 
    if(b.length === 0) return a.length; 
    var matrix = [];
    for(var i = 0; i <= b.length; i++){ matrix[i] = [i]; }
    for(var j = 0; j <= a.length; j++){ matrix[0][j] = j; }
    for(var i = 1; i <= b.length; i++){
      for(var j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const fuzzyMatch = (query, text) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    if (t.includes(q)) return true;
    
    let qIdx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === q[qIdx]) qIdx++;
      if (qIdx === q.length) return true;
    }

    const qWords = q.split(/\s+/).filter(w => w.length > 2);
    const tWords = t.split(/\s+/);
    for (let qw of qWords) {
      for (let tw of tWords) {
        if (tw.length > 2 && distance(qw, tw) <= 1) return true;
      }
    }
    return false;
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { categories: [], faqs: [] };
    const matchedCategories = categories.filter(c => fuzzyMatch(searchQuery, c.title) || fuzzyMatch(searchQuery, c.desc));
    const matchedFaqs = faqs.filter(f => fuzzyMatch(searchQuery, f.q) || fuzzyMatch(searchQuery, f.a));
    return { categories: matchedCategories, faqs: matchedFaqs };
  }, [searchQuery]);

  const handleResultClick = (type, item) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    
    if (type === 'category') {
      setSelectedCategory(item.id);
      categoriesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (type === 'faq') {
      setSelectedCategory('all');
      setOpenFaq(item.id);
      setTimeout(() => {
        const faqElement = document.getElementById(`faq-${item.id}`);
        if (faqElement) {
          const yOffset = -100; 
          const y = faqElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    }
  };

  const filteredFaqs = faqs.filter(faq => selectedCategory === 'all' || faq.categoryId === selectedCategory);

  const isSearching = searchQuery.trim().length > 0 && isSearchFocused;
  const hasResults = searchResults.categories.length > 0 || searchResults.faqs.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-['Inter'] flex flex-col transition-colors">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-[#0040A1] text-white px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">How can we help you today?</h1>
          <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Search for answers across our guides, FAQs, and policies, or reach out to our support team directly.
          </p>
          
          <div className="relative max-w-2xl mx-auto" ref={searchContainerRef}>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl z-10">search</span>
            <input 
              type="text" 
              placeholder="Search for articles, topics, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-400/50 text-lg shadow-xl relative z-20"
            />
            
            {/* Live Search Dropdown */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[100] max-h-[400px] overflow-y-auto text-left">
                {hasResults ? (
                  <div className="py-2">
                    {searchResults.categories.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</div>
                        {searchResults.categories.map(cat => (
                          <div 
                            key={`cat-${cat.id}`}
                            onClick={() => handleResultClick('category', cat)}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center gap-3 transition-colors"
                          >
                            <span className="material-symbols-outlined text-blue-500">{cat.icon}</span>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{cat.title}</div>
                              <div className="text-sm text-slate-500 line-clamp-1">{cat.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchResults.faqs.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">FAQs</div>
                        {searchResults.faqs.map(faq => (
                          <div 
                            key={`faq-${faq.id}`}
                            onClick={() => handleResultClick('faq', faq)}
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex gap-3 transition-colors"
                          >
                            <span className="material-symbols-outlined text-slate-400 mt-0.5">help_outline</span>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{faq.q}</div>
                              <div className="text-sm text-slate-500 line-clamp-1">{faq.a}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full space-y-24 relative z-0">
        
        {/* Categories Grid */}
        <section ref={categoriesRef}>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Browse by Category</h2>
            <p className="text-slate-500 dark:text-slate-400">Find specialized help for your specific needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(isActive ? 'all' : cat.id)}
                  className={`p-8 rounded-2xl shadow-sm border transition-all cursor-pointer group ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500 shadow-md ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto" ref={faqsRef}>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400">Quick answers to common questions</p>
          </div>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
              <div 
                key={faq.id} 
                id={`faq-${faq.id}`}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-lg pr-8 text-slate-900 dark:text-white">{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 text-slate-400 ${openFaq === faq.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === faq.id ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">search_off</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No FAQs found for this category</h3>
                <p className="text-slate-500 dark:text-slate-400">Try selecting a different category or searching.</p>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Contact & Links Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Support */}
          <div className="bg-blue-600 dark:bg-blue-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">support_agent</span>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 tracking-tight">Still need help?</h2>
              <p className="text-blue-100 mb-8 max-w-md">Our support team is always ready to assist you. Get in touch with us directly via email or phone.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 font-medium">Email Support</p>
                    <a href="mailto:support@theurbansanctuary.com" className="font-bold text-lg hover:underline">support@theurbansanctuary.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-200 font-medium">Phone Support (24/7)</p>
                    <a href="tel:+9779800000000" className="font-bold text-lg hover:underline">+977 9800000000</a>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-sm text-blue-200 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">schedule</span>
                Typical response time: Under 2 hours
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-center">
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">Legal & Quick Links</h2>
            <div className="space-y-3">
              {[
                { name: 'Privacy Policy', icon: 'privacy_tip', link: '/privacy-policy' },
                { name: 'Terms & Conditions', icon: 'gavel', link: '/terms-conditions' },
                { name: 'Contact Us Form', icon: 'contact_page', link: '/contact-us' }
              ].map((link, i) => (
                <Link key={i} to={link.link} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 group transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.icon}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.name}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
