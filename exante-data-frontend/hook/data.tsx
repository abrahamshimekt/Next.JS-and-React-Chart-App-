import { fetchData } from "@/lib/apiClient";
import { useQuery } from "react-query";

const useData = () => {
  return useQuery("data", fetchData);
};

export default useData;
