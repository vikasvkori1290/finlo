// FIREBASE IMPORTS
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyB7WY6uC1xuKGsK6Y14oMIfyFQQ7QZtQzA",
    authDomain: "finlo-f9b3f.firebaseapp.com",
    projectId: "finlo-f9b3f",
    storageBucket: "finlo-f9b3f.appspot.com",
    messagingSenderId: "3439410649",
    appId: "1:3439410649:web:9170914002001e39196dc8",
    measurementId: "G-L5973ZBK1R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// GEMINI API CONFIGURATION - PRODUCTION READY
const GEMINI_API_KEY = 'AIzaSyC1AKzEoeflu-mL2lhC3JhCKMKNf1QZ7ME';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// Auth State
let currentUser = null;

// Data
const bangalorePlaces = [
    // Historical & Palaces
    {
        name: "Bangalore Palace",
        reviews: [
            { user: "Priya S.", rating: 4.5, comment: "Beautiful Tudor architecture! Worth the visit.", date: "2025-10-15" },
            { user: "Rahul M.", rating: 5, comment: "Must visit! The royal artifacts are amazing.", date: "2025-10-10" },
            { user: "Anjali K.", rating: 4, comment: "Great place for history lovers.", date: "2025-10-05" }
        ],
        avgRating: 4.5,
        totalReviews: 127,
        description: "Tudor-style palace with beautiful architecture and royal artifacts",
        category: "History",
        image: "palace.jpg",
        latitude: 12.9987,
        longitude: 77.5921,
        openingHours: "10:00 AM - 5:30 PM",
        entryFee: "₹230"
    },
    {
    name: "Ambajidurga",
    description: "Hill fort near Chikballapur, popular for trekking and views",
    category: "Adventure", // Can also be History/Nature
    image: "ambajidurga.png", // Placeholder image
    latitude: 13.5135, // Approximate latitude
    longitude: 77.6720, // Approximate longitude
    openingHours: "Sunrise to Sunset (approx)", // Typical for trekking
    entryFee: "Free (Check for forest dept. fees)" // Usually free, but good to check
},
{
    name: "Kaiwara",
    description: "Pilgrimage site known for temples, ashram, and association with Mahabharata",
    category: "Spiritual", // Can also be Nature due to Kaiwara Betta
    image: "gavi.png", // Placeholder image
    latitude: 13.3625, // Approximate latitude for Kaiwara town
    longitude: 78.0250, // Approximate longitude for Kaiwara town
    openingHours: "Temple timings vary (e.g., 6 AM - 12 PM, 5 PM - 8 PM)", // Example temple hours
    entryFee: "Free" // Usually free for temple visits
},
    {
        name: "Tipu Sultan's Summer Palace",
        reviews: [
            { user: "Harish N.", rating: 4, comment: "Beautiful Indo-Islamic architecture with rich history.", date: "2025-10-13" },
            { user: "Swati D.", rating: 4.5, comment: "Well-preserved palace. Audio guide is helpful.", date: "2025-10-08" },
            { user: "Kiran R.", rating: 4.2, comment: "Peaceful place to learn about Tipu Sultan's legacy.", date: "2025-10-03" }
        ],
        avgRating: 4.2,
        totalReviews: 134,
        description: "Beautiful teakwood palace with Indo-Islamic architecture",
        category: "History",
        image: "tipu.png",
        latitude: 12.9591,
        longitude: 77.5744,
        openingHours: "8:30 AM - 5:30 PM",
        entryFee: "₹25"
    },
    {
        name: "Bangalore Fort",
        reviews: [
            { user: "Ravi K.", rating: 3.5, comment: "Historic place but needs better maintenance.", date: "2025-10-12" },
            { user: "Shreya P.", rating: 4, comment: "Good for history enthusiasts. Quick visit.", date: "2025-10-07" },
            { user: "Mahesh D.", rating: 3.8, comment: "Interesting heritage site in the city center.", date: "2025-10-01" }
        ],
        avgRating: 3.8,
        totalReviews: 95,
        description: "16th-century fort built by Kempegowda",
        category: "History",
        image: "fort.jpeg",
        latitude: 12.9591,
        longitude: 77.5744,
        openingHours: "9:00 AM - 6:00 PM",
        entryFee: "Free"
    },

    // Parks & Gardens
    {
        name: "Lalbagh Botanical Garden",
        reviews: [
            { user: "Vikram R.", rating: 5, comment: "Perfect for morning walks! So peaceful.", date: "2025-10-12" },
            { user: "Sneha P.", rating: 4.5, comment: "Beautiful gardens and the Glass House is stunning.", date: "2025-10-08" },
            { user: "Amit K.", rating: 4, comment: "Great place for nature photography.", date: "2025-10-03" }
        ],
        avgRating: 4.5,
        totalReviews: 245,
        description: "240-acre garden with over 1000 plant species and Glass House",
        category: "Nature",
        image: "botanical.png",
        latitude: 12.9507,
        longitude: 77.5848,
        openingHours: "6:00 AM - 7:00 PM",
        entryFee: "₹50"
    },
    {
        name: "Cubbon Park",
        reviews: [
            { user: "Deepak N.", rating: 4.5, comment: "Perfect spot for jogging and relaxation!", date: "2025-10-11" },
            { user: "Pooja M.", rating: 5, comment: "Love the greenery in the heart of the city.", date: "2025-10-07" },
            { user: "Suresh K.", rating: 4, comment: "Great place for family outings.", date: "2025-10-02" }
        ],
        avgRating: 4.5,
        totalReviews: 189,
        description: "300-acre green lung in city center with museums and library",
        category: "Nature",
        image: "Cubbon.jpg",
        latitude: 12.9762,
        longitude: 77.5929,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "Free"
    },
    {
        name: "Bannerghatta National Park",
        description: "Wildlife sanctuary with zoo, safari, and butterfly park",
        category: "Nature",
        image: "nationalpark.jpg",
        latitude: 12.7980,
        longitude: 77.5838,
        openingHours: "9:00 AM - 5:00 PM",
        entryFee: "₹80"
    },
    {
        name: "JP Park (Jayaprakash Narayan Biodiversity Park)",
        description: "85-acre park with lakes and diverse flora",
        category: "Nature",
        image: "jp.jpg",
        latitude: 13.0270,
        longitude: 77.5550,
        openingHours: "5:30 AM - 8:30 PM",
        entryFee: "Free"
    },

    // Temples & Religious Sites
    {
        name: "ISKCON Temple",
        reviews: [
            { user: "Meera D.", rating: 5, comment: "Divine experience! The evening aarti is beautiful.", date: "2025-10-14" },
            { user: "Karthik S.", rating: 4.8, comment: "Peaceful atmosphere and great prasadam.", date: "2025-10-09" },
            { user: "Lakshmi V.", rating: 5, comment: "The architecture is magnificent!", date: "2025-10-06" }
        ],
        avgRating: 4.9,
        totalReviews: 312,
        description: "Magnificent Krishna temple with blend of modern and traditional architecture",
        category: "Spiritual",
        image: "image.png",
        latitude: 13.0093,
        longitude: 77.5552,
        openingHours: "7:15 AM - 1:00 PM, 4:00 PM - 8:30 PM",
        entryFee: "Free"
    },
    {
        name: "Bull Temple (Dodda Basavana Gudi)",
        description: "16th-century temple with massive Nandi monolith",
        category: "Spiritual",
        image: "bull.jpg",
        latitude: 12.9425,
        longitude: 77.5647,
        openingHours: "6:00 AM - 8:00 PM",
        entryFee: "Free"
    },
    {
        name: "Shivoham Shiva Temple",
        description: "Modern temple dedicated to Lord Shiva",
        category: "Spiritual",
        image: "shiva.jpg",
        latitude: 12.9094,
        longitude: 77.6034,
        openingHours: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
        entryFee: "Free"
    },
    {
        name: "Gavi Gangadhareshwara Temple",
        description: "16th-century cave temple known as Dakshina Kashi",
        category: "Spiritual",
        image: "gavi.avif",
        latitude: 12.9490,
        longitude: 77.5380,
        openingHours: "6:00 AM - 12:00 PM, 5:00 PM - 8:00 PM",
        entryFee: "Free"
    },
    {
        name: "St. Mary's Basilica",
        description: "Gothic-style basilica built in 1882",
        category: "Spiritual",
        image: "st.webp",
        latitude: 12.9814,
        longitude: 77.5993,
        openingHours: "6:00 AM - 7:00 PM",
        entryFee: "Free"
    },

    // Government Buildings & Landmarks
    {
        name: "Vidhana Soudha",
        reviews: [
            { user: "Prasad M.", rating: 4.5, comment: "Magnificent architecture! Best viewed at night when lit up.", date: "2025-10-15" },
            { user: "Ananya B.", rating: 4.3, comment: "Icon of Bangalore. Great for photography.", date: "2025-10-10" },
            { user: "Vinay S.", rating: 4, comment: "Impressive building. Can only view from outside.", date: "2025-10-05" }
        ],
        avgRating: 4.3,
        totalReviews: 156,
        description: "Seat of state legislature with Neo-Dravidian architecture",
        category: "History",
        image: "vidhana.avif",
        latitude: 12.9796,
        longitude: 77.5908,
        openingHours: "External viewing only",
        entryFee: "Free"
    },
    {
        name: "Attara Kacheri (High Court)",
        description: "Red building housing Karnataka High Court",
        category: "History",
        image: "attara.jpg",
        latitude: 12.9791,
        longitude: 77.5912,
        openingHours: "10:00 AM - 5:00 PM",
        entryFee: "Free"
    },

    // Shopping & Entertainment
    {
        name: "UB City Mall",
        reviews: [
            { user: "Natasha K.", rating: 4.5, comment: "Premium shopping experience with luxury brands.", date: "2025-10-14" },
            { user: "Varun S.", rating: 4, comment: "Great restaurants and ambiance.", date: "2025-10-09" },
            { user: "Ishita G.", rating: 4.7, comment: "Beautiful architecture and high-end shopping.", date: "2025-10-03" }
        ],
        avgRating: 4.4,
        totalReviews: 278,
        description: "Luxury shopping and dining destination",
        category: "Shopping",
        image: "ub.jpg",
        latitude: 12.9716,
        longitude: 77.5946,
        openingHours: "10:00 AM - 10:00 PM",
        entryFee: "Free"
    },
    {
        name: "Commercial Street",
        description: "Popular shopping street for clothes and accessories",
        category: "Shopping",
        image: "street.jpg",
        latitude: 12.9833,
        longitude: 77.6089,
        openingHours: "10:00 AM - 9:00 PM",
        entryFee: "Free"
    },
    {
        name: "Phoenix Marketcity",
        description: "World-class shopping mall with entertainment",
        category: "Shopping",
        image: "pheonix.jpg",
        latitude: 12.9952,
        longitude: 77.6969,
        openingHours: "10:00 AM - 10:00 PM",
        entryFee: "Free"
    },
    {
        name: "Brigade Road",
        description: "Trendy shopping and entertainment street",
        category: "Shopping",
        image: "brigade.jpg",
        latitude: 12.9719,
        longitude: 77.6041,
        openingHours: "10:00 AM - 9:00 PM",
        entryFee: "Free"
    },
    {
        name: "KR Market (City Market)",
        description: "Vibrant wholesale market for flowers, fruits, and vegetables",
        category: "Shopping",
        image: "kr.jpg",
        latitude: 12.9591,
        longitude: 77.5744,
        openingHours: "6:00 AM - 8:00 PM",
        entryFee: "Free"
    },
    {
        name: "Orion Mall",
        description: "Popular shopping and entertainment mall",
        category: "Shopping",
        image: "kr.jpg",
        latitude: 13.0102,
        longitude: 77.5526,
        openingHours: "10:00 AM - 10:00 PM",
        entryFee: "Free"
    },

    // Museums & Cultural Centers
    {
        name: "Government Museum",
        description: "Museum with archaeological and geological artifacts since 1865",
        category: "History",
        image: "museam.jpg",
        latitude: 12.9766,
        longitude: 77.5993,
        openingHours: "10:00 AM - 5:00 PM (Closed Mondays)",
        entryFee: "₹20"
    },
    {
        name: "Visvesvaraya Industrial Museum",
        description: "Interactive science and technology museum",
        category: "Education",
        image: "visves.jpg",
        latitude: 12.9766,
        longitude: 77.5993,
        openingHours: "10:00 AM - 5:30 PM",
        entryFee: "₹60"
    },
    {
        name: "Jawaharlal Nehru Planetarium",
        description: "Planetarium with astronomy shows and exhibits",
        category: "Education",
        image: "jawaharlal.jpg",
        latitude: 12.9766,
        longitude: 77.5993,
        openingHours: "10:30 AM - 5:30 PM",
        entryFee: "₹60"
    },
    {
        name: "HAL Aerospace Museum",
        description: "Aviation museum showcasing aircraft and aerospace history",
        category: "Education",
        image: "aircraft.jpg",
        latitude: 12.9577,
        longitude: 77.6647,
        openingHours: "9:00 AM - 5:00 PM (Closed Mondays)",
        entryFee: "₹60"
    },
    {
        name: "National Gallery of Modern Art",
        description: "Art gallery with modern and contemporary Indian art",
        category: "Art",
        image: "galary.jpg",
        latitude: 12.9766,
        longitude: 77.5993,
        openingHours: "10:00 AM - 5:00 PM (Closed Mondays)",
        entryFee: "₹20"
    },

    // Lakes & Water Bodies
    {
        name: "Ulsoor Lake",
        description: "Picturesque lake perfect for boating",
        category: "Nature",
        image: "ulsoor.jpg",
        latitude: 12.9810,
        longitude: 77.6210,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "Free"
    },
    {
        name: "Sankey Tank",
        description: "Peaceful lake with walking paths",
        category: "Nature",
        image: "sankey.jpg",
        latitude: 12.9920,
        longitude: 77.5650,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "Free"
    },
    {
        name: "Hebbal Lake",
        description: "Urban lake with birdwatching opportunities",
        category: "Nature",
        image: "hebbal.jpg",
        latitude: 13.0358,
        longitude: 77.5970,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "Free"
    },
    {
        name: "Lumbini Gardens",
        description: "Garden park by Nagavara Lake with boating",
        category: "Nature",
        image: "lumbini.jpg",
        latitude: 13.0430,
        longitude: 77.6110,
        openingHours: "9:00 AM - 8:00 PM",
        entryFee: "₹30"
    },

    // Adventure & Outdoor
    {
        name: "Wonderla Amusement Park",
        reviews: [
            { user: "Rohan P.", rating: 5, comment: "Best amusement park! So many thrilling rides.", date: "2025-10-13" },
            { user: "Divya S.", rating: 4.5, comment: "Great fun for the whole family. Water rides are amazing!", date: "2025-10-08" },
            { user: "Aditya R.", rating: 4.8, comment: "Worth every penny! Will visit again.", date: "2025-10-04" }
        ],
        avgRating: 4.8,
        totalReviews: 456,
        description: "Large amusement park with water rides and roller coasters",
        category: "Adventure",
        image: "wonderla.jpg",
        latitude: 12.8351,
        longitude: 77.3928,
        openingHours: "11:00 AM - 6:00 PM",
        entryFee: "₹999"
    },
    {
        name: "Innovative Film City",
        description: "Entertainment complex with theme parks and studios",
        category: "Adventure",
        image: "filoom.jpg",
        latitude: 12.7492,
        longitude: 77.4968,
        openingHours: "10:00 AM - 6:30 PM",
        entryFee: "₹799"
    },
    {
        name: "Nandi Hills",
        reviews: [
            { user: "Kriti J.", rating: 5, comment: "Sunrise view is breathtaking! Must visit early morning.", date: "2025-10-10" },
            { user: "Arjun B.", rating: 4.7, comment: "Perfect weekend getaway. Great for trekking.", date: "2025-10-05" },
            { user: "Neha T.", rating: 4.5, comment: "Beautiful views but gets crowded on weekends.", date: "2025-09-30" }
        ],
        avgRating: 4.7,
        totalReviews: 567,
        description: "Hill station perfect for sunrise and trekking (60km from city)",
        category: "Adventure",
        image: "nandi.jpg",
        latitude: 13.3703,
        longitude: 77.6837,
        openingHours: "6:00 AM - 10:00 PM",
        entryFee: "₹30"
    },
    {
        name: "Ramanagara",
        description: "Rock climbing and bouldering destination (Sholay filming location)",
        category: "Adventure",
        image: "ramanagaram.jpg",
        latitude: 12.7172,
        longitude: 77.2805,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "Free"
    },

    // Food Streets & Areas
    {
        name: "VV Puram Food Street",
        reviews: [
            { user: "Sanjay L.", rating: 5, comment: "Food heaven! Try the dosa and chaats.", date: "2025-10-16" },
            { user: "Kavya R.", rating: 4.8, comment: "Amazing South Indian street food at affordable prices.", date: "2025-10-11" },
            { user: "Rakesh M.", rating: 4.5, comment: "A must-visit for foodies! So many options.", date: "2025-10-06" }
        ],
        avgRating: 4.8,
        totalReviews: 342,
        description: "Famous street food hub with South Indian delicacies",
        category: "Food",
        image: "vvpuram.png",
        latitude: 12.9397,
        longitude: 77.5756,
        openingHours: "5:00 PM - 11:00 PM",
        entryFee: "Free"
    },
    {
        name: "Thindi Beedi (CTR Street)",
        description: "Popular food street in Malleshwaram",
        category: "Food",
        image: "thindi.jpg",
        latitude: 13.0030,
        longitude: 77.5700,
        openingHours: "7:00 AM - 11:00 PM",
        entryFee: "Free"
    },
    {
        name: "Church Street",
        description: "Trendy cafes, restaurants and bars",
        category: "Food",
        image: "street.webp",
        latitude: 12.9746,
        longitude: 77.6035,
        openingHours: "10:00 AM - 11:00 PM",
        entryFee: "Free"
    },

    // Heritage & Cultural
    {
        name: "Mayo Hall",
        description: "British-era building with Kempegowda Museum",
        category: "History",
        image: "mayo.png",
        latitude: 12.9791,
        longitude: 77.5912,
        openingHours: "10:00 AM - 5:00 PM",
        entryFee: "Free"
    },
    {
        name: "Kempegowda Tower (Lalbagh)",
        description: "16th-century watchtower built by city founder",
        category: "History",
        image: "lalbaug.jpg",
        latitude: 12.9507,
        longitude: 77.5848,
        openingHours: "6:00 AM - 7:00 PM",
        entryFee: "Included in Lalbagh"
    },
    {
        name: "Rangoli Metro Art Center",
        description: "Cultural hub for art, music, and theater",
        category: "Art",
        image: "metro.png",
        latitude: 12.9716,
        longitude: 77.5946,
        openingHours: "10:00 AM - 7:00 PM",
        entryFee: "Varies"
    },

    // Tech & Modern
    {
        name: "Bangalore Turf Club",
        description: "Horse racing venue with colonial charm",
        category: "Entertainment",
        image: "turf.png",
        latitude: 12.9716,
        longitude: 77.5946,
        openingHours: "Race days only",
        entryFee: "₹100"
    },
    {
        name: "Snow City",
        description: "Indoor snow theme park",
        category: "Adventure",
        image: "snow.jpg",
        latitude: 12.9716,
        longitude: 77.6410,
        openingHours: "11:00 AM - 8:00 PM",
        entryFee: "₹599"
    },
    {
        name: "Muthyalamaduvu (Pearl Valley)",
        description: "Waterfall and trekking spot 40km from city",
        category: "Nature",
        image: "mutthu.jpg",
        latitude: 13.1850,
        longitude: 77.5630,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "₹20"
    },
    {
        name: "Chunchi Falls",
        description: "Scenic waterfall 90km from Bangalore",
        category: "Nature",
        image: "chunchi.png",
        latitude: 12.4380,
        longitude: 77.0820,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "₹10"
    },
    {
        name: "Dodda Alada Mara (Big Banyan Tree)",
        description: "400-year-old giant banyan tree",
        category: "Nature",
        image: "alada.jpg",
        latitude: 12.8820,
        longitude: 77.4350,
        openingHours: "8:00 AM - 6:00 PM",
        entryFee: "₹10"
    },
    {
        name: "Savandurga",
        description: "One of Asia's largest monolith hills for trekking",
        category: "Adventure",
        image: "savandurga.png",
        latitude: 12.9190,
        longitude: 77.2940,
        openingHours: "6:00 AM - 6:00 PM",
        entryFee: "₹20"
    },
    {
        name: "Anthargange",
        description: "Rocky hills with caves and trekking trails",
        category: "Adventure",
        image: "antargange.jpg",
        latitude: 13.6840,
        longitude: 77.7920,
        openingHours: "24 hours",
        entryFee: "₹30"
    },
    {
        name: "Devanahalli Fort",
        description: "16th-century fort near airport",
        category: "History",
        image: "devafort.jpg",
        latitude: 13.2444,
        longitude: 77.7122,
        openingHours: "9:00 AM - 6:00 PM",
        entryFee: "Free"
    },
    {
        name: "Mekedatu",
        description: "Gorge where river Kaveri narrows (Goat's Leap)",
        category: "Nature",
        image: "mekedatu.jpg",
        latitude: 12.3540,
        longitude: 77.4480,
        openingHours: "7:00 AM - 5:00 PM",
        entryFee: "₹20"
    },
    {
        name: "Bheemeshwari",
        description: "Adventure and fishing camp by River Cauvery",
        category: "Adventure",
        image: "bheemeshwari.png",
        latitude: 12.5820,
        longitude: 77.1430,
        openingHours: "7:00 AM - 7:00 PM",
        entryFee: "₹500"
    }
];

