"use client"
import {Spinner} from "@heroui/react";
export default function Loading() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center p-4">
            <Spinner label="default" variant="default" />
        </div>
    );
}