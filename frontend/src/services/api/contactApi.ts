import type { ContactFormValues, ContactResponse } from "@/types/contact";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() || "http://localhost:4000";

/**
 * Sends a contact form request to the backend API.
 *
 * @async
 * @param values - Contact form values.
 * @returns API success response.
 * @throws Error when the API response is not successful.
 */
export async function sendContactMessage(values: ContactFormValues): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  });

  const payload = (await response.json()) as ContactResponse;

  if (!response.ok) {
    throw new Error(payload.message || "Could not send contact message");
  }

  return payload;
}
