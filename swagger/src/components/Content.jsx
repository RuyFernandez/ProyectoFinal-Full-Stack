import { useState, useEffect } from "react";

export function Content({ content }) {
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!content || !content.endpoint) return;
            
            setIsLoading(true);
            try {
                const res = await fetch(content.endpoint);
                const data = await res.json();
                setResponse(JSON.stringify(data, null, 2));
            } catch (error) {
                setResponse(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [content]);
    
    if (!content) {
        return (
            <div className="endpoints-list">
                <p>Selecciona un endpoint para ver los detalles</p>
            </div>
        );
    }

    return (
        <div className="endpoints-list">
            <h3>{content.title}</h3>
            <div className="endpoint-header">
                <span className="endpoint-url">{content.endpoint}</span>
                <small className={`chip ${content.method?.toLowerCase() || 'get'}`}>
                    {content.method}
                </small>
            </div>
            
            {content.description && (
                <p className="description">{content.description}</p>
            )}
            
            <div className="endpoint-meta">
                <small>Requiere autenticación: {content.requiresAuth ? "Sí" : "No"}</small>
                {content.requiresAdmin !== undefined && (
                    <small>Requiere administrador: {content.requiresAdmin ? "Sí" : "No"}</small>
                )}
            </div>
            
            <div className="response-container">
                <h4>Respuesta:</h4>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : (
                    <pre className="response">
                        {response || 'No hay datos para mostrar'}
                    </pre>
                )}
            </div>
        </div>
    );
}