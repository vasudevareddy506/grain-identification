import * as Speech from 'expo-speech';

// Configurable backend API URL
// Change '10.0.2.2' for Android emulator, 'localhost' for Web, or use local LAN IP (e.g., '192.168.1.X')
export let BASE_API_URL = 'http://localhost:8000';

export const setBaseApiUrl = (url: string) => {
  if (url) {
    // Ensure it has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      BASE_API_URL = `http://${url}`;
    } else {
      BASE_API_URL = url;
    }
  }
};

// State trackers
let isOfflineMode = false;
export const getOfflineMode = () => isOfflineMode;
export const setOfflineMode = (val: boolean) => {
  isOfflineMode = val;
};

// Local storage mocks for offline execution
let mockHistoryList: any[] = [];
let scanCounter = 1000;

// Hardcoded library data to guarantee instant offline library loading
export const MOCK_GRAINS = [
  {
    id: 1,
    name: "Rice",
    description: "Rice is the seed of the grass species Oryza sativa. It is the most widely consumed staple food for a large part of the world's human population, especially in Asia.",
    nutrition_calories: 365,
    nutrition_protein: 7.1,
    nutrition_carbs: 80,
    nutrition_fat: 0.6,
    nutrition_fiber: 1.3,
    cultivation_info: "Grown in flooded paddies. Requires warm, humid climate and clayey/loamy soil. Needs a lot of water and sunshine.",
    uses: "Staple food cooked by boiling, used in sushi, risotto, pilaf, or processed into flour, syrup, and rice milk.",
    translations_json: JSON.stringify({
      es: { name: "Arroz", description: "El arroz es la semilla de la planta Oryza sativa...", cultivation_info: "Cultivado en arrozales inundados...", uses: "Alimento básico cocido al vapor..." },
      hi: { name: "चावल", description: "चावल ओरिज़ा सैटिवा पौधे का बीज है...", cultivation_info: "बाढ़ वाले खेतों में उगाया जाता है...", uses: "उबालकर खाया जाता है..." },
      fr: { name: "Riz", description: "Le riz est la graine de l'espèce de graminée...", cultivation_info: "Cultivé dans des rizières inondées...", uses: "Aliment de base cuit à l'eau..." }
    })
  },
  {
    id: 2,
    name: "Wheat",
    description: "Wheat is a cereal grain, originally from the Levant region but now cultivated worldwide. It is grown on more land area than any other food crop.",
    nutrition_calories: 340,
    nutrition_protein: 13.2,
    nutrition_carbs: 72,
    nutrition_fat: 2.5,
    nutrition_fiber: 10.7,
    cultivation_info: "Requires well-drained loamy soil, moderate rainfall, and moderate temperatures. Grown during winter or early spring.",
    uses: "Ground into flour to make bread, pasta, noodles, cakes, biscuits, couscous, and used in fermentation.",
    translations_json: JSON.stringify({
      es: { name: "Trigo", description: "El trigo es un cereal originario de Levante...", cultivation_info: "Requiere suelo franco bien drenado...", uses: "Molido en harina para hacer pan..." },
      hi: { name: "गेहूं", description: "गेहूं एक अनाज है, जो मूल रूप से लेवंत क्षेत्र से है...", cultivation_info: "अच्छी जल निकासी वाली दोमट मिट्टी...", uses: "रोटी, पास्ता, नूडल्स, केक..." },
      fr: { name: "Blé", description: "Le blé est une céréale originaire du Levant...", cultivation_info: "Nécessite un sol limoneux bien drainé...", uses: "Moulu en farine pour faire du pain..." }
    })
  },
  {
    id: 3,
    name: "Maize",
    description: "Maize, also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago.",
    nutrition_calories: 365,
    nutrition_protein: 9.4,
    nutrition_carbs: 74,
    nutrition_fat: 4.7,
    nutrition_fiber: 7.3,
    cultivation_info: "Thrives in warm weather with fertile, well-drained soils and plenty of sunshine. Requires regular watering.",
    uses: "Used for making cornstarch, cornmeal, polenta, tortillas, popcorn, corn oil, and syrup, as well as animal feed.",
    translations_json: JSON.stringify({
      es: { name: "Maíz", description: "El maíz es un cereal domesticado en México...", cultivation_info: "Prospera en climas cálidos con suelos fértiles...", uses: "Usado para hacer almidón, harina, polenta..." }
    })
  },
  {
    id: 4,
    name: "Barley",
    description: "Barley is a major cereal grain widely used in food, beverages, and animal feed. It is one of the first cultivated grains.",
    nutrition_calories: 354,
    nutrition_protein: 12.5,
    nutrition_carbs: 73.5,
    nutrition_fat: 2.3,
    nutrition_fiber: 17.3,
    cultivation_info: "Cool climate crop, tolerant of poor soils and salinity. Needs well-drained soils and moderate rainfall.",
    uses: "Principally used for beer brewing, whiskey distilling, animal feed, and in soups, stews, and barley bread.",
    translations_json: JSON.stringify({
      es: { name: "Cebada", description: "La cebada es un grano de cereal importante..." }
    })
  },
  {
    id: 5,
    name: "Millet",
    description: "Millets are a highly varied group of small-seeded grasses, widely grown around the world as cereal crops for fodder and human food.",
    nutrition_calories: 378,
    nutrition_protein: 11,
    nutrition_carbs: 73,
    nutrition_fat: 4.2,
    nutrition_fiber: 8.5,
    cultivation_info: "Extremely drought-tolerant. Grows in dry, hot climates and poor, sandy soils. Requires very little water.",
    uses: "Cooked as porridge, ground into flour for flatbreads, used in snacks, and widely used as birdseed and fodder.",
    translations_json: JSON.stringify({
      es: { name: "Mijo", description: "Los mijos son un grupo variado de gramíneas..." }
    })
  },
  {
    id: 6,
    name: "Oats",
    description: "Oats is a species of cereal grain grown for its seed. Oats are suitable for human consumption as oatmeal and oat milk.",
    nutrition_calories: 389,
    nutrition_protein: 16.9,
    nutrition_carbs: 66,
    nutrition_fat: 6.9,
    nutrition_fiber: 10.6,
    cultivation_info: "Prefers cool, moist climates. Does well in acid soils and requires moderate rainfall. Common in northern climates.",
    uses: "Rolled or ground for porridge (oatmeal), used in granola, muesli, cookies, and processed into oat milk.",
    translations_json: JSON.stringify({
      es: { name: "Avena", description: "La avena es una especie de cereal..." }
    })
  },
  {
    id: 7,
    name: "Chickpeas",
    description: "The chickpea or garbanzo bean is an annual legume of the family Fabaceae. It is high in protein and is one of the earliest cultivated legumes.",
    nutrition_calories: 364,
    nutrition_protein: 19.3,
    nutrition_carbs: 61,
    nutrition_fat: 6,
    nutrition_fiber: 17,
    cultivation_info: "Requires subtropical or warm climate, sandy or loamy soils with good drainage. Fairly drought-tolerant.",
    uses: "Used to make hummus, falafel, curries (chana masala), salads, and ground into chickpea flour (besan).",
    translations_json: JSON.stringify({
      es: { name: "Garbanzos", description: "El garbanzo es una legumbre anual..." }
    })
  },
  {
    id: 8,
    name: "Corn",
    description: "Corn is a tall annual cereal grass (Zea mays) that is widely grown for its large yellow ears of starchy seeds.",
    nutrition_calories: 365,
    nutrition_protein: 9.4,
    nutrition_carbs: 74,
    nutrition_fat: 4.7,
    nutrition_fiber: 7.3,
    cultivation_info: "Prefers fertile, well-drained loams, warm temperatures, and frequent watering. Needs rich nitrogen soils.",
    uses: "Eaten fresh as sweetcorn, boiled, roasted, or processed into corn flakes, grits, taco shells, and ethanol.",
    translations_json: JSON.stringify({
      es: { name: "Maíz dulce", description: "El maíz dulce es una variedad de maíz..." }
    })
  },
  {
    id: 9,
    name: "Pulses",
    description: "Pulses are the edible seeds of plants in the legume family. They include lentils, dry peas, and beans, and are high in protein and fiber.",
    nutrition_calories: 350,
    nutrition_protein: 24.5,
    nutrition_carbs: 60,
    nutrition_fat: 1.1,
    nutrition_fiber: 15,
    cultivation_info: "Grown in rotation with other crops. They fix nitrogen in the soil, improving soil health. Require moderate water.",
    uses: "Used in dals, soups, stews, salads, curries, and processed into protein powders and meat substitutes.",
    translations_json: JSON.stringify({
      es: { name: "Legumbres", description: "Las legumbres son las semillas comestibles..." }
    })
  }
];

