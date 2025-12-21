"use client"

export default function RightSidebar() {
    return (
        <aside className="lg:block xl:block lg:col-span-4 md:hidden sm:hidden max-lg:hidden xl:col-span-3">
            <div className="bg-white rounded-xl w-full max-w-sm p-4 md:p-6 sticky top-8">
                <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">最近回复：</h3>
                <div className="space-y-3 md:space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2 md:gap-3 bg-[#f8f9fb] p-2 md:p-3 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm text-gray-600 break-words">
                                    <span className="font-medium">用户{i + 1}</span>：就是真的很牛逼啊
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}