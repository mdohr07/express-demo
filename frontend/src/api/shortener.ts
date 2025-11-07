export async function createShortLink(url: string) {
  const response = await fetch("http://localhost:8080/shorten", {
    method: "POST", // POST-Anfrage senden
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }), // URL in Body übergeben
  });

  if (!response.ok) {
    throw new Error(
      `Fehler beim Erstellen des Kurzlinks (Status ${response.status})`
    );
  }
  return response.json();
}
