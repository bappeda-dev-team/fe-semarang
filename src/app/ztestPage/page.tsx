'use client';

// import { useState } from "react";

// export default function ZoomPage() {
//   const [scale, setScale] = useState(1);

//   const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2)); // Max 2x zoom
//   const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5)); // Min 0.5x zoom

//   return (
//     <div className="flex flex-col items-center p-4">
//       <div
//         className="border p-4"
//         style={{
//           transform: `scale(${scale})`,
//           transformOrigin: "center",
//           transition: "transform 0.3s ease",
//         }}
//       >
//         <p>Ini adalah konten yang bisa di-zoom.</p>
//       </div>
//       <div className="mt-4 space-x-2">
//         <button onClick={handleZoomIn} className="p-2 bg-blue-500 text-white rounded">
//           Zoom In
//         </button>
//         <button onClick={handleZoomOut} className="p-2 bg-red-500 text-white rounded">
//           Zoom Out
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState, useRef } from "react";

export default function ZoomableDivWithHandToolToggle() {
  const [zoom, setZoom] = useState(100); // Zoom level in percentage
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal"); // State for cursor mode

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200)); // Max 200%
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50)); // Min 50%

  const toggleCursorMode = () =>
    setCursorMode((prevMode) => (prevMode === "normal" ? "hand" : "normal"));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cursorMode === "normal") return; // Ignore if cursor is normal
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      setScrollStart({
        x: containerRef.current.scrollLeft,
        y: containerRef.current.scrollTop,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const dx = dragStart.x - e.clientX;
    const dy = dragStart.y - e.clientY;
    containerRef.current.scrollLeft = scrollStart.x + dx;
    containerRef.current.scrollTop = scrollStart.y + dy;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center p-5">
      {/* Zoom Control and Cursor Toggle Buttons */}
      <div className="flex items-center space-x-3 mb-4">
        <button onClick={handleZoomIn} className="p-2 bg-blue-500 text-white rounded">
          Zoom In
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-red-500 text-white rounded">
          Zoom Out
        </button>
        <button
          onClick={toggleCursorMode}
          className={`p-2 rounded ${
            cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {cursorMode === "hand" ? "Switch to Normal Cursor" : "Switch to Hand Tool"}
        </button>
      </div>

      {/* Bounding Box */}
      <div
        className="border-2 border-gray-400 rounded-lg overflow-hidden w-full h-screen"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Scrollable & Zoomable Content */}
        <div
          ref={containerRef}
          className="relative h-full w-full overflow-scroll"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            cursor: cursorMode === "hand" ? (isDragging ? "grabbing" : "grab") : "default", // Cursor style
          }}
        >
          <div
            className="flex flex-wrap gap-2 p-5 border-b-2 border-x-2 rounded-b-xl"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease",
            }}
          >
            {/* Example Content */}
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
            <div className="p-4 bg-gray-200 rounded shadow">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste magnam odit corrupti suscipit officia accusamus incidunt necessitatibus vitae id porro? Ipsum et ut doloribus officiis a praesentium laudantium animi velit!</div>
          </div>
        </div>
      </div>
    </div>
  );
}