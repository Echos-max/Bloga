import React, {Suspense} from "react";
export default function ArticlesLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="container mx-auto px-4 py-8" style={{ backgroundColor: '#f8f9fb' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </main>
        </>
    );
}