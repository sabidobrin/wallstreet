export const apiResponseHandling = (response) => {
    return {
        responseCode: response.status,
        message: response.statusText
    };
}