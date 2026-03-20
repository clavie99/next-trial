import { PageLayout, DemoLayout, DataDisplay } from '@/components/layout'

// 不允许访问未预渲染的路径，访问 /blog/101 会返回 404
export const dynamicParams = false

// 构建时执行，生成 100 个静态页面的路由参数
export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }))
}

// 模拟博客数据
function getBlogData(id: string) {
  const titles = [
    'Next.js 静态渲染深度解析',
    'React Server Components 实战指南',
    '边缘计算与前端性能优化',
    'TypeScript 高级类型体操',
    'CSS Container Queries 完全指南',
    'Web Vitals 性能指标详解',
    '微前端架构设计与实践',
    'Node.js Stream 流式处理',
    'GraphQL vs REST API 选型',
    'Tailwind CSS 最佳实践',
  ]

  const categories = ['前端开发', '性能优化', '架构设计', '工程化', 'DevOps']
  const authors = ['张三', '李四', '王五', '赵六', '陈七']

  const idx = Number(id) - 1
  return {
    id,
    title: `${titles[idx % titles.length]} (${id})`,
    category: categories[idx % categories.length],
    author: authors[idx % authors.length],
    summary: `这是第 ${id} 篇博客文章。本文详细介绍了 ${titles[idx % titles.length].replace(/ \(\d+\)/, '')} 的相关知识与实战经验，帮助开发者深入理解并掌握核心概念。`,
    wordCount: 1200 + (idx * 37) % 3000,
    publishDate: new Date(2025, idx % 12, (idx % 28) + 1).toISOString().split('T')[0],
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const blog = getBlogData(id)

  const codeExample = `// src/app/blog/[id]/page.tsx

// 禁止动态参数，未预渲染的路由返回 404
export const dynamicParams = false;

// 构建时生成 100 个静态页面
export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const blog = getBlogData(id);

  return <article>{blog.title}</article>;
}`

  const dataFields = [
    { label: '文章 ID', value: id, color: 'text-purple-400' },
    { label: '标题', value: blog.title, color: 'text-white' },
    { label: '分类', value: blog.category, color: 'text-cyan-400' },
    { label: '作者', value: blog.author, color: 'text-pink-400' },
    { label: '字数', value: `${blog.wordCount} 字`, color: 'text-yellow-400' },
    { label: '发布日期', value: blog.publishDate, color: 'text-orange-400' },
    { label: '渲染策略', value: 'Static Generation (SSG)', color: 'text-green-400' },
    { label: '构建时间', value: new Date().toISOString(), color: 'text-blue-400' },
  ]

  const features = [
    { title: '纯静态 HTML', description: '此页面在 next build 时预渲染为纯静态 HTML 文件，无需服务器运行时计算。' },
    { title: '100 篇批量生成', description: '通过 generateStaticParams 一次性声明 100 个路由，构建时全部生成。' },
    { title: 'CDN 加速友好', description: '静态文件可直接缓存到 CDN 边缘节点，用户就近访问，极致性能。' },
    { title: 'SEO 完美支持', description: '搜索引擎可以直接抓取到完整的 HTML 内容，无需执行 JavaScript。' },
  ]

  return (
    <PageLayout>
      <DemoLayout
        title={blog.title}
        subtitle={`博客文章 #${id} — ${blog.category} · ${blog.author}`}
        description={blog.summary}
        codeExample={codeExample}
        renderMode="SSG"
        dataDisplay={
          <DataDisplay
            title={blog.title}
            description={blog.summary}
            data={dataFields}
            features={features}
          />
        }
      />
    </PageLayout>
  )
}
