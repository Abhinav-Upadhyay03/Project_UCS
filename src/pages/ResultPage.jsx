import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const { shape, boundaryCondition, initialCondition, result } = location.state || {};

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800">Result</h2>
      <div className="mt-4">
        <p><strong>Shape:</strong> {shape}</p>
        <p><strong>Boundary Condition:</strong> {boundaryCondition}</p>
        <p><strong>Initial Condition:</strong> {initialCondition}</p>
        <p><strong>Result:</strong> {result}</p>
      </div>
    </div>
  );
};

export default ResultPage;
