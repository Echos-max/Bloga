"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@heroui/avatar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { useSpring, animated } from "react-spring";
import { useEffect, useState } from "react";
import { apiClient } from "../utils/axios";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

// Banner接口
interface TopBannerItem {
  id: number;
  documentId: string;
  TopBanner: TopBannerCover;
}
interface TopBannerCover {
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
interface ImageFormat {
  name: string;
  url: string;
  width: number;
  height: number;
}
// 头像
interface userAvItem {
  id: number;
  documentId: string;
  userAv: userAv;
}
interface userAv {
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
interface ImageFormat {
  name: string;
  url: string;
  width: number;
  height: number;
}
export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Home页面使用简单布局（不显示Banner和侧边栏）
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <>{children}</>;
  }
  // 动画效果
  // 动效
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const props = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 200, friction: 15 },
  });

  // 数据Banner
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [TopBanner, setTopBanner] = useState<TopBannerItem[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [loading, setLoading] = useState(true);
  // 头像
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [avatarUrl, setAvatarUrl] = useState<userAvItem[]>([]);
  // 请求数据
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<{ data: TopBannerItem }>(
          "/api/top-banners?populate=*"
        );
        if (Array.isArray(response.data)) {
          setTopBanner(response.data);
        }
      } catch (error) {
        console.error("获取顶部横幅数据失败:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDataAvator = async () => {
    
      try{
        const response = await apiClient.get<userAvItem>('/api/userinfos?populate=*');
        if (Array.isArray(response.data)) {
          setAvatarUrl(response.data);
        }
        console.log("用户信息头像:", response.data);
      }catch(error){
        console.error("获取用户信息失败:", error);
      }
    }
    fetchData();
    fetchDataAvator();
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
    <animated.div
      style={props}
      className=" bg-gray-50 flex mt-16 flex-col max-sm:mt-[-9rem]"
    >
      {/* 顶部 Banner */}
      <header className="relative h-72 sm:w-full  sm:h-96 md:h-96 lg:h-72 xl:h-72 w-full mt-[-1rem] max-sm:mt-[2rem]">
        {TopBanner.map((item) => {
          const imageUrl = item.TopBanner?.url || "";
          const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`;

          return (
            <div key={item.id}>
              <Image
                src={fullUrl}
                alt="Banner"
                fill
                className="object-cover w-full h-full"
                unoptimized
              />
            </div>
          );
        })}

        {/* 右上角"头像"按钮 - 响应式定位 */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 md:bottom-8 md:right-12 lg:right-16 xl:right-24">
          {avatarUrl.map((Item)=>{
            const avatarImageUrl = Item.userAv?.url || "";
            const avatarFullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatarImageUrl}`;
            return(
          <div key={Item.id} className="bg-gray-800 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-sm shadow-lg">
            <Avatar
              className="w-full h-full rounded-sm"
              src={avatarFullUrl}
            />
          </div>
            );
          })

          }
        </div>
      </header>

      {/* 主内容区：三栏布局 */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* 左侧栏 */}
        <LeftSidebar />

        {/* 中间主内容 */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col">
          {children}
        </div>

        {/* 右侧栏 */}
        <RightSidebar />
      </div>
    </animated.div>
  );
}