const themes = [
    {
        name: "History Tour",
        icon: "🏛️",
        description: "Explore ancient palaces, forts, and museums",
        preferences: "focus on historical sites, museums, palaces"
    },
    {
        name: "Nature Escape",
        icon: "🌳",
        description: "Parks, gardens, and natural wonders",
        preferences: "focus on parks, gardens, nature spots"
    },
    {
        name: "Foodie Trail",
        icon: "🍜",
        description: "Discover local cuisine and street food",
        preferences: "focus on food streets, restaurants, local eateries"
    },
    {
        name: "Spiritual Journey",
        icon: "🕉️",
        description: "Visit temples, churches, and meditation centers",
        preferences: "focus on temples, spiritual centers, religious sites"
    },
    {
        name: "Shopping Spree",
        icon: "🛍️",
        description: "Malls, markets, and shopping districts",
        preferences: "focus on shopping malls, markets, commercial streets"
    },
    {
        name: "Adventure Trek",
        icon: "⛰️",
        description: "Hiking, climbing, and outdoor activities",
        preferences: "focus on hills, trekking spots, adventure activities"
    }
];

const mockReviews = [
    { author: "Priya S.", rating: 4.5, comment: "Beautiful place, well maintained!" },
    { author: "Rahul M.", rating: 5.0, comment: "Must visit! Amazing experience." },
    { author: "Anjali K.", rating: 4.0, comment: "Great for families, a bit crowded on weekends." },
    { author: "Vikram R.", rating: 4.8, comment: "Loved the architecture and ambiance." }
];

