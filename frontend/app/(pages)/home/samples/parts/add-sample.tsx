"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewSampleForm from "./new-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddSampleButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Sample</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Sample</DialogTitle>
        </DialogHeader>
        <NewSampleForm />
      </DialogContent>
    </Dialog>
  );
}
