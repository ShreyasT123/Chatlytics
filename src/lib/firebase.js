import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// src/lib/db-utils.js

const COLLECTION_NAME = 'MainChartData';

// Sample data structure
const MainchartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
];

// Function to insert data
export async function insertMainChartData(data) {
  try {
    // Option 1: Insert all documents in a batch
    const batch = [];
    for (const item of data) {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), item);
      batch.push(docRef);
    }
    console.log('Data inserted successfully');
    return batch;
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}

// Function to get all data
export async function getMainChartData() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Example usage:
// // Insert data
// async function populateDatabase() {
//   try {
//     await insertMainChartData(MainchartData);
//     console.log('Database populated successfully');
//   } catch (error) {
//     console.error('Error populating database:', error);
//   }
// }

// Fetch data
export async function fetchData() {
  const data = await getMainChartData();
  if (data) {
    console.log('MainChartData:', data);
  }
}

// Run the functions
// populateDatabase(); // Uncomment to populate database
// await fetchData(); // Uncomment to fetch data

// Example of how to use in a component:
/*
import { getMainChartData } from '@/lib/db-utils';

export default function ChartComponent() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchChartData() {
      const data = await getMainChartData();
      if (data) {
        setChartData(data);
      }
    }
    fetchChartData();
  }, []);

  return (
    // Your chart component using the data
  );
}
*/