export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end gap-3 my-12">
      <div className="px-6 py-4 max-w-[70%] bg-[#f4f4f4] dark:bg-[#2f2f2f] text-[#0d0d0d] dark:text-[#ececec] rounded-full">
        <div className="not-prose text-[15px] leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