// Avatar Options - 12 avatars for more variety
const avatarOptions = [
    { id: 'avatar1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: 'avatar2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    { id: 'avatar3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
    { id: 'avatar4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' },
    { id: 'avatar5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
    { id: 'avatar6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia' },
    { id: 'avatar7', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver' },
    { id: 'avatar8', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie' },
    { id: 'avatar9', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
    { id: 'avatar10', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
    { id: 'avatar11', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
    { id: 'avatar12', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria' }
];

// State Management
let currentTheme = 'dark';
let budgetChartInstance = null;

let state = {
    favorites: [],
    currentItinerary: null,
    savedTrips: [],
    currentSection: 'home',
    currentPlace: null,
    galleryIndex: 0,
    userLocation: null,
    tripProgress: {
        completed: [],
        expenses: {},
        budget: 0
    },
    editingItinerary: null,
    selectedAvatar: 'avatar1',
    advancedFilters: {
        price: 'all',
        distance: 50,
        category: 'all'
    }
};

// Chat Functions


window.sendChatMessage = async function() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';

    // Scroll to bottom
    scrollChatToBottom();

    // Show typing indicator
    addTypingIndicator();

    try {
        // Get response from Gemini
        const response = await getChatbotResponse(message);

        // Remove typing indicator
        removeTypingIndicator();

        // Add bot response
        addChatMessage(response, 'bot');

        // Scroll to bottom
        scrollChatToBottom();

    } catch (error) {
        console.error('Chat error:', error);
        removeTypingIndicator();
        addChatMessage("I apologize, but I'm having trouble right now. However, you can explore our 50+ Bangalore places in the Explore section or use the Plan Your Trip feature! 😊", 'bot');
    }
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    chatMessages.appendChild(typingDiv);
    scrollChatToBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollChatToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.getElementById('chatToggle');
    const isVisible = chatWindow.style.display !== 'none';
    chatWindow.style.display = isVisible ? 'none' : 'flex';
    chatToggle.style.display = isVisible ? 'flex' : 'none';

    if (!isVisible) {
        // Focus input when opening
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 100);
    }
}

async function callGeminiAPI(prompt) {
    try {
        console.log('🚀 Calling Gemini 2.5 Flash API...');
        console.log('URL:', GEMINI_API_URL);
        console.log('Prompt:', prompt);

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        console.log('✅ Response Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            console.log('✅ Generated Text:', text);
            return text;
        } else {
            throw new Error('No valid response from Gemini');
        }
    } catch (error) {
        console.error('💥 Gemini API Error:', error);
        throw error;
    }
}

async function getChatbotResponse(userMessage) {
    const systemPrompt = `You are FINLO Travel Assistant specializing in Bangalore tourism. Provide helpful, friendly 2-3 sentence responses.`;

    const userQuery = `User question: ${userMessage}\n\nProvide a brief, helpful response about Bangalore travel.`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 256
        }
    };

    try {
        console.log('🤖 Calling Gemini for chat response...');
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('API Error');

        const result = await response.json();
        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
            console.log('✅ Chat response received');
            return aiResponse;
        }
        throw new Error('No response from AI');

    } catch (error) {
        console.warn('⚠️ Chat API failed, using smart fallback:', error.message);
        return getSmartFallback(userMessage);
    }
}

function getSmartFallback(msg) {
    const m = msg.toLowerCase();
    if (m.includes('temple')) return "🕉️ Top temples: ISKCON (free!), Bull Temple (giant Nandi), Gavi Gangadhareshwara. All must-visits!";
    if (m.includes('park')) return "🌳 Best parks: Lalbagh (₹50), Cubbon Park (free!), Bannerghatta (₹80). Perfect for nature lovers!";
    if (m.includes('food')) return "🍽️ Try VV Puram Food Street, Thindi Beedi, Church Street! Don't miss masala dosa and filter coffee!";
    return "I'm FINLO AI! Ask about Bangalore's temples, parks, food, or trip planning. How can I help? 🌍";
}

// Weather Functions
async function getWeather(city = 'Bangalore') {
    // Using mock data as OpenWeatherMap requires API key
    return {
        current: { temp: 28, condition: 'Partly Cloudy', icon: '☁️' },
        forecast: [
            { day: 'Today', temp: 28, condition: 'Cloudy', icon: '☁️' },
            { day: 'Tomorrow', temp: 26, condition: 'Rainy', icon: '🌧️' },
            { day: 'Wed', temp: 29, condition: 'Sunny', icon: '☀️' }
        ]
    };
}

// Budget Chart Functions
function initBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    if (budgetChartInstance) {
        budgetChartInstance.destroy();
    }

    const food = parseFloat(document.getElementById('foodExpense')?.value || 0);
    const tickets = parseFloat(document.getElementById('ticketsExpense')?.value || 0);
    const transport = parseFloat(document.getElementById('transportExpense')?.value || 0);
    const accommodation = parseFloat(document.getElementById('accommodationExpense')?.value || 0);
    const totalSpent = food + tickets + transport + accommodation;
    const budget = state.tripProgress.budget || 5000;
    const remaining = Math.max(0, budget - totalSpent);

    budgetChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Tickets', 'Transport', 'Accommodation', 'Remaining'],
            datasets: [{
                data: [food, tickets, transport, accommodation, remaining],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

window.updateBudgetChart = function() {
    const food = parseFloat(document.getElementById('foodExpense')?.value || 0);
    const tickets = parseFloat(document.getElementById('ticketsExpense')?.value || 0);
    const transport = parseFloat(document.getElementById('transportExpense')?.value || 0);
    const accommodation = parseFloat(document.getElementById('accommodationExpense')?.value || 0);
    const totalSpent = food + tickets + transport + accommodation;
    const budget = state.tripProgress.budget || 5000;
    const remaining = Math.max(0, budget - totalSpent);

    document.getElementById('totalBudgetChart').textContent = `₹${budget}`;
    document.getElementById('totalSpentChart').textContent = `₹${totalSpent}`;
    document.getElementById('remainingChart').textContent = `₹${remaining}`;

    initBudgetChart();
}

// Share Trip Functions
window.shareTrip = function(platform) {
    if (!state.currentItinerary) {
        showToast('No itinerary to share!', 'error');
        return;
    }

    const tripDetails = state.currentItinerary;
    const totalCost = tripDetails.activities.reduce((sum, a) => sum + a.cost, 0);

    let shareText = `🌍 Check out my ${tripDetails.destination} trip plan!\n\n`;
    shareText += `📅 ${tripDetails.days} day(s)\n`;
    shareText += `💰 Total Cost: ₹${totalCost}\n\n`;
    shareText += `Activities:\n`;
    tripDetails.activities.slice(0, 3).forEach(a => {
        shareText += `• ${a.description} (₹${a.cost})\n`;
    });
    shareText += `\nPlanned with FINLO Travel App!`;

    const shareUrl = window.location.href;

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        email: `mailto:?subject=${encodeURIComponent('My Trip Plan - ' + tripDetails.destination)}&body=${encodeURIComponent(shareText)}`
    };

    if (shareLinks[platform]) {
        window.open(shareLinks[platform], '_blank');
        showToast('📤 Opening share dialog...');
    }
}

// Print Itinerary
window.printItinerary = function() {
    if (!state.currentItinerary) {
        showToast('No itinerary to print!', 'error');
        return;
    }

    const itinerary = state.currentItinerary;
    const totalCost = itinerary.activities.reduce((sum, a) => sum + a.cost, 0);

    const printWindow = window.open('', '', 'height=800,width=900');

    let activitiesHtml = '';
    for (let day = 1; day <= itinerary.days; day++) {
        const dayActivities = itinerary.activities.filter(a => a.day === day);
        if (dayActivities.length === 0) continue;

        activitiesHtml += `<h3>Day ${day}</h3>`;
        dayActivities.forEach(act => {
            activitiesHtml += `
                <div class="activity">
                    <strong>${act.time}</strong> - ${act.description}<br>
                    <small style="color: #06b6d4;">₹${act.cost}</small>
                </div>
            `;
        });
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>FINLO - ${itinerary.destination} Trip Itinerary</title>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; padding: 2rem; background: white; color: #1a1a1a; }
                h1 { color: #a855f7; margin-bottom: 0.5rem; }
                h2 { color: #06b6d4; margin-top: 0; }
                h3 { color: #a855f7; margin-top: 2rem; border-bottom: 2px solid #06b6d4; padding-bottom: 0.5rem; }
                .meta { color: #666; margin-bottom: 2rem; }
                .activity { margin: 1rem 0; padding: 1rem; border-left: 4px solid #06b6d4; background: #f9f9f9; }
                .total { margin-top: 2rem; padding: 1.5rem; background: #f0e6ff; border-radius: 8px; font-size: 1.2rem; font-weight: bold; color: #a855f7; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>🌍 FINLO Trip Itinerary</h1>
            <h2>${itinerary.destination}</h2>
            <div class="meta">
                <p>📅 ${itinerary.days} day(s) | 🚗 ${itinerary.transport} | 🍽️ ${itinerary.food}</p>
                <p>💰 Budget: ${itinerary.budget}</p>
            </div>
            ${activitiesHtml}
            <div class="total">
                💵 Total Estimated Cost: ₹${totalCost.toLocaleString()}
            </div>
            <button class="no-print" onclick="window.print()" style="margin-top: 2rem; padding: 1rem 2.5rem; background: #a855f7; color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 1rem; font-weight: 600;">Print Itinerary</button>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    showToast('🖨️ Opening print dialog...');
}

// Advanced Filters
window.applyAdvancedFilters = function() {
    const priceFilter = document.getElementById('priceFilter').value;
    const distanceFilter = parseFloat(document.getElementById('distanceFilter').value);
    const categoryChips = document.querySelectorAll('.chip.active');
    const categoryFilter = categoryChips[0]?.dataset.category || 'all';

    state.advancedFilters = { price: priceFilter, distance: distanceFilter, category: categoryFilter };

    let filtered = [...bangalorePlaces];

    // Price filter
    if (priceFilter !== 'all') {
        filtered = filtered.filter(place => {
            if (priceFilter === 'free') return place.entryFee === 'Free';
            const price = place.entryFee === 'Free' ? 0 : parseInt(place.entryFee.replace('₹', ''));
            if (priceFilter === 'budget') return price < 100;
            if (priceFilter === 'moderate') return price >= 100 && price <= 500;
            if (priceFilter === 'premium') return price > 500;
            return true;
        });
    }

    // Distance filter
    if (state.userLocation && distanceFilter < 50) {
        filtered = filtered.filter(place => {
            return !place.distance || parseFloat(place.distance) <= distanceFilter;
        });
    }

    // Category filter
    if (categoryFilter !== 'all') {
        const categoryMap = {
            'nature': 'Nature',
            'history': 'History',
            'spiritual': 'Spiritual',
            'shopping': 'Shopping'
        };
        filtered = filtered.filter(place => place.category === categoryMap[categoryFilter]);
    }

    renderPlaces(filtered);
}

window.updateDistanceValue = function() {
    const value = document.getElementById('distanceFilter').value;
    document.getElementById('distanceValue').textContent = `${value} km`;
}

window.selectCategoryChip = function(chip) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyAdvancedFilters();
}

// Theme Toggle
window.toggleTheme = function() {
    const root = document.documentElement;
    const sunIcon = document.querySelector('.theme-toggle .sun');
    const moonIcon = document.querySelector('.theme-toggle .moon');

    if (currentTheme === 'dark') {
        // Switch to light mode
        currentTheme = 'light';
        root.style.setProperty('--dark-bg', '#f5f5f5');
        root.style.setProperty('--card-bg', '#ffffff');
        root.style.setProperty('--text', '#1a1a1a');
        root.style.setProperty('--text-secondary', '#666666');
        document.body.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline';
    } else {
        // Switch to dark mode
        currentTheme = 'dark';
        root.style.setProperty('--dark-bg', '#0f0f23');
        root.style.setProperty('--card-bg', '#1a1a2e');
        root.style.setProperty('--text', '#ffffff');
        root.style.setProperty('--text-secondary', '#b4b4b4');
        document.body.style.background = 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)';
        sunIcon.style.display = 'inline';
        moonIcon.style.display = 'none';
    }

    showToast(`Switched to ${currentTheme} mode`);
}

// Generate Stars for Reviews
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '⭐'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    return stars;
}

// Initialize
function init() {
    renderThemes();
    renderPlaces();
    setupEventListeners();
    initializeAuthListener();
}

// Firebase Authentication State Listener
function initializeAuthListener() {
    console.log('🔥 Initializing Firebase Auth Listener...');

    onAuthStateChanged(auth, (user) => {
        console.log('🔥 Auth State Changed:', user ? 'LOGGED IN' : 'LOGGED OUT');

        if (user) {
            // User is logged in
            console.log('✅ User:', user.email);

            currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL
            };

            console.log('✅ Current User Set:', currentUser);

            // Update UI
            updateHeaderForLoggedInUser();

            // If on login page, redirect to home
            if (state.currentSection === 'login' || state.currentSection === 'signup') {
                console.log('📍 Redirecting to home...');
                showSection('home');
            }
        } else {
            // User is logged out
            console.log('❌ User logged out');
            currentUser = null;
            updateHeaderForLoggedOutUser();

            // Redirect to login if trying to access protected page
            if (['plan', 'profile', 'tripMode', 'editSection'].includes(state.currentSection)) {
                console.log('🔒 Protected page - redirecting to login');
                showSection('login');
            }
        }
    });
}

function updateHeaderForLoggedInUser() {
    console.log('🔐 updateHeaderForLoggedInUser called');
    const headerCenter = document.getElementById('headerCenter');
    const headerRight = document.getElementById('headerRight');
    const bottomNav = document.getElementById('bottomNav');

    if (!headerCenter || !headerRight) {
        console.error('❌ Header elements not found!');
        return;
    }

    headerCenter.innerHTML = `
        <a class="nav-link" onclick="window.showSection('home'); return false;">About Us</a>
        <a class="nav-link" onclick="window.showSection('explore'); return false;">Explore</a>
    `;

    const avatarUrl = avatarOptions.find(a => a.id === state.selectedAvatar)?.url || avatarOptions[0].url;
    const displayName = currentUser.displayName || currentUser.email.split('@')[0];

    headerRight.innerHTML = `
        <div class="profile-avatar-container">
            <img src="${avatarUrl}" id="header-avatar" class="header-avatar" onclick="window.toggleProfileDropdown(); return false;" alt="Profile" style="cursor: pointer; pointer-events: all;">
            <div class="profile-dropdown" id="profile-dropdown" style="display: none;">
                <div class="dropdown-user-info">
                    <span>${displayName}</span>
                    <span>${currentUser.email}</span>
                </div>
                <div class="dropdown-divider"></div>
                <button onclick="window.showSection('profile'); return false;">My Profile</button>
                <button onclick="window.showSection('plan'); return false;">Plan a Trip</button>
                <button onclick="window.showAvatarSelector(); return false;">Change Avatar</button>
                <div class="dropdown-divider"></div>
                <button onclick="window.logoutUser(); return false;" class="logout-btn-dropdown">Logout</button>
            </div>
        </div>
    `;

    console.log('✅ Avatar button rendered:', document.getElementById('header-avatar'));

    bottomNav.style.display = 'flex';
}

function updateHeaderForLoggedOutUser() {
    console.log('🔓 updateHeaderForLoggedOutUser called');
    const headerCenter = document.getElementById('headerCenter');
    const headerRight = document.getElementById('headerRight');
    const bottomNav = document.getElementById('bottomNav');

    if (!headerCenter || !headerRight) {
        console.error('❌ Header elements not found!');
        return;
    }

    headerCenter.innerHTML = `
        <a class="nav-link" onclick="window.showSection('home'); return false;">About Us</a>
        <a class="nav-link" onclick="window.showSection('explore'); return false;">Explore</a>
    `;
    headerRight.innerHTML = `
        <a class="nav-link" id="loginBtn" onclick="window.showSection('login'); return false;" style="cursor: pointer; pointer-events: all;">Login</a>
    `;

    console.log('✅ Login button rendered:', document.getElementById('loginBtn'));
    bottomNav.style.display = 'none';
}

window.toggleProfileDropdown = function() {
    console.log('📋 toggleProfileDropdown called');
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profile-dropdown');
    const avatar = document.getElementById('header-avatar');
    if (dropdown && avatar && !dropdown.contains(e.target) && e.target !== avatar) {
        dropdown.style.display = 'none';
    }
});

window.showAvatarSelector = function() {
    console.log('🎨 showAvatarSelector called');
    document.getElementById('avatar-selector-modal').style.display = 'flex';
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }

    // Highlight currently selected avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    const selectedIndex = avatarOptions.findIndex(a => a.id === state.selectedAvatar);
    if (selectedIndex !== -1) {
        document.querySelectorAll('.avatar-option')[selectedIndex].classList.add('selected');
    }
}

window.closeAvatarSelector = function() {
    console.log('❌ closeAvatarSelector called');
    document.getElementById('avatar-selector-modal').style.display = 'none';
}

window.selectAvatar = function(avatarId) {
    console.log('✅ selectAvatar called:', avatarId);
    state.selectedAvatar = avatarId;

    // Update header avatar
    const headerAvatar = document.getElementById('header-avatar');
    const avatarUrl = avatarOptions.find(a => a.id === avatarId)?.url;
    if (headerAvatar && avatarUrl) {
        headerAvatar.src = avatarUrl;
    }

    closeAvatarSelector();
    showToast('Avatar updated!');
}

window.signInWithGoogle = async function() {
    console.log('🔍 signInWithGoogle called');
    console.log('🔍 Attempting Google Sign-In...');

    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Google Sign-In Success:', result.user.email);
        showToast('Successfully signed in with Google!');
        // Auth listener will handle redirect
    } catch (error) {
        console.error('❌ Google sign-in error:', error);
        const errorDiv = state.currentSection === 'login' ?
            document.getElementById('loginError') :
            document.getElementById('signupError');
        if (errorDiv) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 5000);
        }
        showToast('Failed to sign in with Google: ' + error.message);
    }
}

window.logoutUser = async function() {
    console.log('🚪 logoutUser called');
    console.log('🚪 Attempting logout...');

    try {
        await signOut(auth);
        currentUser = null;
        state.selectedAvatar = 'avatar1';
        console.log('✅ Logout successful');
        showToast('Logged out successfully');
        showSection('home');
    } catch (error) {
        console.error('❌ Logout error:', error);
        showToast('Logout failed: ' + error.message);
    }
}

function setupEventListeners() {
    document.getElementById('planForm').addEventListener('submit', handlePlanSubmit);
    document.getElementById('searchBox').addEventListener('input', handleSearch);
    document.getElementById('sortSelect').addEventListener('change', handleSort);

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            handleFilter(this.dataset.filter);
        });
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('🔐 Attempting login...');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login successful:', userCredential.user.email);
        showToast('Login successful!');
        // Auth listener will handle redirect
    } catch (error) {
        console.error('❌ Login error:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    console.log('📝 Attempting signup...');

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupPasswordConfirm').value;
    const errorDiv = document.getElementById('signupError');

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match!';
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters!';
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Signup successful:', userCredential.user.email);
        showToast('Account created successfully!');

        // Show avatar selector after signup
        setTimeout(() => {
            showAvatarSelector();
        }, 800);
    } catch (error) {
        console.error('❌ Signup error:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Carousel is now pure CSS - no JavaScript needed for rotation

// Themes
function renderThemes() {
    const grid = document.getElementById('themesGrid');
    themes.forEach(theme => {
        const card = document.createElement('div');
        card.className = 'theme-card';
        card.onclick = () => selectTheme(theme);
        card.innerHTML = `
            <div class="theme-icon">${theme.icon}</div>
            <div class="theme-title">${theme.name}</div>
            <div class="theme-desc">${theme.description}</div>
        `;
        grid.appendChild(card);
    });
}

function selectTheme(theme) {
    showSection('plan');
    document.getElementById('destination').value = 'Bangalore';
    // Preferences field no longer exists in the form, handle this as needed
    // document.getElementById('preferences').value = theme.preferences;
    showToast(`Selected ${theme.name} theme! Adjust other fields as needed.`);
    setTimeout(() => {
        document.getElementById('planForm').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}


// Places Grid
function renderPlaces(placesToRender = bangalorePlaces) {
    const grid = document.getElementById('placesGrid');
    grid.innerHTML = '';

    placesToRender.forEach(place => {
        const card = createPlaceCard(place);
        grid.appendChild(card);
    });
}

function createPlaceCard(place, showDistance = false) {
    const card = document.createElement('div');
    card.className = 'place-card';

    const isFavorite = state.favorites.some(f => f.name === place.name);
    const distanceText = place.distance ? `<p style="color: var(--accent); font-weight: bold;">${place.distance} km away</p>` : '';

    card.innerHTML = `
        <img src="${place.image}" alt="${place.name}">
        <div class="place-card-content">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <h3>${place.name}</h3>
                <button class="heart-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavorite('${place.name}', event)">
                    ${isFavorite ? '♥' : '♡'}
                </button>
            </div>
            <p>${place.description}</p>
            ${distanceText}
            <span class="place-category">${place.category}</span>
            <p style="margin-top: 0.5rem; color: var(--accent); font-weight: 600;">${place.entryFee}</p>
        </div>
    `;

    card.onclick = (e) => {
        if (!e.target.classList.contains('heart-btn')) {
            showPlaceDetail(place);
        }
    };

    return card;
}

// Search and Filter
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = bangalorePlaces.filter(place =>
        place.name.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query)
    );
    renderPlaces(filtered);
}

function handleFilter(filter) {
    if (filter === 'all') {
        renderPlaces(bangalorePlaces);
    } else if (filter === 'free') {
        const filtered = bangalorePlaces.filter(place => place.entryFee === 'Free');
        renderPlaces(filtered);
    } else {
        const filtered = bangalorePlaces.filter(place => place.category === filter);
        renderPlaces(filtered);
    }
}

function handleSort(e) {
    const sortType = e.target.value;
    let sorted = [...bangalorePlaces];

    switch(sortType) {
        case 'alphabetical':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sorted.sort((a, b) => {
                const priceA = a.entryFee === 'Free' ? 0 : parseInt(a.entryFee.replace('₹', ''));
                const priceB = b.entryFee === 'Free' ? 0 : parseInt(b.entryFee.replace('₹', ''));
                return priceA - priceB;
            });
            break;
        case 'price-high':
            sorted.sort((a, b) => {
                const priceA = a.entryFee === 'Free' ? 0 : parseInt(a.entryFee.replace('₹', ''));
                const priceB = b.entryFee === 'Free' ? 0 : parseInt(b.entryFee.replace('₹', ''));
                return priceB - priceA;
            });
            break;
        case 'distance':
            if (state.userLocation) {
                sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            } else {
                showToast('Please use "Find Nearby" first!');
                return;
            }
            break;
    }

    renderPlaces(sorted);
}

// Near Me Feature
function findNearby() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        return;
    }

    showToast('Getting your location...');

    navigator.geolocation.getCurrentPosition(
        position => {
            state.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Calculate distances
            bangalorePlaces.forEach(place => {
                const distance = calculateDistance(
                    state.userLocation.lat,
                    state.userLocation.lng,
                    place.latitude,
                    place.longitude
                );
                place.distance = distance.toFixed(1);
            });

            // Sort by distance
            const sorted = [...bangalorePlaces].sort((a, b) =>
                parseFloat(a.distance) - parseFloat(b.distance)
            );

            renderPlaces(sorted);
            document.getElementById('sortSelect').value = 'distance';
            showToast('Showing places near you!');
        },
        error => {
            showToast('Unable to get your location. Please enable location services.');
        }
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Favorites
window.toggleFavorite = function(placeName, event) {
    console.log('❤️ toggleFavorite called:', placeName);
    if (event) event.stopPropagation();

    const place = bangalorePlaces.find(p => p.name === placeName);
    const index = state.favorites.findIndex(f => f.name === placeName);

    if (index > -1) {
        state.favorites.splice(index, 1);
        showToast('Removed from favorites');
    } else {
        state.favorites.push(place);
        showToast('Added to favorites');
    }

    renderPlaces(bangalorePlaces); // Re-render to update heart icon
    updateProfile();
}

window.toggleFavoriteModal = function() {
    console.log('❤️ toggleFavoriteModal called');
    if (state.currentPlace) {
        toggleFavorite(state.currentPlace.name);
        const btn = document.getElementById('modalFavoriteBtn');
        const isFavorite = state.favorites.some(f => f.name === state.currentPlace.name);
        btn.textContent = isFavorite ? '♥' : '♡';
        btn.classList.toggle('favorited', isFavorite);
    }
}


// Place Detail Modal
function showPlaceDetail(place) {
    state.currentPlace = place;
    state.galleryIndex = 0;

    document.getElementById('modalPlaceName').textContent = place.name;
    document.getElementById('modalCategory').textContent = place.category;
    document.getElementById('modalDescription').textContent = place.description;
    document.getElementById('modalHours').textContent = place.openingHours;
    document.getElementById('modalFee').textContent = place.entryFee;

    // Gallery
    const gallery = document.getElementById('imageGallery');
    // Basic image setup, replace with dynamic loading if needed
    const images = [
        place.image,
        place.image.replace('400x300', '800x600'), // Example variations
        place.image.replace('400x300', '700x500'),
        place.image.replace('400x300', '900x700')
     ];


    gallery.querySelectorAll('.gallery-image').forEach(img => img.remove());
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = `gallery-image ${index === 0 ? 'active' : ''}`;
        img.alt = place.name;
        // Insert before navigation buttons
        gallery.insertBefore(img, gallery.querySelector('.gallery-prev'));
    });


    // Reviews
    const reviewsContainer = document.getElementById('modalReviews');
    if (place.reviews && place.reviews.length > 0) {
        reviewsContainer.innerHTML = `
            <div class="avg-rating">
                <span class="stars">${generateStars(place.avgRating || 4.5)}</span>
                <span class="rating-number">${(place.avgRating || 4.5).toFixed(1)}/5</span>
            </div>
            <div class="reviews-list"></div>
        `;

        const reviewsList = reviewsContainer.querySelector('.reviews-list');
        place.reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-header">
                    <strong>${review.user}</strong>
                    <span class="stars">${generateStars(review.rating)}</span>
                </div>
                <p>${review.comment}</p>
                <small>${review.date}</small>
            `;
            reviewsList.appendChild(reviewCard);
        });

        if (place.totalReviews) {
            const totalText = document.createElement('p');
            totalText.style.marginTop = '1rem';
            totalText.style.color = 'var(--text-secondary)';
            totalText.textContent = `Based on ${place.totalReviews} reviews`;
            reviewsContainer.appendChild(totalText);
        }
    } else {
        // Fallback to mock reviews
        const shuffled = [...mockReviews].sort(() => 0.5 - Math.random());
        const selectedReviews = shuffled.slice(0, 3);

        reviewsContainer.innerHTML = '';
        selectedReviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-rating">${'⭐'.repeat(Math.floor(review.rating))} ${review.rating.toFixed(1)}</span>
                </div>
                <div class="review-comment">${review.comment}</div>
            `;
            reviewsContainer.appendChild(reviewDiv);
        });
    }

    // Map - Ensure Leaflet is loaded
    setTimeout(() => {
        const modalMapElement = document.getElementById('modalMap');
        // Clear previous map instance if exists
        if (modalMapElement._leaflet_id) {
            modalMapElement._leaflet_id = null;
        }
        modalMapElement.innerHTML = ''; // Clear map container

        const modalMap = L.map('modalMap').setView([place.latitude, place.longitude], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(modalMap);
        L.marker([place.latitude, place.longitude]).addTo(modalMap)
            .bindPopup(place.name).openPopup();
    }, 100); // Small delay to ensure modal is visible

    // Favorite button
    const isFavorite = state.favorites.some(f => f.name === place.name);
    const favBtn = document.getElementById('modalFavoriteBtn');
    favBtn.textContent = isFavorite ? '♥' : '♡';
    favBtn.classList.toggle('favorited', isFavorite);

    // Add to trip button
    const addBtn = document.getElementById('addToTripBtn');
    addBtn.style.display = state.currentItinerary ? 'inline-flex' : 'none';

    document.getElementById('placeModal').classList.add('active');
}


window.closeModal = function() {
    console.log('❌ closeModal called');
    const modalMapElement = document.getElementById('modalMap');
    // Destroy Leaflet map instance if it exists
    if (modalMapElement && modalMapElement._leaflet_id) {
         // Check if map exists before trying to remove
         if (window.modalMapInstance) {
            window.modalMapInstance.remove();
            window.modalMapInstance = null; // Clear reference
         }
    }
    document.getElementById('placeModal').classList.remove('active');
}


window.nextImage = function() {
    console.log('➡️ nextImage called');
    const images = document.querySelectorAll('#imageGallery .gallery-image');
    if (images.length === 0) return;
    images[state.galleryIndex].classList.remove('active');
    state.galleryIndex = (state.galleryIndex + 1) % images.length;
    images[state.galleryIndex].classList.add('active');
}

window.prevImage = function() {
    console.log('⬅️ prevImage called');
    const images = document.querySelectorAll('#imageGallery .gallery-image');
     if (images.length === 0) return;
    images[state.galleryIndex].classList.remove('active');
    state.galleryIndex = (state.galleryIndex - 1 + images.length) % images.length;
    images[state.galleryIndex].classList.add('active');
}


window.addToCurrentTrip = function() {
    console.log('➕ addToCurrentTrip called');
    if (!state.currentItinerary || !state.currentPlace) return;

    const place = state.currentPlace;
    const lastActivity = state.currentItinerary.activities[state.currentItinerary.activities.length - 1];
    const newTime = lastActivity ? addMinutes(lastActivity.time, 90) : '9:00 AM';

    const newActivity = {
        time: newTime,
        activity: place.name,
        description: place.description,
        cost: place.entryFee, // Using entryFee directly
        location: { lat: place.latitude, lng: place.longitude },
        day: lastActivity?.day || 1 // Assign to the last activity's day or day 1
    };


    state.currentItinerary.activities.push(newActivity);
     // Re-display itinerary with the new activity
    displayItinerary(state.currentItinerary, {
        destination: state.currentItinerary.destination,
        from: state.currentItinerary.from,
        days: state.currentItinerary.days,
        budget: state.currentItinerary.budget,
        transport: state.currentItinerary.transport,
        food: state.currentItinerary.food
    });
    showToast(`Added ${place.name} to your itinerary!`);
    closeModal();
}


// Current Location
window.useCurrentLocation = function() {
    console.log('📍 useCurrentLocation called');
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported by your browser');
        return;
    }

    showToast('Getting your location...');

    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude.toFixed(4);
            const lng = position.coords.longitude.toFixed(4);
            document.getElementById('fromLocation').value = `Current Location (${lat}, ${lng})`;
            showToast('Current location set!');
        },
        error => {
            showToast('Unable to get your location. Please enable location services.');
        }
    );
}

