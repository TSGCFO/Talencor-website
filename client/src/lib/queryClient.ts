import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// <ApiRequestSnippet>
// This function makes API calls (like sending a letter to a server)
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // <ArgumentValidationSnippet>
  // Check if arguments are in the correct order (like checking address before mailing)
  // Common HTTP methods are GET, POST, PUT, DELETE, PATCH
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  
  // If method looks like a URL path, the arguments are probably swapped
  if (method.startsWith('/') || method.startsWith('http')) {
    throw new Error(`apiRequest: Arguments appear to be in wrong order. Expected apiRequest(method, url, data) but got apiRequest('${method}', '${url}', ...)`);
  }
  
  // Check if method is valid
  if (!validMethods.includes(method.toUpperCase())) {
    throw new Error(`apiRequest: Invalid HTTP method '${method}'. Expected one of: ${validMethods.join(', ')}`);
  }
  // </ArgumentValidationSnippet>

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
// </ApiRequestSnippet>

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
