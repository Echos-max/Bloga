import { apiClient } from "@/app/utils/axios";
import MarkdownRenderer from "@/app/components/MarkdownRenderer"; // 导入新创建的组件

async function getArticle(documentId: string) {
  const url = `/api/articles/${documentId}?populate=*`;
  try {
    const res = await apiClient.get(url);
    if (!res || !res.data) {
      console.error("Invalid response:", res);
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return null;
  }
}

// 生成静态路径参数
export async function generateStaticParams() {
  try {
    // 确保有 API 基础 URL
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn("NEXT_PUBLIC_API_BASE_URL is not set, skipping static generation");
      return [];
    }

    const res = await apiClient.get("/api/articles?populate=*");
    const articles = res.data || [];

    console.log(`Generating static params for ${articles.length} articles`);

    return articles.map((article: any) => ({
      documentId: article.documentId,
    }));
  } catch (error: any) {
    console.warn("Failed to fetch articles for static generation:", error.message);
    console.warn("Continuing build without pre-generated article pages");
    // 返回空数组以允许构建继续，页面将在运行时生成
    return [];
  }
}

export default async function ArticlePage({
                                            params,
                                          }: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const article = await getArticle(documentId);

  if (!article) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ffffff] dark:bg-gray-900">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">文章未找到</h2>
            <p className="text-gray-500 dark:text-gray-400">找不到该文章，请检查链接是否正确。</p>
          </div>
        </div>
    );
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '未知日期';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('日期格式化错误:', e);
      return dateString;
    }
  };

  return (
      <div className="min-h-screen bg-[#ffffff] dark:bg-gray-900 p-1 text-gray-900 dark:text-gray-100">
        <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          {/* 文章标题 */}
          <h1 className="text-xl md:text-xl text-center font-semibold ">
            {article.articleName || '无标题'}
          </h1>

          {/* 元信息：分类与发布时间 */}
          <div className="flex flex-row justify-center items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          <span className="font-medium ">
            {article.sort?.sortsName || "未分类"}
          </span>
            <span>·</span>
            <time>{formatDate(article.artileTime)}</time>
          </div>

          {/* 文章内容 */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/*  文章内容区域 --markdown渲染区域*/}
            <MarkdownRenderer content={article.articleContent || ''} />
          </div>
        </article>

      </div>
  );
}