import { useState, useEffect } from 'react'
import axios from 'axios'

const useVehicleTracker = (deviceId) => {
  const [vehicleData, setVehicleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let intervalId

    const fetchVehicleData = async () => {
      try {
        const username = "schoolmaster";
        const password = "123456";

        // Encode the username and password to Base64
        const credentials = btoa(`${username}:${password}`);
        setLoading(true) // Set loading state to true before fetching
        const response = await axios.get(`https://rocketsalestracker.com/api/positions?deviceId=${deviceId}`, {
            headers: {
                Authorization: `Basic ${credentials}`  // Replace with your actual token
            }
        });
        console.log('Length of positions API: ' + response.data[0])

        if (response.data) {
          setVehicleData(response.data) // Update state with fetched data
        } else {
          // setError('No vehicle data found') // Handle case where no data is returned
        }
      } catch (err) {
        // setError('Error fetching vehicle data: ' + err.message) // Set error state
      } finally {
        setLoading(false) // Set loading state to false after fetching
      }
    }

    // Fetch data immediately
    fetchVehicleData()

    // Set up interval to fetch data every few seconds (e.g., 10 seconds)
    intervalId = setInterval(fetchVehicleData, 2500)

    // Clear the interval on component unmount
    return () => clearInterval(intervalId)
  }, [deviceId]) // Depend on deviceId to refetch when it changes

  return { vehicleData, loading, error } // Return the data and states
}

export default useVehicleTracker;