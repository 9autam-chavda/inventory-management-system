export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data && typeof data === "object") {
    const firstMessage = Object.values(data).find(Boolean);

    if (firstMessage) {
      return firstMessage;
    }
  }

  return fallback;
};
