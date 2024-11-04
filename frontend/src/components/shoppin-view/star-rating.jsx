import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

const StarRatingComponent = ({ rating, handleRatingChange }) => {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      variant="outline"
      className={`p-2 rounded-full transition-colors mr-2 *
        ${
          star <= rating
            ? "text-yellow-500 hover:bg-black hover:text-yellow-500"
            : "text-black hover:bg-primary hover:text-primary-foreground"
        }`}
      size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`h-6 w-6 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
};

export default StarRatingComponent;
