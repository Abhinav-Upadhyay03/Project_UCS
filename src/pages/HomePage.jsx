import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";

const HomePage = () => {
  const [selectedShape, setSelectedShape] = useState("");
  const [boundaryCondition, setBoundaryCondition] = useState({
    top: "",
    bottom: "",
    left: "",
    right: "",
  });
  const [initialCondition, setInitialCondition] = useState("");
  const [dimensions, setDimensions] = useState({
    initialX: "",
    finalX: "",
    time: "",
    // diffusivity: "",
    diameter: "",
    boundaryCondition_left: "",
    boundaryCondition_right: "",
  });

  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const drawShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedShape === "line") {
      const initialX = parseFloat(dimensions.initialX);
      const finalX = parseFloat(dimensions.finalX);
      if (isNaN(initialX) || isNaN(finalX)) return;

      ctx.beginPath();
      ctx.moveTo(initialX, canvas.height / 2);
      ctx.lineTo(finalX, canvas.height / 2);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (selectedShape === "square") {
      const top = parseFloat(boundaryCondition.top);
      const bottom = parseFloat(boundaryCondition.bottom);
      const left = parseFloat(boundaryCondition.left);
      const right = parseFloat(boundaryCondition.right);

      if (!isNaN(top) && !isNaN(left) && !isNaN(right) && !isNaN(bottom)) {
        const height = Math.abs(top - bottom);
        const width = Math.abs(right - left);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.beginPath();
        ctx.rect(centerX - width / 2, centerY - height / 2, width, height);
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    } else if (selectedShape === "circle") {
      const diameter = parseFloat(dimensions.diameter);
      if (isNaN(diameter)) return;

      const radius = diameter / 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.stroke();
    }
  };

  const submitShape = async (e) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let data = {
        time: dimensions.time,
        // diffusivity: dimensions.diffusivity,
        initialCondition: initialCondition,
      };

      switch (selectedShape) {
        case "line":
          endpoint = "/api/line/";
          data = {
            ...data,
            initialX: dimensions.initialX,
            finalX: dimensions.finalX,
            boundaryCondition_left: dimensions.boundaryCondition_left,
            boundaryCondition_right: dimensions.boundaryCondition_right,
          };
          break;
        case "square":
          endpoint = "/api/square/";
          data = {
            ...data,
            top: boundaryCondition.top,
            bottom: boundaryCondition.bottom,
            left: boundaryCondition.left,
            right: boundaryCondition.right,
          };
          break;
        case "circle":
          endpoint = "/api/circle/";
          data = {
            ...data,
            diameter: dimensions.diameter,
          };
          break;
        default:
          throw new Error("Invalid shape selected");
      }

      try {
        const response = await api.post(endpoint, data);
        console.log("Response:", response.data);

        navigate("/result", {
          state: {
            inputData: data,
            result: response.data,
          },
        });
      } catch (error) {
        if (error.response) {
          console.error("Error data:", error.response.data);
          console.error("Error status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        alert(
          "An error occurred while processing your request. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check your inputs and try again.");
    }
  };

  useEffect(() => {
    if (selectedShape) {
      drawShape();
    }
  }, [selectedShape, boundaryCondition, dimensions]);

  const renderShapeInputs = () => {
    const commonInputs = (
      <>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Initial Condition
          </label>
          <input
            type="text"
            value={initialCondition}
            onChange={(e) => setInitialCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <div className="grid grid-cols-2 gap-4"> */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <input
              type="number"
              value={dimensions.time}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, time: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Diffusivity
            </label>
            <input
              type="number"
              value={dimensions.diffusivity}
              onChange={(e) =>
                setDimensions((prev) => ({
                  ...prev,
                  diffusivity: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
        {/* </div> */}
      </>
    );

    if (selectedShape === "line") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Line Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Initial X
              </label>
              <input
                type="number"
                value={dimensions.initialX}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    initialX: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Final X
              </label>
              <input
                type="number"
                value={dimensions.finalX}
                onChange={(e) =>
                  setDimensions((prev) => ({ ...prev, finalX: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Left Boundary
              </label>
              <input
                type="number"
                value={dimensions.boundaryCondition_left}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    boundaryCondition_left: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Right Boundary
              </label>
              <input
                type="number"
                value={dimensions.boundaryCondition_right}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    boundaryCondition_right: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {commonInputs}
        </div>
      );
    }

    if (selectedShape === "square") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Boundary Conditions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Top
              </label>
              <input
                type="number"
                value={boundaryCondition.top}
                onChange={(e) =>
                  setBoundaryCondition((prev) => ({
                    ...prev,
                    top: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bottom
              </label>
              <input
                type="number"
                value={boundaryCondition.bottom}
                onChange={(e) =>
                  setBoundaryCondition((prev) => ({
                    ...prev,
                    bottom: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Left
              </label>
              <input
                type="number"
                value={boundaryCondition.left}
                onChange={(e) =>
                  setBoundaryCondition((prev) => ({
                    ...prev,
                    left: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Right
              </label>
              <input
                type="number"
                value={boundaryCondition.right}
                onChange={(e) =>
                  setBoundaryCondition((prev) => ({
                    ...prev,
                    right: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {commonInputs}
        </div>
      );
    }

    if (selectedShape === "circle") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Boundary Conditions</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Diameter
            </label>
            <input
              type="number"
              value={dimensions.diameter}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, diameter: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {commonInputs}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shape Configuration</h2>
      </div>

      <form className="space-y-6" onSubmit={submitShape}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Shape
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="line"
                checked={selectedShape === "line"}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Line</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="square"
                checked={selectedShape === "square"}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Square</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="circle"
                checked={selectedShape === "circle"}
                onChange={(e) => setSelectedShape(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Circle</span>
            </label>
          </div>
        </div>

        {renderShapeInputs()}

        <div className="mt-6">
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="border border-gray-300 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedShape}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default HomePage;
