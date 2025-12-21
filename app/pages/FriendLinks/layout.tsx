import React, {Suspense} from "react";

const FriendLinks = ({children,}: { children: React.ReactNode; })=>{
    return (
        <>
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </main>
        </>
    )
}
export default FriendLinks