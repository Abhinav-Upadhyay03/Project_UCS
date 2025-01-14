import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { inputData, result } = location.state || {};

  const formatKey = (key) =>
    key.replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const formatValue = (value) => (typeof value === 'number' ? value.toFixed(2) : value);

  const renderInputs = () => {
    if (!inputData) return null;

    return Object.entries(inputData).map(([key, value]) => (
      <div key={key} className="mb-2">
        <span className="font-semibold">{formatKey(key)}: </span>
        <span>{formatValue(value)}</span>
      </div>
    ));
  };

  const renderTemperatureData = () => {
    if (!result?.temperature) return null;

    // Create data for the line chart
    const chartData = result.temperature.map((value, index) => ({
      position: index+1,
      temperature: value
    }));

    return (
      <div className="space-y-4">
      {/*
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" label={{ value: 'Position', position: 'bottom' }} />
              <YAxis label={{ value: 'Temperature', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#8884d8" 
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
       */}
      
        <div className="font-mono text-sm overflow-x-auto bg-gray-50 p-4 rounded-lg">
          <div className="font-semibold mb-2">Temperature Values:</div>
          [
          <div className="ml-4">
            {result.temperature.map((value, idx) => (
              <span key={idx}>
                {formatValue(value)}
                {idx < result.temperature.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
          ]
        </div>
      </div>
    );
  };

  if (!location.state) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500">No calculation data available.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const renderImage = () => {
    if (!result?.graph_url) return null;

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Generated Plot</h3>
        <img 
          src={`http://127.0.0.1:5000${result.graph_url}`}
          alt="Temperature Distribution Plot" 
          className="w-full h-auto rounded"
          // Add key to force re-render when URL changes
          key={result.graph_url}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculation Results</h2>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Input Parameters Panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Input Parameters</h3>
          <div className="space-y-2">
            {renderInputs()}
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Temperature Distribution</h3>
          {renderTemperatureData()}
        </div>
      </div>

      {/* Graph Section */}
      {renderImage()}

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
      >
        Back to Calculator
      </button>
    </div>
  );
};

export default ResultPage;