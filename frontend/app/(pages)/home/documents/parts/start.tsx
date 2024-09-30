"use client";

import {
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createDocumentThenRedirect } from "@/actions/documents/create";

export default function StartDialog() {
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createDocumentThenRedirect(content);
    };

    return (
        <>
        <DialogContent className="p-2">
            <div className="noise inset-0 absolute shadow-inner"></div>
            <div className="p-8 bg-popover z-10 rounded-lg shadow-inner border border-border">
                <form onSubmit={handleSubmit}>
                    <DialogTitle className="text-2xl font-bold">I want to write...</DialogTitle>
                    <Textarea 
                        className="text-2xl mt-4 z-20" 
                        placeholder="a blog about..." 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">This is just a starting point, you can change this later</p>
                    <DialogFooter className="mt-8">
                        <Button type="submit" className="w-full">Start</Button>
                    </DialogFooter>
                </form>
            </div>
        </DialogContent>
        </>
    );
}