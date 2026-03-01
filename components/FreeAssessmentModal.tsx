// FreeAssessmentModal.tsx
import React from "react";

const FreeAssessmentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Free Assessment</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="09xx..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal (Optional)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Fat loss / Strength / Conditioning"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Schedule (Optional)</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Weeknights / Saturdays"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-orange-500 text-white py-2 rounded-full"
            >
              Submit
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default FreeAssessmentModal;
