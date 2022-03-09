export const mapError = async (
  response: Response,
  defaultErrorMsg = "An error occurred."
): Promise<void> => {
  if (!response.ok) {
    if (response.status == 427) {
      throw Error("Too many requests. Just wait a bit.");
    }
    let error = { error: "" };
    try {
      error = await response.json();
    } catch (error) {
      // nothing to do here
    }
    throw Error("⚠ " + (error.error || defaultErrorMsg));
  }
};
