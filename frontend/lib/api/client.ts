const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://jobify-d6na.onrender.com/api";


export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; [key: string]: any }> {
  const token = typeof window !== "undefined" ? (localStorage.getItem("jobify_token") || localStorage.getItem("token")) : null;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
        statusCode: res.status,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Is the backend server running?",
    };
  }
}
