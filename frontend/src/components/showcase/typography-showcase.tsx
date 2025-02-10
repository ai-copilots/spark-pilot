// import { cn } from "@/lib/utils";

export function TypographyShowcase() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 space-y-8">
      {/* 标题展示 */}
      <section className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          设计系统展示
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          排版系统
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          标题与正文
        </h3>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          组件示例
        </h4>
      </section>

      {/* 正文展示 */}
      <section className="space-y-6">
        <p className="text-xl text-muted-foreground">
          Lead: 这是一段引导文本，用于概述重要内容或关键信息。
        </p>
        
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          这是正文段落，使用了合适的行高和间距，确保良好的可读性。这里可以包含大段的文字内容，
          而不会让读者感到疲劳。
        </p>

        <blockquote className="mt-6 border-l-2 pl-6 italic">
          &ldquo;这是一段引用文字，可以用来突出显示重要的话语或者引用。&rdquo;
        </blockquote>
      </section>

      {/* 列表展示 */}
      <section>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>第一个列表项目</li>
          <li>第二个列表项目</li>
          <li>第三个列表项目</li>
        </ul>
      </section>

      {/* 代码展示 */}
      <section className="space-y-4">
        <p className="leading-7">
          这里有一段包含 <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">内联代码</code> 的文本。
        </p>
      </section>

      {/* 辅助文本展示 */}
      <section className="space-y-4">
        <div className="text-lg font-semibold">大号文本</div>
        <small className="text-sm font-medium leading-none">小号文本</small>
        <p className="text-sm text-muted-foreground">次要说明文本</p>
      </section>

      {/* 表格展示 */}
      <section>
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold">标题一</th>
                <th className="border px-4 py-2 text-left font-bold">标题二</th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left">内容 1</td>
                <td className="border px-4 py-2 text-left">内容 2</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left">内容 3</td>
                <td className="border px-4 py-2 text-left">内容 4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
} 