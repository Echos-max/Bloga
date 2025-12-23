"use client";

import { Tabs, Tab } from "@heroui/tabs";
import { RiChatAiLine, RiEye2Line } from "@remixicon/react";
import { useSpring, animated } from "react-spring";
import Image from "next/image";
import { useState, useEffect } from "react";
import { apiClient } from "@/app/utils/axios";
import Link from "next/link";

type Article = {
  id: number;
  documentId: string;
  articleName: string;
  artileTime: string;
  artilceDesc: string;
  articleCover: {
    url: string;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
  sort: {
    sortsName: string;
  };
  // 这里可以根据需要添加 tag、评论数、阅读数等，目前示例中没有
};

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

type StrapiResponse<T> = {
  data: T;
  meta: {
    pagination: Pagination;
  };
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 5,
    pageCount: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 动画效果

  // Strapi baseURL
  const STRAPI_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:1337";

  const animationProps = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 200, friction: 20 },
    reset: true,
  });

  // 请求文章列表
  const fetchArticles = async (page: number) => {
    setLoading(true);
    try {
      // apiClient 的响应拦截器已经返回了 response.data
      // 所以这里的 res 就是服务器返回的 { data: [...], meta: {...} }
      const res: any = await apiClient.get("/api/articles?populate=*", {
        // 假设你的后端接口是 /articles，支持分页参数
        params: {
          "pagination[page]": page,
          "pagination[pageSize]": 5,
        },
      });

      const newArticles: Article[] = res.data;
      const meta = res.meta.pagination;

      setArticles((prev) => (page === 1 ? newArticles : [...prev, ...newArticles]));
      setPagination(meta);
      setHasMore(meta.page < meta.pageCount);
      console.log("文章数据:", res);
    } catch (error) {
      console.error("加载文章失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchArticles(1);
  }, []);

  // 加载更多
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchArticles(pagination.page + 1);
    }
  };

  return (
      <div className="container mx-auto mt-[-60] px-4 py-4  max-md:w--96 max-md:h-full">
        <Tabs aria-label="Options" color="primary" className="w-full">
          <Tab key="quan" title="全部">
            <div className="space-y-4">
              {articles.map((item) => (
                  <article
                      key={item.id}
                      className="bg-white rounded-lg sm:rounded-xl h-auto min-h-[140px] sm:h-36 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row lg:mb-4 sm:gap-3 p-3 sm:p-4 "
                  >
                    {/* 封面图 */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                      <animated.div
                          style={animationProps}
                          className="w-full h-36 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-28 rounded-lg overflow-hidden relative"
                      >
                        <Image
                            src={
                                (() => {
                                  const coverUrl = item.articleCover?.formats?.medium?.url ||
                                                   item.articleCover?.formats?.small?.url ||
                                                   item.articleCover?.url;
                                  // 如果是Strapi路径（以 /uploads/ 开头），则拼接baseURL
                                  return coverUrl?.startsWith('/uploads/')
                                    ? `${STRAPI_BASE}${coverUrl}`
                                    : (coverUrl || '');
                                })()
                            }
                            alt={item.articleName}
                            fill
                            className="object-cover"
                            unoptimized
                            onError={(e) => {
                                console.error('文章封面加载失败:', item.articleCover?.url);
                                (e.target as HTMLImageElement).src = '/Banner.jpg';
                            }}
                        />
                      </animated.div>
                    </div>

                    {/* 文字内容 */}
                    <animated.div
                        style={animationProps}
                        className="flex-1 flex flex-col justify-between mt-3 sm:mt-0"
                    >
                      <div>
                        <Link key={item.documentId} href={`/pages/articles/${item.documentId}`}>
                          <h2 className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 line-clamp-2 font-medium text-gray-800">
                            {item.articleName}
                          </h2>
                        </Link>
                        <time className="text-xs sm:text-sm text-gray-500 mb-2 block">
                          {item.artileTime}
                        </time>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-2 leading-relaxed hidden sm:block">
                          {item.artilceDesc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm mt-3">
                    <span className="text-purple-600 font-medium">
                      {item.sort?.sortsName || "未分类"}
                    </span>
                        <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <RiChatAiLine size={14} /> 0
                      </span>
                          <span className="flex items-center gap-1">
                        <RiEye2Line size={14} /> 0
                      </span>
                        </div>
                      </div>
                    </animated.div>
                  </article>
              ))}
            </div>

            {/* 加载更多按钮 */}
            {hasMore && (
                <div className="text-center mt-8">
                  <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "加载中..." : "加载更多"}
                  </button>
                </div>
            )}

            {!hasMore && articles.length > 0 && (
                <div className="text-center mt-8 text-gray-500">
                  —— 没有更多文章了 ——
                </div>
            )}

            {articles.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  暂无文章
                </div>
            )}
          </Tab>
        </Tabs>
      </div>
  );
}