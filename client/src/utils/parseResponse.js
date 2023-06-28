export async function parseResponse(response) {
    const responseText = await response.text();
    try {
        console.log(JSON.parse(responseText) ? JSON.parse(responseText) : null);
        return JSON.parse(responseText) ? JSON.parse(responseText) : null;
    } catch (err) {
        return null;
    }
};