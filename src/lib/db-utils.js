import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'MainChartData';

// Sample data structure
const MainchartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
];

// Function to insert data
export async function insertMainChartData(data) {
  try {
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