// Plan Trip - EXACT WORKING GEMINI API PATTERN
async function handlePlanSubmit(e) {
    e.preventDefault();
    await generateItinerary();
}

async function generateItinerary() {
    const from = document.getElementById('fromLocation').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const budget = document.getElementById('budget').value.trim();
    const days = parseInt(document.getElementById('tripDays').value) || 1;
    const transport = document.getElementById('transportMode').value;
    const food = document.getElementById('foodPreference').value;

    if (!from || !destination) {
        showToast('Please enter both locations!', 'error');
        return;
    }

    showLoadingState('Generating your perfect itinerary...');

    const systemPrompt = `You are an expert travel planner. Create detailed, realistic ${days}-day travel itineraries.
Respond ONLY with valid JSON. Do not include markdown formatting.`;

    const userQuery = `Generate a ${days}-day itinerary for ${destination}.
Preferences:
- Start: ${from}
- Budget: ${budget}
- Transport: ${transport}
- Food: ${food}

JSON format:
{
  "summary": "Brief trip summary",
  "itinerary": [
    {
      "day": 1,
      "time": "09:00 AM",
      "type": "activity",
      "activity": "Place name",
      "description": "Details",
      "cost": "₹200"
    }
  ],
  "totalCost": "₹5000"
}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    let attempts = 0;
    const maxAttempts = 5;
    let delay = 1000;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 || response.status >= 500) {
                throw new Error(`API Error: ${response.status}`);
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API error: ${errorData}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("No content from AI");
            }

            const data = JSON.parse(text);
            displayItinerary(data, { destination, from, days, budget, transport, food });
            hideLoadingState();
            showToast('Itinerary created!');
            document.getElementById('itineraryResult').style.display = 'block';
            document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
            return;

        } catch (error) {
            attempts++;
            console.warn(`Attempt ${attempts} failed: ${error.message}`);
            if (attempts >= maxAttempts) {
                hideLoadingState();
                showToast(`Failed: ${error.message}`, 'error');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

function showLoadingState(message = 'Loading...') {
    const loading = document.createElement('div');
    loading.id = 'loadingOverlay';
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <h2>${message}</h2>
            <p class="loading-subtext">This may take 10-15 seconds...</p>
            <div class="loading-progress">
                <div class="loading-bar"></div>
            </div>
        </div>
    `;
    document.body.appendChild(loading);

    // Animate progress bar
    setTimeout(() => {
        const bar = document.querySelector('.loading-bar');
        if (bar) bar.style.width = '100%';
    }, 100);
}

