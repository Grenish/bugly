type ErrorResponse = {
  json: () => Promise<unknown>;
  status: number;
  statusText?: string;
  errMessage?: string;
};

export async function getErrorMessage(response: ErrorResponse) {
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === "string" && data.error.length > 0) {
      return data.error;
    }
  } catch {
    // Ignore invalid error payloads and fall back to the errMessage below
  }

  return (
    response.errMessage || response.statusText || `Request failed with status ${response.status}`
  );
}
