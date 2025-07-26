import endpointsData from "../endpoint.json";

export function Tabs({ toggleContent, selectedEndpoint }) {
    // Access the endpoints array from the imported data
    const endpoints = endpointsData.endpoints || [];
    
    return (
        <div className="list-tabs">
            {endpoints.map((item, index) => (
                <div 
                    key={`${item.method}-${item.endpoint}-${index}`}
                    className={`endpoint ${selectedEndpoint?.endpoint === item.endpoint ? 'active' : ''}`} 
                    onClick={() => toggleContent(item)}
                >
                    <span className="endpoint-title">{item.title}</span>
                    <small className={`chip ${item.method.toLowerCase()}`}>
                        {item.method}
                    </small>
                </div>
            ))}
        </div>
    )
}