"use client";
import { Image } from '@arco-design/web-react';
import "@arco-design/web-react/dist/css/arco.css";
import { useEffect, useState } from "react";
import { apiClient } from "@/app/utils/axios";

// 接口类型定义
interface ImageFormat {
  name: string;
  url: string;
  width: number;
  height: number;
}

interface AlbumCover {
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

interface Sort {
  id: number;
  documentId: string;
  sortsName: string;
}

interface AlbumItem {
  id: number;
  documentId: string;
  AlbumCover:AlbumCover;
  sort?: Sort | null;
}

interface ApiResponse {
  data: AlbumItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const MyComponent = () => {
  const [albumList, setAlbumList] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 请求数据
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<ApiResponse>('/api/albums?populate=*');
        if (Array.isArray(response.data)) {
          setAlbumList(response.data);
        }
        console.log('相册数据:', response);
      } catch (error) {
        console.error('获取相册数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumData();
  }, []);

  // 加载状态
  if (loading) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  return (
    <div className="album flex flex-row w-full justify-center items-center gap-2 flex-wrap
      min-lg:flex
    ">
      <Image.PreviewGroup>
        {albumList.map((item) => {
          // 获取第一张图片
          const imageUrl = item.AlbumCover?.url || "";


         const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;


          return (
            <div key={item.id} className="aspect-square h-44 overflow-hidden rounded-lg relative
            ">
              <Image
                src={fullUrl}
                alt="basic"
                className="object-cover"
                width={400}
                height={400}
                preview
              />
            </div>
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
};

export default MyComponent;
