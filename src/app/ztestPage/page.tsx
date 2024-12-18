'use client';

import { useState, useRef } from "react";
import { TbHandStop, TbPointer } from "react-icons/tb";

export default function ZoomableDivWithHandToolToggle() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const [cursorMode, setCursorMode] = useState<"normal" | "hand">("normal"); // State for cursor mode

  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleCursorMode = () =>{
    setCursorMode((prevMode) => (prevMode === "normal" ? "hand" : "normal"));
  }

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
          {/* BUTTON HAND TOOL */}
          <div className="fixed flex items-center mr-2 mb-2 bottom-0 right-0">
            <button
              onClick={toggleCursorMode}
              className={`p-2 rounded ${
                cursorMode === "hand" ? "bg-green-500 text-white" : "bg-gray-300 text-black"
              }`}
            >
              {cursorMode === "hand" ? <TbHandStop size={30}/> : <TbPointer size={30}/>}
            </button>
          </div>
          {/* content */}
          <div className={`flex flex-wrap gap-2 p-5 border-b-2 border-x-2 rounded-b-xl ${ cursorMode === "hand" ? "select-none" : ""}`}>
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