function hideLoadingState() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
    }
}

// PARSE ITINERARY (Simplified - Relies on JSON from API)
// The parseItinerary function is no longer strictly needed if the API
// reliably returns JSON in the expected format. We'll keep it simple.

function calculateTotalCost(activities) {
    let total = 0;
    activities.forEach(activity => {
        const costMatch = String(activity.cost).match(/₹?\s*(\d+)/);
        if (costMatch) {
            total += parseInt(costMatch[1]);
        }
    });
    return total;
}

function addMinutes(time, minutes) {
    try {
        const [t, period] = time.toUpperCase().split(' ');
        let [hours, mins] = t.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight case

        mins += minutes;
        hours += Math.floor(mins / 60);
        mins = mins % 60;
        hours = hours % 24;

        const newPeriod = hours >= 12 ? 'PM' : 'AM';
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12; // Handle noon/midnight correctly

        return `${displayHours}:${mins.toString().padStart(2, '0')} ${newPeriod}`;
    } catch (e) {
        console.error("Error parsing time:", time, e);
        // Fallback or default time if parsing fails
        const now = new Date();
        now.setMinutes(now.getMinutes() + minutes);
        return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
}


// Simple text display (Fallback) - Kept for reference but likely unused with JSON
function displaySimpleItinerary(data) {
    const container = document.getElementById('itineraryContent');

    container.innerHTML = `
        <div class="itinerary-header">
            <h1>🌍 ${data.destination}</h1>
            <p>${data.from} → ${data.destination} | ${data.days} Days</p>
            <div class="trip-meta">
                <span>🚗 ${data.transport}</span>
                <span>🍽️ ${data.food}</span>
                <span>💰 ${data.budget}</span>
            </div>
        </div>

        <div class="itinerary-content">
            <pre style="white-space: pre-wrap; line-height: 1.8; font-size: 1.1rem; background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 12px;">${data.text}</pre>
        </div>

        <div class="total-section">
            <div class="action-buttons">
                <button onclick="window.showSection('plan'); return false;" class="btn-primary">🔄 New Trip</button>
            </div>
        </div>
    `;

    // Store for later use
    state.currentItinerary = data;
    window.currentItinerary = data; // Make globally accessible if needed
}


function displayItinerary(data, prefs) {
    const container = document.getElementById('itineraryContent');
    if (!container) {
        console.error('Itinerary container not found!');
        return;
    }

    // Ensure activities are in the expected format (from potential parsing or direct JSON)
     const activities = data.itinerary || data.activities || []; // Handle both keys
     const totalCostNum = calculateTotalCost(activities);
     const totalCostDisplay = data.totalCost || `₹${totalCostNum}`; // Use provided or calculated


    let html = `
        <div class="itinerary-header">
            <h1>🌍 ${prefs.destination}</h1>
            <p class="trip-subtitle">${prefs.from} → ${prefs.destination} | ${prefs.days} Days</p>
            ${data.summary ? `<p class="trip-summary">${data.summary}</p>` : ''}
            <div class="trip-meta">
                <span>🚗 ${prefs.transport}</span>
                <span>🍽️ ${prefs.food}</span>
                <span>💰 ${prefs.budget}</span>
            </div>
        </div>
    `;

    const byDay = {};
    activities.forEach(item => {
        const day = item.day || 1; // Default to day 1 if missing
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(item);
    });

    Object.keys(byDay).sort((a, b) => a - b).forEach(day => {
        html += `<div class="day-section"><h2 class="day-header">Day ${day}</h2>`; // Use h2 for day header
        html += '<div class="activities-timeline">';
        byDay[day].forEach(item => {
            if (item.type === 'transport') {
                html += `<div class="activity-card transport"><div class="activity-time">${item.time || ''}</div><div class="activity-content">🚌 ${item.description || item.activity}</div></div>`;
            } else {
                 const costDisplay = item.cost ? `<strong>${item.cost}</strong>` : 'Free';
                html += `
                    <div class="activity-card">
                        <div class="activity-time">${item.time || ''}</div>
                        <div class="activity-content">
                            <h3>${item.activity || 'Activity'}</h3>
                            ${item.description ? `<p>${item.description}</p>` : ''}
                            <span class="activity-cost">Cost: ${costDisplay}</span>
                        </div>
                    </div>
                `;
            }
        });
        html += '</div></div>';
    });

    html += `
        <div class="total-section">
             <h2>Total: ${totalCostDisplay}</h2>
            <div class="action-buttons">
                 <button onclick="shareTrip('whatsapp')" class="btn-primary">Share</button>
                 <button onclick="printItinerary()" class="btn-secondary">Print</button>
                 <button onclick="window.showSection('plan'); return false;" class="btn-secondary">New Trip</button>
             </div>
        </div>
    `;

    container.innerHTML = html;

    // Store itinerary with preferences and CORRECT activities key
    state.currentItinerary = { ...data, ...prefs, activities: activities, totalCost: totalCostDisplay };
    window.currentItinerary = state.currentItinerary; // Make globally accessible if needed
    // Display map after rendering itinerary
    displayMap(state.currentItinerary);
}


function createTimelineItem(activity) { // Kept for potential future use, currently unused
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
        <div class="timeline-time">${activity.time}</div>
        <h4>${activity.activity}</h4>
        <p>${activity.description}</p>
        <p style="color: var(--accent); font-weight: 600; margin-top: 0.5rem;">Cost: ${activity.cost}</p>
    `;
    return item;
}

function displayMap(itinerary) {
    const mapElement = document.getElementById('map');
    if (!mapElement || !itinerary || !itinerary.activities) return;

    // Clear previous map instance if exists
     if (window.itineraryMapInstance) {
        window.itineraryMapInstance.remove();
        window.itineraryMapInstance = null;
    }
    mapElement.innerHTML = ''; // Clear map container

    try {
        const map = L.map('map').setView([12.9716, 77.5946], 11); // Start with Bangalore center
        window.itineraryMapInstance = map; // Store instance globally

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899'];
        const locations = [];
        const bounds = L.latLngBounds(); // To fit map to markers

        itinerary.activities.forEach((activity, index) => {
             // Try to find matching place from bangalorePlaces data for lat/lng
             const placeData = bangalorePlaces.find(p => p.name.toLowerCase() === activity.activity?.toLowerCase());
             if (placeData && placeData.latitude && placeData.longitude) {
                 const latLng = L.latLng(placeData.latitude, placeData.longitude);
                 locations.push({
                     lat: placeData.latitude,
                     lng: placeData.longitude,
                     name: activity.activity,
                     day: activity.day || 1,
                     time: activity.time || '',
                     index: index // Keep original index
                 });
                 bounds.extend(latLng); // Extend bounds to include this marker
             }
        });


        // Sort locations primarily by day, then by time (needs time parsing) or index
        locations.sort((a, b) => {
             if (a.day !== b.day) {
                 return a.day - b.day;
             }
             // Basic time sort (assumes consistent format, might need improvement)
             // Convert time to minutes for comparison if possible
             // For simplicity, using original index as tie-breaker for now
             return a.index - b.index;
         });


        const polylinesByDay = {};

        locations.forEach((loc, i) => {
            const dayColor = colors[(loc.day - 1) % colors.length];
            const marker = L.marker([loc.lat, loc.lng], {
                 icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div style='background-color:${dayColor};' class='marker-pin'></div><i class='material-icons'>${i+1}</i>`, // Use index+1 for numbering
                    iconSize: [30, 42],
                    iconAnchor: [15, 42]
                })
             }).addTo(map);
            marker.bindPopup(`<b>${i + 1}. ${loc.name}</b><br>Day ${loc.day} - ${loc.time}`);

             // Add coordinates to the day's polyline
             if (!polylinesByDay[loc.day]) {
                 polylinesByDay[loc.day] = [];
             }
             polylinesByDay[loc.day].push([loc.lat, loc.lng]);

        });

        // Draw polylines for each day
         Object.keys(polylinesByDay).forEach(day => {
             const dayColor = colors[(parseInt(day) - 1) % colors.length];
             if (polylinesByDay[day].length > 1) {
                 L.polyline(polylinesByDay[day], { color: dayColor, weight: 3, opacity: 0.7 }).addTo(map);
             }
         });


        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (locations.length === 1) {
             // Center on the single marker if only one location
            map.setView([locations[0].lat, locations[0].lng], 14);
        }

     } catch (e) {
         console.error("Error creating map:", e);
         mapElement.innerHTML = "<p>Error loading map.</p>";
     }
}


