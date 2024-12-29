import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputData, result } = location.state || {};

  const formatValue = (key, value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const renderInputs = () => {
    if (!inputData) return null;

    return Object.entries(inputData).map(([key, value]) => {
      // Format the key for display
      const displayKey = key.replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return (
        <div key={key} className="mb-2">
          <span className="font-semibold">{displayKey}: </span>
          <span>{formatValue(key, value)}</span>
        </div>
      );
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!inputData) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <p>No data available</p>
        <button 
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Calculation Results</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Input Parameters</h3>
          {renderInputs()}
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <div className="text-xl font-bold text-blue-600">
            {formatValue('result', result)}
          </div>
        </div>
      </div>

      <button 
        onClick={handleBack}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
      >
        Back to Calculator
      </button>
    </div>
  );
};

export default ResultPage;