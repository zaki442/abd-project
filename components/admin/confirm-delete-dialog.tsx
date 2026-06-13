'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface ConfirmDeleteDialogProps {
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    isPending?: boolean;
}

export function ConfirmDeleteDialog({
    onConfirm,
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone. This will permanently delete this record from the database.',
    isPending = false
}: ConfirmDeleteDialogProps) {
    const [open, setOpen] = useState(false)

    const handleConfirm = async () => {
        await onConfirm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-500 hover:bg-red-950/20"
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white"
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
