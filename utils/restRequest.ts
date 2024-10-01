// ./utils/restRequest.ts

// Define a generic type for options passed into the request
type RestRequestOptions<B> = {
  url: string; // URL endpoint to which the request is sent
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // HTTP method (default is "GET")
  headers?: Record<string, string>; // Optional headers for the request
  body?: B; // Optional body for the request, can be any type
};

// A generic fetch wrapper function that handles REST API requests
async function restRequest<T, B = undefined>({
  url,
  method = "GET", // Default method is GET
  headers = {}, // Default headers are an empty object
  body, // Optional body for requests like POST or PUT
}: RestRequestOptions<B>): Promise<T> {
  try {
    // Send a fetch request with the provided options
    const response = await fetch(url, {
      method, // Use the specified HTTP method
      headers: {
        "Content-Type": "application/json", // Set content type to JSON by default
        ...headers, // Merge additional headers passed in
      },
      body: body ? JSON.stringify(body) : undefined, // Stringify the body if provided
    });

    // If the response is not successful, parse and throw an error
    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      console.log("🚨🚨🚨🚨 ~ error data:", errorData); // Log error details

      throw new Error(
        errorData?.message || errorData?.error?.message || response.statusText
      ); // Throw the error with a message
    }

    // If the response status is 204 (No Content), return an empty object
    if (response.status === 204) {
      return {} as T;
    }

    // Parse the successful response as JSON and return it
    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error("Error in restRequest:", error); // Log any errors that occur during the request
    throw error; // Rethrow the error to be handled by the caller
  }
}

export default restRequest;
