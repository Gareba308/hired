"use client"

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModelProps {
    isOpen: boolean;
    onClose: ()=>void;
    onConfirm: ()=>void;
    loading: boolean;
}

export const ResendAlertModal: React.FC<AlertModelProps> =({
    isOpen,
    onClose,
    onConfirm,
    loading
})=>{

    return (
        <Modal
            title="Are you absolutely sure?"
            description="Are you sure you would like to obtain another verification email again?"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant='outline' onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant='default' onClick={onConfirm}>Continue</Button>
            </div>
        </Modal>
    )
}