import { useState } from "react";
import { Tabs } from "./components/Tabs";
import { Content } from "./components/Content";
import { Documentation } from "./components/Documentation";
import "./style.css";
import endpoint from "./endpoint.json";

export default function App() {
  const [activeTab, setActiveTab] = useState('documentation');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  const toggleContent = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setActiveTab('endpoint');
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>API Documentation</h1>
        <nav className="main-tabs">
          <button 
            className={activeTab === 'documentation' ? 'active' : ''}
            onClick={() => setActiveTab('documentation')}
          >
            Documentación
          </button>
          <button 
            className={activeTab === 'endpoint' ? 'active' : ''}
            onClick={() => setActiveTab('endpoint')}
          >
            Endpoints
          </button>
        </nav>
      </header>
      
      <section className="content">
        {activeTab === 'documentation' ? (
          <Documentation documentation={endpoint.documentation} />
        ) : (
          <>
            <Tabs toggleContent={toggleContent} selectedEndpoint={selectedEndpoint} />
            <Content content={selectedEndpoint || endpoint.endpoints[0]} />
          </>
        )}
      </section>
    </div>
  );
}
