import TimeAgo from "javascript-time-ago";
import sv from "javascript-time-ago/locale/sv";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/lib/db";
import { news } from "~/lib/db/schema";
import { desc } from "drizzle-orm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

function NewsItem({
  title,
  text,
  createdAt,
  timeAgo,
}: {
  title: string | null;
  text: string | null;
  createdAt: Date;
  timeAgo: TimeAgo;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-4">
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="shrink-0 text-xs text-muted-foreground">
          {timeAgo.format(createdAt)}
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm text-muted-foreground">
        {text}
      </div>
    </div>
  );
}

export default async function NewsFeed() {
  TimeAgo.addLocale(sv);
  const timeAgo = new TimeAgo("sv");

  const newsPosts = await db.select().from(news).orderBy(desc(news.createdAt));

  if (!newsPosts.length) return null;

  return (
    <Card className="p-6 shadow-soft sm:p-8">
      <CardHeader className="px-0 pb-4 pt-0 text-center">
        <CardTitle className="text-xl">Nyheter</CardTitle>
      </CardHeader>
      <div className="space-y-2">
        {newsPosts.slice(0, 2).map((post) => (
          <NewsItem
            key={post.id}
            title={post.title}
            text={post.text}
            createdAt={post.createdAt}
            timeAgo={timeAgo}
          />
        ))}
      </div>
      {newsPosts.length > 2 && (
        <Accordion type="single" collapsible className="mt-1">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="justify-end gap-2 pt-3 text-sm text-muted-foreground hover:no-underline">
              Äldre nyheter
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {newsPosts.slice(2).map((post) => (
                  <NewsItem
                    key={post.id}
                    title={post.title}
                    text={post.text}
                    createdAt={post.createdAt}
                    timeAgo={timeAgo}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
