"use client";

import { useState } from "react";
import { DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import NoiseOverlay from "@/components/noise-overlay";
import { updateDocumentDescription } from "@/actions/documents/update";

export default function EditDescription({ documentId, initialDescription }: { documentId: string, initialDescription: string }) {
    const [description, setDescription] = useState(initialDescription);

    return (
        <DrawerContent className="max-h-[85vh] h-full px-4 pt-4">
            <NoiseOverlay />
            <div className="flex w-full h-full bg-popover rounded-t-lg z-10 shadow-xl pt-5 justify-center">
                <div className="max-w-[40%] w-full flex flex-col gap-5">
                    <h1 className="text-2xl font-semibold">Edit Description</h1>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">I want to write a...</Label>
                        <Textarea placeholder="A blog about..." className="text-2xl" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <DrawerClose asChild>
                            <Button className="w-full" onClick={() => {
                                updateDocumentDescription(documentId, description);
                            }}>Save</Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">Cancel</Button>
                        </DrawerClose>
                    </div>
                </div>
            </div>
        </DrawerContent>
    )
}