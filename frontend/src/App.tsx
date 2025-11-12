import React from "react";
import { useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";

import "./App.css";
import { createShortLink } from "./api/shortener";

export interface SampleContent {
  title: string;
  content: string;
}

function App() {
  const [array, setArray] = React.useState<SampleContent[]>([]);

  const [url, setUrl] = React.useState("");
  const [shortLink, setShortLink] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleShorten = async (): Promise<void> => {
    if (!url) {
      setStatus("Du hast da was vergessen ☝️🫤");
      return;
    }

    try {
      const data = await createShortLink(url);
      setShortLink(`http://localhost:8080/${data.shortLink}`);
      setStatus("Kurzlink erstellt ✅");
    } catch (error) {
      setStatus("Fehler: " + (error as Error).message);
    }
  };

  const fetchData = async (): Promise<void> => {
    const response = await fetch("http://localhost:8080"); // Backend-Endpunkt

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setArray([{ title: "Status", content: data.message }]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <Box className="box">
        <TextField
          label="Gib eine URL ein"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          sx={{ maxWidth: 400, mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleShorten}
          sx={{ mb: 2 }}
        >
          Kurzlink erstellen
        </Button>

        {status && <Typography>{status}</Typography>}
        {shortLink && (
          <Typography>
            <p>
              Dein Kurzlink:{" "}
              <a href={shortLink} target="_blank">
                {shortLink}
              </a>
            </p>
          </Typography>
        )}
        {array.map((sampleContent, index) => (
          <section key={index}>
            <hr />
            <p>
              <b>{sampleContent.title}: </b>
              {sampleContent.content}
            </p>
          </section>
        ))}
      </Box>
    </main>
  );
}

export default App;
