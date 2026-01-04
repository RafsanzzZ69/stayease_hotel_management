import { useState } from "react";
import { Button } from './ui/button';
import { Input } from "./ui/input";
import {  Textarea } from "./ui/textarea";

const RatingModal = ({ open, onClose, booking, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Rate Booking #{booking._id}</h2>
        
        <div className="mb-4">
          <label className="block mb-1 font-medium">Rating (1-5)</label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Feedback</label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              onSubmit({ bookingId: booking._id, rating, feedback });
              onClose();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
