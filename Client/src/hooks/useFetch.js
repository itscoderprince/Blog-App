import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, options);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result?.message || res.statusText);
        }

        setData(result);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, trigger, ...dependencies]);

  const reFetch = () => setTrigger(prev => prev + 1);

  return { data, loading, error, reFetch };
};