// Helper to check API status
export const checkServerHealth = async (): Promise<boolean> => {
  if (isOfflineMode) return false;
  try {
    const response = await fetch(`${BASE_API_URL}/api/grains`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch (e) {
    return false;
  }
};

// Voice Speech Service
let isSpeakingState = false;
export const speakText = (text: string, lang: string = 'en') => {
  if (isSpeakingState) {
    Speech.stop();
  }
  
  isSpeakingState = true;
  Speech.speak(text, {
    language: lang,
    onDone: () => { isSpeakingState = false; },
    onError: () => { isSpeakingState = false; }
  });
};

export const stopSpeech = () => {
  Speech.stop();
  isSpeakingState = false;
};

// API Fetch wrappers
export const getGrainsList = async (): Promise<any[]> => {
  try {
    if (isOfflineMode) return MOCK_GRAINS;
    
    const response = await fetch(`${BASE_API_URL}/api/grains`);
    if (!response.ok) throw new Error('API server returned error');
    return await response.json();
  } catch (e) {
    console.warn("API Grains fetch failed. Falling back to local offline library.");
    return MOCK_GRAINS;
  }
};

export const getGrainByName = async (name: string): Promise<any> => {
  try {
    if (isOfflineMode) {
      return MOCK_GRAINS.find(g => g.name.toLowerCase() === name.toLowerCase()) || null;
    }
    const response = await fetch(`${BASE_API_URL}/api/grains/${name}`);
    if (!response.ok) throw new Error('Grain not found in API');
    return await response.json();
  } catch (e) {
    return MOCK_GRAINS.find(g => g.name.toLowerCase() === name.toLowerCase()) || null;
  }
};

// Prediction Request
export const uploadAndPredictGrain = async (imageUri: string, notes?: string): Promise<any> => {
  if (isOfflineMode) {
    return simulateOfflinePrediction(imageUri, notes);
  }

  try {
    const formData = new FormData();
    
    // Construct file payload
    const filename = imageUri.split('/').pop() || 'grain_scan.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    
    // React Native FormData expects an object representation of the file
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: type
    } as any);
    
    if (notes) {
      formData.append('notes', notes);
    }

    const response = await fetch(`${BASE_API_URL}/api/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error("API scan failed");
    return await response.json();
  } catch (e) {
    console.warn("Server prediction failed. Falling back to offline simulator.", e);
    return simulateOfflinePrediction(imageUri, notes);
  }
};

// Simulate local ML classification
const simulateOfflinePrediction = async (imageUri: string, notes?: string): Promise<any> => {
  // Wait a small delay to simulate processing animation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Pick random class
  const randomGrain = MOCK_GRAINS[Math.floor(Math.random() * MOCK_GRAINS.length)];
  const confidence = parseFloat((0.80 + Math.random() * 0.18).toFixed(4)); // 80% to 98%
  
  scanCounter++;
  const newScan = {
    id: scanCounter,
    grain_type: randomGrain.name,
    confidence: confidence,
    image_path: imageUri, // Local file uri works on device
    notes: notes || 'Offline scanning mode',
    created_at: new Date().toISOString(),
    grain_details: randomGrain
  };
  
  // Save to offline history list
  mockHistoryList.unshift(newScan);
  
  return newScan;
};

// History management
export const getScanHistory = async (): Promise<any[]> => {
  try {
    if (isOfflineMode) return mockHistoryList;
    
    const response = await fetch(`${BASE_API_URL}/api/history`);
    if (!response.ok) throw new Error("Could not fetch API history");
    const apiHistory = await response.json();
    
    // Prepend API URL to images if it's a relative path
    return apiHistory.map((scan: any) => ({
      ...scan,
      image_path: scan.image_path.startsWith('/') ? `${BASE_API_URL}${scan.image_path}` : scan.image_path
    }));
  } catch (e) {
    console.warn("API history fetch failed. Loading local offline scans.");
    return mockHistoryList;
  }
};

export const deleteScanRecord = async (scanId: number): Promise<boolean> => {
  try {
    if (isOfflineMode) {
      mockHistoryList = mockHistoryList.filter(s => s.id !== scanId);
      return true;
    }
    
    const response = await fetch(`${BASE_API_URL}/api/history/${scanId}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (e) {
    mockHistoryList = mockHistoryList.filter(s => s.id !== scanId);
    return true;
  }
};

export const clearLocalHistory = () => {
  mockHistoryList = [];
};

// Analytics Dashboard fetch
export const getAnalyticsData = async (): Promise<any> => {
  try {
    if (isOfflineMode || mockHistoryList.length > 0 && !await checkServerHealth()) {
      return computeOfflineAnalytics();
    }
    const response = await fetch(`${BASE_API_URL}/api/analytics`);
    if (!response.ok) throw new Error("Could not fetch API analytics");
    return await response.json();
  } catch (e) {
    return computeOfflineAnalytics();
  }
};

const computeOfflineAnalytics = () => {
  const total = mockHistoryList.length;
  if (total === 0) {
    return {
      total_scans: 0,
      average_confidence: 0.0,
      class_distribution: {},
      scan_history_by_date: {}
    };
  }
  
  const sumConf = mockHistoryList.reduce((acc, curr) => acc + curr.confidence, 0);
  const avg = sumConf / total;
  
  const dist: Record<string, number> = {};
  const history: Record<string, number> = {};
  
  mockHistoryList.forEach(s => {
    dist[s.grain_type] = (dist[s.grain_type] || 0) + 1;
    const dateStr = s.created_at.split('T')[0];
    history[dateStr] = (history[dateStr] || 0) + 1;
  });
  
  return {
    total_scans: total,
    average_confidence: avg,
    class_distribution: dist,
    scan_history_by_date: history
  };
};
