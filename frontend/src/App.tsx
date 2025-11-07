import React from "react";
import "./App.css";
import { useEffect } from "react";

export interface SampleContent {
  title: string;
  content: string;
}

function App() {
  const [array, setArray] = React.useState<SampleContent[]>([]);

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
      <div className="box">
        {array.map((sampleContent, index) => (
          <section key={index}>
            <h1>{sampleContent.title}</h1>
            <p>{sampleContent.content}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

export default App;
