'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AddNewSessionDialog = () => {
  const [note, setNote] = useState();

  const handleStartConsultation = () => {
    // TODO: Handle submit logic here (e.g., API call)
    alert("Consultation started with details: " + note);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg sm:rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            New Consultation Details
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 text-sm text-gray-600">
              Please provide your symptoms or any other details you'd like the doctor to know before starting.
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe your symptoms or details here..."
                className="mt-4 h-40 resize-none"
                aria-label="Consultation details"
              />
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-3 mt-6">
          <DialogClose asChild>
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!note} variant="secondary" size="md" onClick={handleStartConsultation}>
            Start Consultation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