// Edit Itinerary
window.editItinerary = function() {
    console.log('✏️ editItinerary called');
    if (!state.currentItinerary || !state.currentItinerary.activities) return;

    state.editingItinerary = JSON.parse(JSON.stringify(state.currentItinerary));

    const container = document.getElementById('editableItems');
    container.innerHTML = '';

    state.editingItinerary.activities.forEach((activity, index) => {
        const item = document.createElement('div');
        item.className = 'edit-item draggable';
        item.draggable = true;
        item.dataset.originalIndex = index; // Store original index before sorting/adding
        item.innerHTML = `
            <span class="drag-handle">☰</span>
            <div class="edit-item-content">
                <strong>${activity.time || 'N/A'}</strong> - ${activity.activity || 'Unknown Activity'}
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Day ${activity.day || 1} - ${activity.cost || 'Free'}</div>
            </div>
            <button class="remove-btn" onclick="removeActivity(${index})">×</button>
        `;

        // Drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);

        container.appendChild(item);
    });

    // Show favorites to add
    const favContainer = document.getElementById('favoritesToAdd');
    favContainer.innerHTML = '';

    if (state.favorites.length === 0) {
        favContainer.innerHTML = '<p style="color: var(--text-secondary);">No favorites yet. Add some from the Explore page!</p>';
    } else {
        state.favorites.forEach(place => {
            const item = document.createElement('div');
            item.className = 'edit-item';
            item.innerHTML = `
                <div class="edit-item-content">
                    <strong>${place.name}</strong>
                    <div style="color: var(--text-secondary); font-size: 0.9rem;">${place.category} - ${place.entryFee}</div>
                </div>
                <button class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="addFavoriteToItinerary('${place.name}')">+</button>
            `;
            favContainer.appendChild(item);
        });
    }

    showSection('editSection');
}


let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Use the original index stored in dataset
    e.dataTransfer.setData('text/plain', this.dataset.originalIndex);
}


