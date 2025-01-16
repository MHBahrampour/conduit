export const handleError = (error: any) => {
  if (error.isAxiosError) {
    const responseData = error.response?.data;

    if (responseData && responseData.error) {
      alert(responseData.error);
    } else {
      alert("An unexpected error occurred.");
    }
  } else {
    throw new Error("Unhandled error type: " + error);
  }
};
