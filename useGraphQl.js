import { useState, useEffect, useCallback, useRef } from 'react';


const useGraphQL = (query='', header = {}, method = 'POST') => {
  // Get token from sessionStorage
  const token = sessionStorage.getItem('accessToken') || "" 
  const defaultHeader = {
    'Content-Type': 'application/json',
    'x-access-token':token,
  };
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cancelQuery = useRef(false)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(env.url, {
        method: method,
        headers: {
          ...defaultHeader,
          ...header
        },
        body: JSON.stringify({ query })
      });
      const responseData = await response.json();

      if(cancelQuery.current) return
      if(!response.ok){
        setError(error?.message || "Server Not respon")
        throw new Error(responseData.errors[0].message);
      }
      setData(responseData);
    } catch (error) {
      if(cancelQuery.current) return
      setError(error?.message || 'something went wrong');
    } finally {
      setLoading(false);
    }}, [query])

  useEffect(() => {
   cancelQuery.current = false
    fetchData();
    return ()=>{cancelQuery.current=true}
  }, [fetchData]);

  return { data, loading, error };
};

export default useGraphQL;