function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';

    const draggingItem = document.querySelector('.dragging');
    if (!draggingItem || draggingItem === this) return; // Don't do anything if dragging onto itself

    const container = this.parentElement;
    const allItems = [...container.querySelectorAll('.edit-item:not(.dragging)')]; // Exclude the item being dragged

    // Find the element we are hovering over
    const bounding = this.getBoundingClientRect();
    const offset = bounding.y + bounding.height / 2;

    // Insert before the element if dragging from top to bottom past midpoint
    // Insert after if dragging from bottom to top past midpoint
    if (e.clientY < offset) {
        container.insertBefore(draggingItem, this);
    } else {
         // Find the next sibling to insert before, or append if it's the last item
         const nextSibling = this.nextElementSibling;
         if(nextSibling){
            container.insertBefore(draggingItem, nextSibling);
         } else {
            container.appendChild(draggingItem);
         }
    }
}


function handleDrop(e) {
    e.stopPropagation(); // Stops the browser from redirecting.
    // The actual reordering happens in handleDragOver
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null; // Clear reference

     // Update the underlying data array based on the new DOM order
     const items = document.querySelectorAll('#editableItems .edit-item');
     const newActivitiesOrder = [];
     items.forEach(item => {
         const originalIndex = parseInt(item.dataset.originalIndex);
         newActivitiesOrder.push(state.editingItinerary.activities[originalIndex]);
     });
     // Update the editing itinerary's activities array
     // We need a stable way to map DOM elements back to the array. Storing original index helps.
     // For simplicity, let's just update the main itinerary directly on save.
     // The visual reorder is done, data reorder happens on save.
}


window.removeActivity = function(originalIndex) {
    console.log('🗑️ removeActivity called for original index:', originalIndex);

    // Find the activity by its original index and remove it
    state.editingItinerary.activities = state.editingItinerary.activities.filter((activity, index) => index !== originalIndex);

    // Re-render the edit section to reflect removal and update indices
    editItinerary();
    showToast('Activity removed');
}

window.addFavoriteToItinerary = function(placeName) {
    console.log('➕ addFavoriteToItinerary called:', placeName);
    const place = bangalorePlaces.find(p => p.name === placeName);
    if (!place || !state.editingItinerary) return;

    const lastActivity = state.editingItinerary.activities[state.editingItinerary.activities.length - 1];
    // Assign to the last day, or day 1 if no activities yet
    const dayToAdd = lastActivity ? (lastActivity.day || 1) : 1;
    const newTime = lastActivity ? addMinutes(lastActivity.time || '9:00 AM', 90) : '9:00 AM';

    const newActivity = {
        time: newTime,
        activity: place.name,
        description: place.description,
        cost: place.entryFee, // Use entryFee
        location: { lat: place.latitude, lng: place.longitude },
        day: dayToAdd,
        type: 'activity' // Explicitly set type
    };

    state.editingItinerary.activities.push(newActivity);

    // Re-render the edit view immediately
    editItinerary();
    showToast(`Added ${place.name} to itinerary (Day ${dayToAdd})`);
}


window.saveEditedItinerary = function() {
    console.log('💾 saveEditedItinerary called');
    if (!state.editingItinerary) return;

    // Reconstruct the activities array based on the current DOM order
    const items = document.querySelectorAll('#editableItems .edit-item');
    const reorderedActivities = [];
    items.forEach(item => {
        const originalIndex = parseInt(item.dataset.originalIndex);
        // Find the activity from the *original* editing array using the stored index
        const activity = state.editingItinerary.activities.find((act, idx) => idx === originalIndex);
        if (activity) {
            reorderedActivities.push(activity);
        } else {
             console.warn("Could not find activity for original index:", originalIndex);
             // Attempt to find based on text content as fallback (less reliable)
             const activityText = item.querySelector('.edit-item-content strong')?.textContent;
             const fallbackActivity = state.editingItinerary.activities.find(act => (act.time || 'N/A') === activityText);
             if (fallbackActivity) reorderedActivities.push(fallbackActivity);
        }
    });

    state.editingItinerary.activities = reorderedActivities;
    // Recalculate total cost based on the final list
    const newTotalCost = calculateTotalCost(state.editingItinerary.activities);
    state.editingItinerary.totalCost = `₹${newTotalCost}`; // Update total cost string

    // Update the main currentItinerary
    state.currentItinerary = JSON.parse(JSON.stringify(state.editingItinerary));
    state.editingItinerary = null; // Clear editing state

    // Re-display the updated itinerary in the 'plan' section
    displayItinerary(state.currentItinerary, {
        destination: state.currentItinerary.destination,
        from: state.currentItinerary.from,
        days: state.currentItinerary.days,
        budget: state.currentItinerary.budget,
        transport: state.currentItinerary.transport,
        food: state.currentItinerary.food
    });

    showSection('plan');
    document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
    showToast('Itinerary updated!');
}


window.cancelEdit = function() {
    console.log('❌ cancelEdit called');
    state.editingItinerary = null; // Discard changes
    showSection('plan'); // Go back to the plan section
    // Ensure the itinerary result is visible and scrolled to
    if (state.currentItinerary) {
        document.getElementById('itineraryResult').style.display = 'block';
        document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
    }
}


// Trip Mode
window.startTrip = function() {
    console.log('🚀 startTrip called');
    if (!state.currentItinerary || !state.currentItinerary.activities) return;

    state.tripProgress.completed = [];
    state.tripProgress.expenses = {}; // Reset expenses
    // Parse budget string correctly
    const budgetMatch = String(state.currentItinerary.budget).match(/(\d+)/);
    state.tripProgress.budget = budgetMatch ? parseFloat(budgetMatch[1]) : 5000; // Default budget

    // Reset expense inputs in the UI
     document.getElementById('foodExpense').value = '';
     document.getElementById('ticketsExpense').value = '';
     document.getElementById('transportExpense').value = '';
     document.getElementById('accommodationExpense').value = '';


    // Initialize budget chart needs to happen *after* the section is shown
    showSection('tripMode');
    setTimeout(() => {
        updateBudgetChart(); // This calls initBudgetChart inside
    }, 100); // Delay to ensure canvas is ready

    renderTripMode();
}


