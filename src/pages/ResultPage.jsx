import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResultPage = () => {
  const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { inputData } = location.state || {};

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

  const renderMatrix = (data) => {
    if (!Array.isArray(data.temperature)) return formatValue(data.result);

    return (
      <div className="font-mono text-sm overflow-x-auto">
        [
        {data.temperature.map((row, idx) => (
          <div key={idx} className="ml-4">
            [{row.join(', ')}]{idx < data.temperature.length - 1 ? ',' : ''}
          </div>
        ))}
        ]
      </div>
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!inputData) {
      setError('No input data provided.');
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await api.post('/api/line/', inputData);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Network error occurred.');
      }
    };

    fetchResults();
  }, [inputData]);

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Calculation Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Input Parameters Panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Input Parameters</h3>
          <div className="space-y-2">
            {renderInputs()}
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Result</h3>
          <div className="text-blue-600">
            {renderMatrix(data)}
          </div>
        </div>
      </div>

      {/* Graph Section */}
      {/* {data.graph_url && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Visualization</h3>
          <img 
            src={`http://127.0.0.1:5000/static/line_graph.png`} 
            alt="Result Graph" 
            className="w-full h-auto rounded"
          />
        </div>
      )} */}

      <button
        onClick={handleBack}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full md:w-auto"
      >
        Back to Calculator
      </button>
    </div>
  );
};

export default ResultPage;