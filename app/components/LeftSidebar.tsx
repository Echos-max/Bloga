"use client";
import Image from "next/image";
import { RiArticleLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { apiClient } from "../utils/axios";

interface ImageFormat {
  name: string;
  url: string;
  width: number;
  height: number;
}

interface LeftBannerCover {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

interface LeftBannerItem {
  id: number;
  documentId: string;
  LeftBanner: LeftBannerCover;
}

interface LeftBannerResponse {
  data: LeftBannerItem[];
}

export default function LeftSidebar() {
  const [LeftBanner, setLeftBanner] = useState<LeftBannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<LeftBannerResponse>(
          "/api/left-banners?populate=*"
        );
        console.log("API 响应数据:", response);
        if (Array.isArray(response.data)) {
          setLeftBanner(response.data);
        }
      } catch (error) {
        console.error("获取左侧横幅数据失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <aside className="hidden lg:block lg:col-span-3">
        <div className="bg-white rounded-xl w-full max-w-sm p-3 md:p-4 sticky top-8">
          <div className="w-full h-28 sm:h-32 md:h-36 flex items-center justify-center">
            Loading...
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="bg-white rounded-xl w-full max-w-sm p-3 md:p-4 sticky top-8">
        {LeftBanner.map((item) => {
          const imageUrl = item.LeftBanner?.url || "";
          console.log('我是左侧图片');
          
          console.log('woshitupian1',imageUrl);
          
          const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;
          return (
            <div
              key={item.id}
              className="w-full h-28 sm:h-32 md:h-36 relative rounded-md overflow-hidden mb-4"
            >
                    <Image
                    src={fullUrl}
                    alt='Left Banner'
                    fill
                    className="object-cover"
                    unoptimized  // 加这一行，直接用原图，不走优化
                    />
            </div>
          );
        })}

        {/* 最热 */}
        <div className="w-full h-12 sm:h-14 md:h-16 flex items-center justify-center mt-2">
          <div className="flex-1 flex items-center justify-center text-sm md:text-base font-medium">
            Best of the Hot
          </div>
          <div className="flex items-center justify-center">
            <RiArticleLine color="#EA7A" size={20} />
          </div>
        </div>
        <div className="w-full h-auto flex items-center justify-center p-1 flex-wrap">
          <div className="w-1/2 h-10 bg-amber-100 rounded-md flex flex-col items-center justify-center text-sm">
            文章
          </div>
        </div>
      </div>
    </aside>
  );
}