function renderTripMode() {
    const container = document.getElementById('tripModeContent');
    if (!container || !state.currentItinerary || !state.currentItinerary.activities) return;
    container.innerHTML = ''; // Clear previous content

    const total = state.currentItinerary.activities.length;
    const completedCount = state.tripProgress.completed.length;
    const progress = total > 0 ? (completedCount / total) * 100 : 0;

    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${completedCount} of ${total} activities completed`;

    updateBudgetDisplay(); // Update budget summary numbers

    // Group activities by day
    const activitiesByDay = {};
    state.currentItinerary.activities.forEach((activity, index) => {
        const day = activity.day || 1;
        if (!activitiesByDay[day]) {
            activitiesByDay[day] = [];
        }
         // Assign a unique ID based on original index
        activity.uniqueId = index;
        activitiesByDay[day].push(activity);
    });

    // Sort days and render
    Object.keys(activitiesByDay).sort((a, b) => parseInt(a) - parseInt(b)).forEach(day => {
        const dayActivities = activitiesByDay[day];
        const daySection = document.createElement('div');
        daySection.className = 'day-section';
        // Add date if available in itinerary data (optional)
        daySection.innerHTML = `<h2 class="day-header">Day ${day}</h2>`; // Use H2 for consistency

        dayActivities.forEach(activity => {
            const item = createTripModeItem(activity, activity.uniqueId); // Use uniqueId
            daySection.appendChild(item);
        });
        container.appendChild(daySection);
    });
}


function createTripModeItem(activity, uniqueId) {
    const isCompleted = state.tripProgress.completed.includes(uniqueId);
     // Initialize expenses if not present
    if (!state.tripProgress.expenses[uniqueId]) {
         state.tripProgress.expenses[uniqueId] = { food: 0, tickets: 0, transport: 0, other: 0 };
     }
    const expenses = state.tripProgress.expenses[uniqueId];

    const item = document.createElement('div');
    // Add data attribute for easier selection if needed
    item.dataset.activityId = uniqueId;
    // Use activity-card style for consistency, add 'completed' class if needed
    item.className = `activity-card trip-mode-item ${isCompleted ? 'completed' : ''}`;
    item.innerHTML = `
        <div class="activity-time">${activity.time || ''} ${isCompleted ? '<span style="color: #10b981;">✓</span>' : ''}</div>
        <div class="activity-content">
            <h3>${activity.activity || 'Activity'}</h3>
            ${activity.description ? `<p>${activity.description}</p>` : ''}
            <span class="activity-cost">Est: ${activity.cost || 'Free'}</span>

            ${!isCompleted ? `
                <button class="btn btn-primary" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="markComplete(${uniqueId})">Mark Complete</button>
            ` : '<p style="color: #10b981; font-weight: 600; margin-top: 1rem;">✓ Completed</p>'}

            <div class="expense-tracker" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <h5>Log Actual Expenses</h5>
                <div class="expense-inputs">
                    <div class="expense-input">
                        <label>Food (₹)</label>
                        <input type="number" id="food-${uniqueId}" value="${expenses.food || ''}" min="0" onchange="logExpense(${uniqueId})">
                    </div>
                    <div class="expense-input">
                        <label>Tickets (₹)</label>
                        <input type="number" id="tickets-${uniqueId}" value="${expenses.tickets || ''}" min="0" onchange="logExpense(${uniqueId})">
                    </div>
                    <div class="expense-input">
                        <label>Transport (₹)</label>
                        <input type="number" id="transport-${uniqueId}" value="${expenses.transport || ''}" min="0" onchange="logExpense(${uniqueId})">
                    </div>
                     <div class="expense-input">
                         <label>Accommodation (₹)</label>
                         <input type="number" id="accommodation-${uniqueId}" value="${expenses.accommodation || ''}" min="0" onchange="logExpense(${uniqueId})">
                     </div>
                </div>
                </div>
        </div>
    `;
    return item;
}


window.markComplete = function(uniqueId) {
    console.log('✅ markComplete called:', uniqueId);
    if (!state.tripProgress.completed.includes(uniqueId)) {
        state.tripProgress.completed.push(uniqueId);
        showToast('Activity marked as complete!');
        renderTripMode(); // Re-render to update UI
    }
}

window.logExpense = function(uniqueId) {
    console.log('💰 logExpense called:', uniqueId);

    // Read values directly when function is called
    const food = parseFloat(document.getElementById(`food-${uniqueId}`)?.value) || 0;
    const tickets = parseFloat(document.getElementById(`tickets-${uniqueId}`)?.value) || 0;
    const transport = parseFloat(document.getElementById(`transport-${uniqueId}`)?.value) || 0;
    const accommodation = parseFloat(document.getElementById(`accommodation-${uniqueId}`)?.value) || 0;


    // Update the state
    state.tripProgress.expenses[uniqueId] = { food, tickets, transport, accommodation };


    updateBudgetDisplay(); // Update overall budget summary
    updateBudgetChart(); // Update the chart in the trip mode section
    // No need for a separate save button, logging happens on input change
    console.log('Expense logged for activity:', uniqueId, state.tripProgress.expenses[uniqueId]);
     // Optionally show a toast, but might be too frequent with onchange
     // showToast('Expense updated!');
}

function updateBudgetDisplay() {
    let totalSpent = 0;
     // Summing up all logged expenses across all activities
     Object.values(state.tripProgress.expenses).forEach(exp => {
         totalSpent += (exp.food || 0) + (exp.tickets || 0) + (exp.transport || 0) + (exp.accommodation || 0); // Include accommodation
     });


    const budget = state.tripProgress.budget;
    const remaining = budget - totalSpent;

     // Update the summary section elements if they exist
     const budgetTotalEl = document.getElementById('budgetTotal');
     const spentTotalEl = document.getElementById('spentTotal');
     const remainingTotalEl = document.getElementById('remainingTotal');

     if (budgetTotalEl) budgetTotalEl.textContent = `₹${budget.toFixed(0)}`;
     if (spentTotalEl) spentTotalEl.textContent = `₹${totalSpent.toFixed(0)}`;
     if (remainingTotalEl) {
         remainingTotalEl.textContent = `₹${remaining.toFixed(0)}`;
         remainingTotalEl.style.color = remaining < 0 ? '#ef4444' : '#10b981';
     }

     // Also update the chart summary numbers
     const totalBudgetChartEl = document.getElementById('totalBudgetChart');
     const totalSpentChartEl = document.getElementById('totalSpentChart');
     const remainingChartEl = document.getElementById('remainingChart');

     if(totalBudgetChartEl) totalBudgetChartEl.textContent = `₹${budget.toFixed(0)}`;
     if(totalSpentChartEl) totalSpentChartEl.textContent = `₹${totalSpent.toFixed(0)}`;
     if(remainingChartEl) {
        remainingChartEl.textContent = `₹${remaining.toFixed(0)}`;
        remainingChartEl.style.color = remaining < 0 ? '#ef4444' : '#10b981';
     }

}


window.endTrip = function() {
    console.log('🏁 endTrip called');
    if (confirm('Are you sure you want to end this trip? Your logged expenses will be cleared.')) {
        // Optionally save final expenses or trip summary here
        showSection('plan'); // Go back to plan section
        showToast('Trip ended. Great journey!');
        // Reset trip progress state
        state.tripProgress = { completed: [], expenses: {}, budget: 0 };
        state.currentItinerary = null; // Clear current itinerary after ending
         document.getElementById('itineraryResult').style.display = 'none'; // Hide itinerary display
    }
}


// Generate New Itinerary
window.generateNewItinerary = function() {
    console.log('🔄 generateNewItinerary called');
    document.getElementById('itineraryResult').style.display = 'none';
    state.currentItinerary = null;
    showSection('plan');
    // Clear the form fields? Optional.
    // document.getElementById('planForm').reset();
    document.getElementById('planForm').scrollIntoView({ behavior: 'smooth' });
}

// Save Trip
window.saveTrip = function() {
    console.log('💾 saveTrip called');
    if (!state.currentItinerary) {
        showToast('No itinerary to save!', 'error');
        return;
    }

    const name = prompt('Enter a name for this trip:', state.currentItinerary.destination);
    if (!name) return; // User cancelled

    // Recalculate total cost just before saving, if needed, or use stored one
     const totalCostNum = calculateTotalCost(state.currentItinerary.activities);
     const totalCostStr = state.currentItinerary.totalCost || `₹${totalCostNum}`;


    const trip = {
        id: Date.now().toString(), // Simple unique ID
        name: name,
        destination: state.currentItinerary.destination,
        days: state.currentItinerary.days,
        date: new Date().toLocaleDateString(), // Save date
        itinerary: JSON.parse(JSON.stringify(state.currentItinerary)), // Deep copy
         totalCost: totalCostStr // Store the final calculated/provided cost string

    };

    state.savedTrips.push(trip);
    updateProfile(); // Update the profile page display
    showToast('✅ Trip saved successfully!');
}


window.loadTrip = function(tripId) {
    console.log('📤 loadTrip called:', tripId);
    const trip = state.savedTrips.find(t => t.id === tripId);
    if (!trip) {
        showToast('Error: Could not find saved trip.', 'error');
        return;
    }

    // Load the itinerary data from the saved trip object
    state.currentItinerary = JSON.parse(JSON.stringify(trip.itinerary)); // Deep copy

     // Display the loaded itinerary in the 'plan' section
     // We need the preferences data which might not be fully stored in trip.itinerary
     // Reconstruct preferences or use defaults/stored values
     const prefs = {
         destination: state.currentItinerary.destination || 'Bangalore',
         from: state.currentItinerary.from || 'Unknown',
         days: state.currentItinerary.days || 1,
         budget: state.currentItinerary.budget || 'Not specified',
         transport: state.currentItinerary.transport || 'Any',
         food: state.currentItinerary.food || 'Any'
     };
     displayItinerary(state.currentItinerary, prefs);


    showSection('plan'); // Navigate to the plan section
    document.getElementById('itineraryResult').style.display = 'block'; // Ensure it's visible
    document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
    showToast(`Loaded trip: ${trip.name}`);
}


window.deleteTrip = function(tripId) {
    console.log('🗑️ deleteTrip called:', tripId);
    if (confirm('Are you sure you want to delete this trip? This cannot be undone.')) {
        state.savedTrips = state.savedTrips.filter(t => t.id !== tripId);
        updateProfile(); // Update the display on the profile page
        showToast('Trip deleted');
    }
}

// Profile
function updateProfile() {
     if (state.currentSection !== 'profile') return; // Only update if profile section is active

    // Update favorites
    document.getElementById('favoritesCount').textContent = state.favorites.length;
    const favGrid = document.getElementById('favoritesGrid');
    favGrid.innerHTML = '';

    if (state.favorites.length === 0) {
        favGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1/-1;">No favorites yet. Explore places and add them to your favorites!</p>';
    } else {
        state.favorites.forEach(place => {
            const card = createPlaceCard(place); // Assumes createPlaceCard handles favorites correctly
            favGrid.appendChild(card);
        });
    }

    // Update saved trips
    document.getElementById('savedTripsCount').textContent = state.savedTrips.length;
    const tripsGrid = document.getElementById('savedTripsGrid');
    tripsGrid.innerHTML = '';

    if (state.savedTrips.length === 0) {
        tripsGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1/-1;">No saved trips yet. Plan a trip and save it for later!</p>';
    } else {
         // Sort trips by date, newest first (optional)
         const sortedTrips = [...state.savedTrips].sort((a, b) => parseInt(b.id) - parseInt(a.id));

        sortedTrips.forEach(trip => {
            const card = document.createElement('div');
            card.className = 'saved-trip-card';
             // Ensure trip.itinerary and activities exist
            const activityCount = trip.itinerary?.activities?.length || 0;
            const totalCostDisplay = trip.totalCost || 'N/A'; // Use saved total cost

            card.innerHTML = `
                <div class="saved-trip-header">
                    <div class="saved-trip-info">
                        <h3 class="saved-trip-title">${trip.name} (${trip.destination || 'N/A'})</h3>
                        <div class="saved-trip-meta">
                            ${trip.days || '?'} day${(trip.days || 1) > 1 ? 's' : ''} • Saved: ${trip.date || 'N/A'}
                        </div>
                    </div>
                </div>
                <p style="color: var(--accent); font-weight: 600; margin-top: 1rem;">Est. Cost: ${totalCostDisplay}</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${activityCount} activities</p>
                <div class="saved-trip-actions">
                    <button class="btn btn-primary" onclick="loadTrip('${trip.id}')">View Trip</button>
                    <button class="delete-btn" onclick="deleteTrip('${trip.id}')">Delete</button>
                </div>
            `;
            tripsGrid.appendChild(card);
        });
    }
}


// Back Button
window.goBack = function() {
    console.log('⬅️ goBack called');
    const currentSection = state.currentSection;

     // Specific back logic: from edit back to plan view (if itinerary exists)
     if (currentSection === 'editSection' && state.currentItinerary) {
         showSection('plan');
         document.getElementById('itineraryResult').style.display = 'block';
         document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
         return;
     }

     // From trip mode back to plan view (if itinerary exists)
     if (currentSection === 'tripMode' && state.currentItinerary) {
         showSection('plan');
         document.getElementById('itineraryResult').style.display = 'block';
         document.getElementById('itineraryResult').scrollIntoView({ behavior: 'smooth' });
         return;
     }

    // Default back to home for most other pages
    if (currentSection !== 'home') {
        showSection('home');
    }
    // If already on home, do nothing
}


function updateBackButton() {
    const backBtn = document.getElementById('backBtn');
    const currentSection = state.currentSection;

    // Show back button on all pages EXCEPT home, login, and signup
    if (currentSection === 'home' || currentSection === 'login' || currentSection === 'signup') {
        backBtn.classList.remove('visible');
    } else {
        backBtn.classList.add('visible');
    }
}

// Navigation - MAKE GLOBALLY AVAILABLE
window.showSection = function(sectionId) {
    console.log('🔄 showSection called:', sectionId);
    // Check authentication for protected pages
    const protectedPages = ['plan', 'profile', 'tripMode', 'editSection'];
    if (protectedPages.includes(sectionId) && !currentUser) {
        showToast('Please login to access this feature');
        showSection('login'); // Redirect to login
        return;
    }

    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Ensure it's hidden
    });

    // Show the target section
    const targetSection = document.getElementById(sectionId);
     if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block'; // Make sure it's visible
        state.currentSection = sectionId;
         window.scrollTo(0, 0); // Scroll to top
    } else {
        console.error("Section not found:", sectionId);
        showSection('home'); // Fallback to home
        return;
    }


    // Update bottom nav active state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const navMap = {
        'home': 0,
        'explore': 1,
        'plan': 2,
        'profile': 3
    };

    if (navMap[sectionId] !== undefined) {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        if (navItems[navMap[sectionId]]) {
            navItems[navMap[sectionId]].classList.add('active');
        }
    }

    if (sectionId === 'profile') {
        updateProfile(); // Load profile data when showing the section
    }

    // Update back button visibility
    updateBackButton();
}


// Toast
window.showToast = function(message, type = 'success') {
    console.log('🍞 showToast:', message, type);
    const toast = document.getElementById('toast');
    if (!toast) return; // Exit if toast element doesn't exist

    toast.textContent = message;
    toast.style.borderColor = type === 'error' ? '#ef4444' : 'var(--primary)'; // Use border-color
    toast.classList.add('active');

     // Clear any existing timer
     if (window.toastTimer) {
         clearTimeout(window.toastTimer);
     }

    // Set a new timer to hide the toast
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('active');
        window.toastTimer = null; // Clear the timer reference
    }, 4000); // Increased duration to 4 seconds
}


// Initialize chat with welcome message
document.addEventListener('DOMContentLoaded', function() {
    console.log('Chat initialized');
    console.log('API Key available:', GEMINI_API_KEY ? 'Yes' : 'No');

    // Add welcome message after a short delay
    setTimeout(() => {
        const existingMessages = document.querySelectorAll('#chatMessages .bot-message:not(.typing-indicator)');
        if (existingMessages.length === 1 && existingMessages[0].textContent.includes("How can I help")) {
            // Replace the default message with a better one only if it's the initial default
            existingMessages[0].textContent = "Hi! I'm your FINLO travel assistant. 👋 I can help you discover amazing places in Bangalore, plan trips, and answer your travel questions. How can I assist you today?";
        } else if (existingMessages.length === 0) {
             // If no messages exist yet, add the welcome message
             addChatMessage("Hi! I'm your FINLO travel assistant. 👋 I can help you discover amazing places in Bangalore, plan trips, and answer your travel questions. How can I assist you today?", 'bot');
        }
    }, 500);
});

// Initialize app
init();