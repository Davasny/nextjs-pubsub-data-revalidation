import { useGetApiData } from "@/api/useGetApiData";

export const ShowData = () => {
  const { data, isLoading } = useGetApiData("/api/dummy");

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (data) {
    return <div>{JSON.stringify(data)}</div>;
  }

  return <div>no data</div>;
};
