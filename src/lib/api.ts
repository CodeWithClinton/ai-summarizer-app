import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://localhost:8000/api",
    baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function productList() {
  try {
    const response = await apiClient.get("/products/");
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || err.message);
    }
  }
}



export async function productDetail(slug: string) {
  try {
    const response = await apiClient.get(`/products/${slug}/`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || err.message);
    }
  }
}


export async function generateReviewSummary(slug: string) {
  try {
    const response = await apiClient.post(`/products/${slug}/generate-summary/`);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || err.message);
    }
  }

}



export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}




