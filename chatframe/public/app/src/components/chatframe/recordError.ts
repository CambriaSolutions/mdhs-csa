export async function recordError(error: Error, reportErrorUrl: string) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error)
  };
  const response = await fetch(reportErrorUrl, requestOptions)
  if (response.status !== 200) {
    console.error(response.json())
  }
}