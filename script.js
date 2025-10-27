document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyB7WY6uC1xuKGsK6Y14oMIfyFQQ7QZtQzA",
        authDomain: "finlo-f9b3f.firebaseapp.com",
        projectId: "finlo-f9b3f",
        storageBucket: "finlo-f9b3f.appspot.com",
        messagingSenderId: "3439410649",
        appId: "1:3439410649:web:9170914002001e39196dc8",
        measurementId: "G-L5973ZBK1R"
    };

    // --- Initialize Firebase ---
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();


    // --- State Management ---
    const state = {
        currentPage: 'home-page',
        previousPages: [], tripPreferences: null,
        itineraryData: null, isLoggedIn: false, 
        user: null,
        favorites: [],
    };

    // --- DOM Element References ---
    const pages = document.querySelectorAll('.page');
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const universalBackBtn = document.getElementById('universal-back-btn');
    const tripForm = document.getElementById('trip-form');
    const optionCards = document.querySelectorAll('.option-card');
    const shareItineraryBtn = document.getElementById('share-itinerary-btn');
    const toastNotification = document.getElementById('toast-notification');
    const authModal = document.getElementById('auth-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const mainLoginBtn = document.getElementById('login-btn');
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const googleSigninBtn = document.getElementById('google-signin-btn');
    const authError = document.getElementById('auth-error');
    const logoutBtn = document.getElementById('logout-btn');
    const loginText = document.getElementById('login-text');
    const profileFavicon = document.getElementById('profile-favicon');

    
    const bangalorePlaces = [
         { name: "Lalbagh Botanical Garden", description: "Historic garden with rare tropical plants.", image: "https://placehold.co/600x400/228B22/FFFFFF?text=Lalbagh", type: "image", category: "Nature" },
         { name: "Bangalore Palace", description: "Architectural marvel in Tudor-style.", image: "https://placehold.co/600x400/8B4513/FFFFFF?text=Bangalore+Palace", type: "image", category: "History" },
         { name: "Cubbon Park", description: "A vast green space in the city's heart.", video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/300/Big_Buck_Bunny_300_10s_1MB.mp4", type: "video", category: "Nature" },
         { name: "ISKCON Temple Bangalore", description: "A stunning blend of modern and traditional architecture.", image: "https://placehold.co/600x400/FFD700/000000?text=ISKCON", type: "image", category: "Spiritual" },
         { name: "Vidhana Soudha", description: "The seat of the state legislature of Karnataka.", image: "https://placehold.co/600x400/A9A9A9/000000?text=Vidhana+Soudha", type: "image", category: "History" },
         { name: "Visvesvaraya Museum", description: "Interactive science museum for all ages.", image: "https://placehold.co/600x400/00008B/FFFFFF?text=Museum", type: "image", category: "Museum" },
         { name: "Bannerghatta National Park", description: "Zoo, safari, and butterfly park.", video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/300/Big_Buck_Bunny_300_10s_1MB.mp4", type: "video", category: "Nature" },
         { name: "Tipu Sultan's Summer Palace", description: "An example of Indo-Islamic architecture.", image: "https://placehold.co/600x400/DAA520/000000?text=Tipu's+Palace", type: "image", category: "History" },
         { name: "Commercial Street", description: "Bustling shopping hub for clothes and more.", image: "https://placehold.co/600x400/FF69B4/FFFFFF?text=Shopping", type: "image", category: "Shopping" },
         { name: "Nandi Hills", description: "Ancient hill fortress, a popular sunrise spot.", image: "https://placehold.co/600x400/87CEEB/000000?text=Nandi+Hills", type: "image", category: "Nature" },
         { name: "UB City Mall", description: "Luxury shopping mall with high-end brands.", image: "https://placehold.co/600x400/000000/FFFFFF?text=UB+City", type: "image", category: "Shopping" },
         { name: "HAL Aerospace Museum", description: "India's first aerospace museum.", image: "https://placehold.co/600x400/708090/FFFFFF?text=HAL+Museum", type: "image", category: "Museum" },
         { name: "Wonderla Amusement Park", description: "A large amusement and water park.", video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/300/Big_Buck_Bunny_300_10s_1MB.mp4", type: "video", category: "Entertainment" },
         { name: "National Gallery of Modern Art", description: "Showcasing modern Indian art.", image: "https://placehold.co/600x400/D2B48C/000000?text=Art+Gallery", type: "image", category: "Museum" },
         { name: "St. Mary's Basilica", description: "The oldest church in Bangalore.", image: "https://placehold.co/600x400/B0C4DE/000000?text=Church", type: "image", category: "Spiritual" },
         { name: "Jawaharlal Nehru Planetarium", description: "Engaging shows about astronomy.", image: "https://placehold.co/600x400/191970/FFFFFF?text=Planetarium", type: "image", category: "Entertainment" },
         { name: "M.G. Road", description: "Busy road with shops and restaurants.", image: "https://placehold.co/600x400/32CD32/000000?text=MG+Road", type: "image", category: "Shopping" },
         { name: "Ulsoor Lake", description: "One of the biggest lakes in Bangalore, ideal for boating.", image: "https://placehold.co/600x400/4682B4/FFFFFF?text=Ulsoor+Lake", type: "image", category: "Nature" },
         { name: "Bull Temple", description: "Famous for its huge monolithic Nandi.", image: "https://placehold.co/600x400/FF4500/FFFFFF?text=Bull+Temple", type: "image", category: "Spiritual" },
         { name: "Innovative Film City", description: "Movie-themed park with various attractions.", image: "https://placehold.co/600x400/8A2BE2/FFFFFF?text=Film+City", type: "image", category: "Entertainment" },
         { name: "Art of Living Center", description: "A serene ashram and spiritual center.", image: "https://placehold.co/600x400/F5F5DC/000000?text=Art+of+Living", type: "image", category: "Spiritual" },
         { name: "Orion Mall", description: "A large mall with a lakeside promenade.", image: "https://placehold.co/600x400/4169E1/FFFFFF?text=Orion+Mall", type: "image", category: "Shopping" },
         { name: "Pyramid Valley", description: "Home to the world's largest meditational pyramid.", image: "https://placehold.co/600x400/E6E6FA/000000?text=Pyramid+Valley", type: "image", category: "Spiritual" },
         { name: "Sankey Tank", description: "A manmade lake with a park and jogging track.", image: "https://placehold.co/600x400/5F9EA0/FFFFFF?text=Sankey+Tank", type: "image", category: "Nature" },
         { name: "Snow City", description: "An indoor snow theme park.", image: "https://placehold.co/600x400/ADD8E6/000000?text=Snow+City", type: "image", category: "Entertainment" },
         { name: "Bangalore Fort", description: "Historic fort with a well-preserved Ganapathi temple.", image: "https://placehold.co/600x400/A0522D/FFFFFF?text=Bangalore+Fort", type: "image", category: "History" },
         { name: "Indiranagar", description: "Trendy neighborhood for breweries and cafes.", image: "https://placehold.co/600x400/6A5ACD/FFFFFF?text=Indiranagar", type: "image", category: "Food" },
         { name: "Koramangala", description: "Vibrant area with many restaurants.", image: "https://placehold.co/600x400/FF7F50/000000?text=Koramangala", type: "image", category: "Food" },
         { name: "Shivoham Shiva Temple", description: "Features a massive 65-foot tall statue of Lord Shiva.", image: "https://placehold.co/600x400/B0E0E6/000000?text=Shiva+Temple", type: "image", category: "Spiritual" },
         { name: "Thottikallu Falls", description: "Scenic waterfall, popular after monsoon.", image: "https://placehold.co/600x400/20B2AA/FFFFFF?text=TK+Falls", type: "image", category: "Nature" },
         { name: "Turahalli Forest", description: "Popular for cycling and rock climbing.", image: "https://placehold.co/600x400/006400/FFFFFF?text=Turahalli", type: "image", category: "Nature" },
         { name: "Venkatappa Art Gallery", description: "Displays a collection of paintings and sculptures.", image: "https://placehold.co/600x400/DEB887/000000?text=Venkatappa", type: "image", category: "Museum" },
         { name: "Gavi Gangadhareshwara Temple", description: "An ancient cave temple with unique architecture.", image: "https://placehold.co/600x400/BC8F8F/000000?text=Cave+Temple", type: "image", category: "Spiritual" },
         { name: "Lumbini Gardens", description: "A public park on Nagawara Lake with boating.", image: "https://placehold.co/600x400/98FB98/000000?text=Lumbini", type: "image", category: "Entertainment" },
         { name: "Phoenix Marketcity", description: "One of the largest malls in Bangalore.", image: "https://placehold.co/600x400/CD5C5C/FFFFFF?text=Phoenix+Mall", type: "image", category: "Shopping" },
         { name: "Chunchi Falls", description: "Picturesque waterfall a few hours from Bangalore.", image: "https://placehold.co/600x400/7B68EE/FFFFFF?text=Chunchi+Falls", type: "image", category: "Nature" },
         { name: "Devanahalli Fort", description: "The birthplace of Tipu Sultan, a historic fort.", image: "https://placehold.co/600x400/C0C0C0/000000?text=Devanahalli", type: "image", category: "History" },
         { name: "Forum Mall", description: "A popular mall with a cinema and shops.", image: "https://placehold.co/600x400/800000/FFFFFF?text=Forum+Mall", type: "image", category: "Shopping" },
         { name: "Hesaraghatta Lake", description: "A large man-made freshwater lake.", image: "https://placehold.co/600x400/00FFFF/000000?text=Hesaraghatta", type: "image", category: "Nature" },
         { name: "Karnataka Chitrakala Parishath", description: "An art complex for visual arts.", image: "https://placehold.co/600x400/FF00FF/FFFFFF?text=Chitrakala", type: "image", category: "Museum" },
         { name: "KR Market", description: "A vibrant and chaotic wholesale market.", image: "https://placehold.co/600x400/808000/FFFFFF?text=KR+Market", type: "image", category: "Shopping" },
         { name: "Madiwala Lake", description: "A large lake that attracts many migratory birds.", image: "https://placehold.co/600x400/008080/FFFFFF?text=Madiwala", type: "image", category: "Nature" },
         { name: "Mekedatu", description: "A scenic gorge where the Kaveri river flows.", image: "https://placehold.co/600x400/E9967A/000000?text=Mekedatu", type: "image", category: "Nature" },
         { name: "Muthyala Maduvu (Pearl Valley)", description: "A waterfall and a popular picnic spot.", image: "https://placehold.co/600x400/F0E68C/000000?text=Pearl+Valley", type: "image", category: "Nature" },
         { name: "Ramanagara", description: "Famous for its rocky hills, Sholay shooting location.", image: "https://placehold.co/600x400/D2691E/FFFFFF?text=Ramanagara", type: "image", category: "Entertainment" },
         { name: "Savanadurga", description: "Considered one of the largest monolith hills in Asia.", image: "https://placehold.co/600x400/6B8E23/FFFFFF?text=Savanadurga", type: "image", category: "Nature" },
         { name: "Brigade Road", description: "A major commercial centre and shopping street.", image: "https://placehold.co/600x400/483D8B/FFFFFF?text=Brigade+Road", type: "image", category: "Shopping" },
         { name: "Jakkur Aerodrome", description: "An airport for general aviation and flight training.", image: "https://placehold.co/600x400/87CEFA/000000?text=Aerodrome", type: "image", category: "Entertainment" },
         { name: "Mantri Square Mall", description: "A large shopping mall with a metro station connection.", image: "https://placehold.co/600x400/B22222/FFFFFF?text=Mantri+Mall", type: "image", category: "Shopping" },
         { name: "The Heritage Centre & Aerospace Museum", description: "Showcases the history of Indian aviation.", image: "https://placehold.co/600x400/556B2F/FFFFFF?text=Aerospace", type: "image", category: "Museum" },
         { name: "VV Puram Food Street", description: "A famous street food paradise.", video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/300/Big_Buck_Bunny_300_10s_1MB.mp4", type: "video", category: "Food" },
    ];


    // --- Core Functions ---
    const navigateTo = (pageId) => {
        if (state.currentPage === pageId && pageId !== 'home-page') return;
        if (pageId !== state.currentPage) {
            state.previousPages.push(state.currentPage);
        }
        state.currentPage = pageId;
        updateUI();
        window.scrollTo(0, 0);
    };

    const goBack = () => {
        if (state.previousPages.length > 0) {
            state.currentPage = state.previousPages.pop();
            updateUI();
        }
    };

    const updateUI = () => {
        pages.forEach(page => page.classList.toggle('active', page.id === state.currentPage));
        bottomNavItems.forEach(item => item.classList.toggle('active', item.dataset.page === state.currentPage));
        universalBackBtn.style.display = (state.previousPages.length > 0 && state.currentPage !== 'home-page') ? 'flex' : 'none';
        if (state.currentPage === 'favorites-page') renderFavorites();
    };

    const showToast = (message) => {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => toastNotification.classList.remove('show'), 2500);
    };
    
    const handleShare = () => {
        if (!state.itineraryData) return;
        let shareText = `Check out my trip to ${state.tripPreferences.destination}!\n\nSummary: ${state.itineraryData.summary}\n\n`;
        state.itineraryData.itinerary.forEach(item => {
            if(item.activity) {
               shareText += `${item.time}: ${item.activity} (Cost: ${item.cost})\n`;
            }
        });
        navigator.clipboard.writeText(shareText).then(() => showToast('Itinerary copied to clipboard!'));
    };
    
    const toggleFavorite = (placeName) => {
        const index = state.favorites.indexOf(placeName);
        if (index > -1) {
            state.favorites.splice(index, 1);
            showToast(`${placeName} removed from favorites.`);
        } else {
            state.favorites.push(placeName);
            showToast(`${placeName} added to favorites!`);
        }
        localStorage.setItem('finloFavorites', JSON.stringify(state.favorites));
        
        if (state.currentPage === 'explore-page') {
             document.getElementById('search-places').dispatchEvent(new Event('input'));
        } else if (state.currentPage === 'favorites-page') {
            renderFavorites();
        }
    };

    const renderFavorites = () => {
        const favoritesGrid = document.getElementById('favorites-grid');
        const favoritedPlaces = bangalorePlaces.filter(p => state.favorites.includes(p.name));
        if (favoritedPlaces.length === 0) {
            favoritesGrid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><h3>Nothing here yet!</h3><p>Tap the heart icon on places in the Explore tab to save them here.</p></div>`;
        } else {
            renderPlaces(favoritedPlaces, favoritesGrid);
        }
    };

    const setupExploreFilters = () => {
        const filterContainer = document.getElementById('explore-filter-container');
        if(!filterContainer) return;
        const categories = ['All', ...new Set(bangalorePlaces.map(p => p.category))];
        filterContainer.innerHTML = categories.map(cat => `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`).join('');
        
        filterContainer.addEventListener('click', e => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                document.getElementById('search-places').dispatchEvent(new Event('input'));
            }
        });
    };

    const renderPlaces = (places, gridElement) => {
        if(!gridElement) return;
        gridElement.innerHTML = '';
        if (places.length === 0 && gridElement.id === 'places-grid') {
             gridElement.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><h3>No places found.</h3><p>Try a different filter or search term.</p></div>`;
             return;
        }

        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            const isFavorited = state.favorites.includes(place.name);
            let mediaHtml = (place.type === 'video') ? `<video src="${place.video}" muted loop playsinline></video>` : `<img src="${place.image}" alt="${place.name}" loading="lazy">`;

            card.innerHTML = `
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-place-name="${place.name}">
                    <svg width="24" height="24" viewBox="0 0 24" fill="none" stroke="#FFFFFF" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <div class="place-media">${mediaHtml}</div>
                <div class="place-info"><h3>${place.name}</h3><p>${place.description}</p></div>
            `;
            gridElement.appendChild(card).querySelector('.favorite-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(place.name);
            });
        });
    };
    
    document.getElementById('search-places')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const activeCategory = document.querySelector('#explore-filter-container .filter-btn.active').dataset.category;
        let filtered = (activeCategory !== 'All') ? bangalorePlaces.filter(p => p.category === activeCategory) : bangalorePlaces;
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
        }
        renderPlaces(filtered, document.getElementById('places-grid'));
    });

    // --- Itinerary Display & Generation ---
    const generateItinerary = async (prefs) => {
        const loadingIndicator = document.getElementById('loading-indicator');
        const resultsContainer = document.getElementById('results-container');
        const errorCard = document.getElementById('itinerary-error-card');
        
        loadingIndicator.style.display = 'block';
        resultsContainer.style.display = 'none';
        errorCard.style.display = 'none';

        const apiKey = "AIzaSyCtHxfEF7KAqJ4FQ7S9VNWepQzltdXs6hM"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const systemPrompt = `You are an expert travel planner for Bengaluru, India. Create a detailed, realistic one-day travel itinerary. 
        **CRITICAL REQUIREMENT: If the travel mode is 'public transport', the 'description' for 'transport' type itinerary items MUST include specific and plausible Bengaluru BMTC bus numbers (e.g., 'Take Bus 500D', 'Bus 335E') or Namma Metro details (e.g., 'Board the Purple Line towards Challaghatta'). Generic instructions like 'take a bus' are unacceptable.**
        If the start location is given as latitude and longitude coordinates, use that as the real starting point and find the nearest transport hubs.
        Ensure the locations are logical in sequence. 
        Respond ONLY with a valid JSON object matching the specified schema. Do not include markdown formatting or any text outside the JSON object.`;
        
        const userQuery = `
            Generate a one-day itinerary for me in ${prefs.destination}.
            My preferences are:
            - Start Location: ${prefs.startLocation}
            - Budget: ${prefs.budget}
            - Passengers: ${prefs.passengers}
            - Travel Mode: ${prefs.travelMode}
            - Food Preference: ${prefs.foodPref}

            The JSON response must follow this exact schema:
            {
              "summary": "A brief, engaging summary of the trip.",
              "itinerary": [
                {
                  "type": "transport" or "activity",
                  "time": "HH:MM AM/PM" (for 'activity' type only),
                  "description": "For 'transport', describe the route and mode (e.g., 'Take BMTC Bus 500D from Koramangala to Marathahalli'). For 'activity', describe the place.",
                  "activity": "Name of the place/activity" (for 'activity' type only),
                  "cost": "Estimated cost in INR (e.g., '₹100' or 'Free')",
                  "latitude": latitude_float (for 'activity' type only),
                  "longitude": longitude_float (for 'activity' type only)
                }
              ],
              "totalCost": "Overall estimated cost for the day in INR (e.g., '₹1500')"
            }
        `;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                 throw new Error("Received an empty response from the AI.");
            }
            
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanedText);

            state.itineraryData = data;
            displayItineraryResults(data, prefs);

        } catch (error) {
            console.error("Error generating itinerary:", error);
            errorCard.style.display = 'block';
            document.getElementById('itinerary-error-text').textContent = `Failed to generate itinerary. ${error.message}. Please try again.`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    const displayItineraryResults = (data, prefs) => {
        const resultsContainer = document.getElementById('results-container');
        const weatherCard = document.getElementById('weather-card');
        
        document.getElementById('itinerary-title').textContent = `Your Trip to ${prefs.destination}`;
        document.getElementById('trip-summary').textContent = data.summary;
        
        // For now, weather is static as we don't have a live API
        weatherCard.style.display = 'flex';
        document.getElementById('weather-description').textContent = 'Partly Cloudy';
        document.getElementById('weather-temp').textContent = '28°C';
        
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';
        let allLatLngs = [];

        if (data.itinerary && Array.isArray(data.itinerary) && data.itinerary.length > 0) {
            data.itinerary.forEach(item => {
                if (item.type === 'transport') {
                    const transportEl = document.createElement('div');
                    transportEl.className = 'transport-details';
                    transportEl.innerHTML = `
                        <svg style="width:24px; height:24px; flex-shrink: 0;" viewBox="0 0 24 24"><path fill="currentColor" d="M18.92 6C18.42 5.42 17.73 5.09 17 5H15V4a2 2 0 0 0-2-2H8c-1.11 0-2 .89-2 2v1H5c-.73 0-1.42.33-1.92.9L2 7v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V7l-1.08-1M8 4h6v1H8V4m9.5 7.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-9 0C7.67 11.5 7 10.83 7 10s.67-1.5 1.5-1.5S10 9.17 10 10s-.67 1.5-1.5 1.5m0-4.5H17v2H8.5V7z"/></svg>
                        <span>${item.description}</span>`;
                    timeline.appendChild(transportEl);
                } else {
                    const costStr = String(item.cost || 'Free');
                    const itemEl = document.createElement('div');
                    itemEl.className = 'timeline-item card';
                    itemEl.innerHTML = `
                        <p><strong>${item.time}</strong></p>
                        <h3>${item.activity}</h3>
                        <p>${item.description}</p>
                        <p>Cost: <strong>${costStr}</strong></p>
                    `;
                    timeline.appendChild(itemEl);

                    if (item.latitude && item.longitude) {
                        allLatLngs.push([item.latitude, item.longitude]);
                    }
                }
            });
            document.getElementById('total-expenditure').textContent = data.totalCost || 'N/A';
            setTimeout(() => setupMap(allLatLngs), 100);
        }
        resultsContainer.style.display = 'block';
    };

    let map = null;
    const setupMap = (allLatLngs) => {
        if (map) map.remove();
        const mapElement = document.getElementById('map');
        if (!allLatLngs.length) {
            mapElement.innerHTML = '<p>Map data not available.</p>';
            return;
        }
        map = L.map('map').setView(allLatLngs[0], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#a855f7;' class='marker-pin'></div><i class='material-icons'></i>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        
        allLatLngs.forEach(coords => L.marker(coords).addTo(map));
        if (allLatLngs.length > 1) {
            L.polyline(allLatLngs, {color: 'rgba(168, 85, 247, 0.8)', weight: 3}).addTo(map);
            map.fitBounds(allLatLngs, {padding: [50, 50]});
        }
    };
    
    const prepareCabBookingPage = () => {
        const timelineEl = document.getElementById('cab-timeline');
        const costEl = document.getElementById('cab-cost-breakdown');
        
        // Mock data for cab itinerary and cost
        const cabItinerary = [
            { time: "9:00 AM", activity: "Pickup & drive to Lalbagh" },
            { time: "1:00 PM", activity: "Lunch at a local favorite" },
            { time: "2:30 PM", activity: "Explore Bangalore Palace" },
            { time: "5:00 PM", activity: "Snacks & Drop-off" }
        ];

        timelineEl.innerHTML = cabItinerary.map(item => `
            <div class="timeline-item card">
                <p><strong>${item.time}</strong></p>
                <h3>${item.activity}</h3>
            </div>
        `).join('');

        const baseFare = 2500;
        const foodAllowance = 800;
        const total = baseFare + foodAllowance;

        costEl.innerHTML = `
            <div class="cost-breakdown-row">
                <span>Base Fare (8hr/80km)</span>
                <span>₹${baseFare.toFixed(2)}</span>
            </div>
            <div class="cost-breakdown-row">
                <span>Food & Snacks Allowance</span>
                <span>₹${foodAllowance.toFixed(2)}</span>
            </div>
            <div class="cost-breakdown-row total">
                <span>Total Estimate</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
        `;
    };


    // --- Event Listeners ---
    document.getElementById('home-plan-trip-btn')?.addEventListener('click', () => navigateTo('plan-trip-page'));
    document.getElementById('home-explore-btn')?.addEventListener('click', () => navigateTo('explore-page'));
    document.getElementById('header-explore-btn')?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('explore-page'); });
    
    universalBackBtn.addEventListener('click', goBack);
    tripForm.addEventListener('submit', (e) => {
         e.preventDefault();
        state.tripPreferences = {
            startLocation: tripForm.querySelector('#start-location').value,
            destination: tripForm.querySelector('#destination').value,
            budget: tripForm.querySelector('#budget').value,
            passengers: tripForm.querySelector('#passengers').value,
            travelMode: tripForm.querySelector('#travel-mode').value,
            foodPref: tripForm.querySelector('#food-pref').value
        };
        navigateTo('options-page');
    });
    
    optionCards.forEach(card => card.addEventListener('click', () => {
        const planType = card.dataset.plan;
        state.tripPreferences.plan = planType;

        if (planType === 'premium') {
            prepareCabBookingPage();
            navigateTo('book-cab-page');
        } else {
            navigateTo('itinerary-page');
            generateItinerary(state.tripPreferences);
        }
    }));

    document.getElementById('pay-for-cab-btn')?.addEventListener('click', () => {
        showToast('Redirecting to payment gateway...');
    });

    bottomNavItems.forEach(item => item.addEventListener('click', (e) => {
        e.preventDefault();
        if(item.dataset.page) navigateTo(item.dataset.page);
    }));
    shareItineraryBtn.addEventListener('click', handleShare);
    document.getElementById('edit-itinerary-btn').addEventListener('click', () => {
        showToast('Editing feature coming soon!');
    });
    document.getElementById('start-trip-btn').addEventListener('click', () => {
        showToast('Expense tracker coming soon!');
    });

    // --- Auth Modal Listeners ---
    const openAuthModal = () => authModal.classList.add('show');
    const closeAuthModal = () => authModal.classList.remove('show');

    mainLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.isLoggedIn) {
            navigateTo('profile-page');
        } else {
            openAuthModal();
        }
    });
    closeModalBtn.addEventListener('click', closeAuthModal);

    showSignupBtn.addEventListener('click', () => {
        loginView.style.display = 'none';
        signupView.style.display = 'block';
    });

    showLoginBtn.addEventListener('click', () => {
        signupView.style.display = 'none';
        loginView.style.display = 'block';
    });

    // --- Firebase Auth Listeners ---
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Signed up:', userCredential.user);
                closeAuthModal();
            })
            .catch(error => {
                authError.textContent = error.message;
                authError.style.display = 'block';
            });
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Logged in:', userCredential.user);
                closeAuthModal();
            })
            .catch(error => {
                authError.textContent = error.message;
                authError.style.display = 'block';
            });
    });
    
    googleSigninBtn.addEventListener('click', () => {
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                console.log('Google Sign-In successful', result.user);
                closeAuthModal();
            }).catch((error) => {
                authError.textContent = error.message;
                authError.style.display = 'block';
            });
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            showToast("You've been logged out.");
            navigateTo('home-page');
        });
    });


    // --- Auth State Change Observer ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            state.isLoggedIn = true;
            state.user = user;
            loginText.textContent = user.displayName || user.email.split('@')[0];
            profileFavicon.style.display = 'inline-block';
            if(user.photoURL) {
                profileFavicon.src = user.photoURL;
            }
            
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-name').textContent = user.displayName || user.email.split('@')[0];
            if(user.photoURL) {
                document.getElementById('profile-avatar').src = user.photoURL;
            }

            // Fetch favorites from Firestore
            db.collection('users').doc(user.uid).get().then(doc => {
                if (doc.exists && doc.data().favorites) {
                    state.favorites = doc.data().favorites;
                } else {
                    state.favorites = [];
                }
                renderPlaces(bangalorePlaces, document.getElementById('places-grid')); // Re-render to show correct favorite status
            });

        } else {
            // User is signed out.
            state.isLoggedIn = false;
            state.user = null;
            state.favorites = JSON.parse(localStorage.getItem('finloFavorites')) || [];
            loginText.textContent = 'Login';
            profileFavicon.style.display = 'none';
            renderPlaces(bangalorePlaces, document.getElementById('places-grid')); // Re-render to clear favorite status
        }
    });


    // --- Initial Load ---
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => splashScreen.classList.add('hidden'), 1500);
    
    setupExploreFilters();
    renderPlaces(bangalorePlaces, document.getElementById('places-grid'));
    updateUI();
    
});
