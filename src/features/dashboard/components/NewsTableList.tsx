"use client";
import { Button } from "~/components/ui/button";
import DialogParent from "~/components/common/DialogParent";
import { deleteNews } from "~/features/dashboard/actions/DeleteNewsAction";
import TimeAgo from "javascript-time-ago";
import sv from "javascript-time-ago/locale/sv";
import { useRouter } from "next/navigation";

TimeAgo.addLocale(sv);
const timeAgo = new TimeAgo("sv");

export default function NewsTableList({
  newsQuery,
}: {
  newsQuery: {
    id: number;
    title: string | null;
    text: string | null;
    createdAt: Date;
  }[];
}) {
  const router = useRouter();

  if (!newsQuery.length) return null;

  return (
    <div className="mt-6 flex w-[95vw] flex-col gap-2 sm:w-[70vw]">
      {newsQuery.map((post) => (
        <div
          key={post.id}
          className="flex items-start justify-between gap-4 rounded-lg border border-border bg-secondary/50 p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {post.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {timeAgo.format(post.createdAt)}
              </span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {post.text}
            </p>
          </div>
          <DialogParent
            triggerButton={
              <Button
                type="button"
                className="shrink-0 bg-red-600 hover:bg-red-500"
              >
                Ta bort
              </Button>
            }
            title="Ta bort nyheten?"
            description={`Vill du ta bort "${post.title}"?`}
          >
            <Button
              className="float-right w-fit bg-red-600 hover:bg-red-500"
              type="button"
              onClick={async () => {
                await deleteNews(post.id);
                router.refresh();
              }}
            >
              Ta bort
            </Button>
          </DialogParent>
        </div>
      ))}
    </div>
  );
}
