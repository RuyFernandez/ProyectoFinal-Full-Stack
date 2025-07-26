import React from 'react';

export function Documentation({ documentation }) {
  if (!documentation) {
    return <div className="documentation"><p>Documentación no disponible</p></div>;
  }

  return (
    <div className="documentation">
      <h1>{documentation.title}</h1>
      <p className="description">{documentation.description}</p>
      
      {documentation.sections?.map((section, index) => (
        <div key={index} className="documentation-section">
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          
          {section.example && (
            <div className="example">
              <h4>Ejemplo:</h4>
              
              <div className="example-request">
                <h5>Solicitud:</h5>
                <pre>
                  <code>
                    {section.example.request.method} {section.example.request.url}
                    {JSON.stringify(section.example.request.body, null, 2)}
                  </code>
                </pre>
              </div>
              
              <div className="example-response">
                <h5>Respuesta:</h5>
                <pre>
                  <code>
                    {JSON.stringify(section.example.response.body, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}
          {section.endpoints && (
            <div className="endpoints-list">
              <h4>Endpoints:</h4>
              <ul>
                {section.endpoints.map((endpoint, i) => {
                  const endpointText = typeof endpoint === 'string' ? endpoint : endpoint.endpoint;
                  
                  return (
                    <li key={i}>
                      <span className="endpoint-path">{endpointText}</span>
                      {typeof endpoint === 'object' && endpoint.description && (
                        <p className="endpoint-description">{endpoint.description}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {section.errors && (
            <div className="errors-list">
              <h4>Errores:</h4>
              <ul>
                {section.errors.map((error, i) => (
                  <li key={i}>
                    <strong>{error.status}</strong>: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}