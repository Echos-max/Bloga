"use client";
import { useSpring, animated } from "react-spring";
import { Image } from '@arco-design/web-react';
import "@arco-design/web-react/dist/css/arco.css";
import { useState, useEffect } from "react";
import { apiClient } from "@/app/utils/axios";
import {Avatar} from "@heroui/avatar";

// 类型定义
interface ImageFormat {
  name: string;
  url: string;
  width: number;
  height: number;
}

interface DymixImage {
  id: number;
  url: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
}

interface Tag {
  id: number;
  TagsName: string;
}

interface UserInfo {
  id: number;
  nikName: string;
  userDesc: string;
}

interface DymixItem {
  id: number;
  documentId: string;
  DymixName: string;
  DymixTime: string;
  DymixContent: string;
  tag: Tag;
  userinfo: UserInfo;
  Dymixcover: DymixImage[];
}

interface ApiResponse {
  data: DymixItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
// 头像地址

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
interface UserAvApiResponse {
  data: userAvItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
const Dymix = () => {
  const [dymixList, setDymixList] = useState<DymixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<userAvItem[]>([]);
  const props = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 200, friction: 20 },
  });

  // 获取动态数据
  useEffect(() => {
    const fetchDymixData = async () => {
      try {
        setLoading(true);
        // apiClient 的响应拦截器已经返回了 response.data
        const response: any = await apiClient.get<UserAvApiResponse>("/api/dymixes?populate=*");
        // 安全地设置数据，确保是数组
        const data = response?.data;
        if (Array.isArray(data)) {
          setDymixList(data);
        } else {
          console.warn('动态数据格式不正确，使用空数组');
          setDymixList([]);
        }
        console.log("xwxw", response);
      } catch (error) {
        console.error("获取动态数据失败:", error);
        setDymixList([]); // 确保出错时也是空数组
      } finally {
        setLoading(false);
      }
    };
    // 头像地址
    const fetchDataAvator = async () => {

      try{
        const response: any = await apiClient.get('/api/userinfos?populate=*');
        if (Array.isArray(response?.data)) {
          setAvatarUrl(response.data);
        } else {
          setAvatarUrl([]);
        }
        console.log("用户信息头像:", response.data);
      }catch(error){
        console.error("获取用户信息失败:", error);
        setAvatarUrl([]);
      }
    }
    fetchDymixData();
    fetchDataAvator()
  }, []);

  if (loading) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  return (
    <>
      <div className="space-y-4 min-md:w-full ">
        {dymixList.map((item) => (
          //   用户头像
          <div key={item.id} className="bg-white rounded-lg ">
            {/* 头像和内容区域 */}
            <div className="p-4 flex">
              {/* 头像 - 圆形 */}
              <animated.div style={props} className="flex-shrink-0 mr-3">
                <div className="w-14  h-full  overflow-hidden relative  ">
                  {avatarUrl.map((Item)=>{
                    const avatarImageUrl = Item.userAv?.url || "";
                    const avatarFullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${avatarImageUrl}`;
                    return(
                        <div key={Item.id} className=" w-10 h-10 sm:w-14 sm:h-14 md:w-14 md:h-14 md:rounded-xl ">
                          <Avatar
                              className="w-full h-full rounded-sm"
                              src={avatarFullUrl}
                          />
                        </div>
                    );
                  })
                  }
                </div>
              </animated.div>
              {/* 右侧内容 */}
              <animated.div style={props} className="flex-1 min-w-0">
                {/* 顶部信息：名称和时间 */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600 text-lg">
                      {item.userinfo.nikName}
                    </span>
                    {item.tag && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {item.tag.TagsName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.DymixTime}
                  </span>
                </div>
                <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap break-words mb-3">
                  {item.DymixContent}
                </div>
                {/* 图片展示区域 */}
                {
                  // Normalize Dymixcover to an array in case API returns a single object
                  (() => {
                    const covers = Array.isArray(item.Dymixcover)
                      ? item.Dymixcover
                      : item.Dymixcover
                      ? [item.Dymixcover]
                      : [];
                    if (!covers || covers.length === 0) return null;

                    // 新的网格：固定 3 列正方形缩略图，最多展示 6 张，超过在第6张显示剩余数量
                    return (
                      <Image.PreviewGroup>
                        <div className="grid grid-cols-3 gap-2">
                          {covers.slice(0, 6).map((image: any, idx: number) => {
                            const rawUrl =
                              image?.formats?.medium?.url ||
                              image?.formats?.small?.url ||
                              image?.url ||
                              image?.formats?.large?.url ||
                              "";
                            const base = (
                              process.env.NEXT_PUBLIC_API_BASE_URL || ""
                            ).replace(/\/$/, "");
                            const finalUrl = rawUrl.startsWith("http")
                              ? rawUrl
                              : `${base}${rawUrl}`;
                            try {
                              console.log("Resolved image URL:", finalUrl);
                            } catch (e) {}

                            const isLastShown = idx === 5 && covers.length > 6;

                            return (
                              <div
                                key={image.id || idx}
                                className="relative aspect-square    overflow-hidden rounded-md "
                              >
                                {isLastShown ? (
                                  <>
                                    <Image
                                        className="w-full h-full object-cover"
                                        src={finalUrl}
                                        alt='lamp'
                                        preview
                                    />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xl font-semibold pointer-events-none">
                                      {`+${covers.length - 6}`}
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                      simple

                                      className="w-96 h-full object-cover"
                                      src={finalUrl}
                                      alt='lamp'
                                      preview
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Image.PreviewGroup>
                    );
                  })()
                }
              </animated.div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dymix;
