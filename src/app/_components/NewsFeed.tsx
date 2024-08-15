import TimeAgo from "javascript-time-ago";
import sv from "javascript-time-ago/locale/sv";
import { Card } from "~/components/ui/card";
import { db } from "~/server/db";
import { news } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default async function NewsFeed() {
  TimeAgo.addLocale(sv);
  const timeAgo = new TimeAgo("sv");

  const newsPosts = await db.select().from(news).orderBy(desc(news.createdAt));

  return (
    <div className="w-full">
      <Card className="p-10 max-[600px]:p-2">
        <div className="flex justify-center text-3xl underline">Nyheter</div>
        {newsPosts[0] ? (
          <div className="my-2 w-full rounded-md bg-gray-300 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className={"text-xl"}>{newsPosts[0].title}</div>
              <div className="text-xs text-red-600">
                {timeAgo.format(newsPosts[0].createdAt)}
              </div>
            </div>
            <div className="whitespace-pre-wrap bg-yellow-50 p-2">
              {newsPosts[0].text}
            </div>
          </div>
        ) : (
          <></>
        )}
        {newsPosts[1] ? (
          <div className="my-2 w-full rounded-md bg-gray-300 p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className={"text-xl"}>{newsPosts[1].title}</div>
              <div className="text-xs text-red-600">
                {timeAgo.format(newsPosts[1].createdAt)}
              </div>
            </div>
            <div className="whitespace-pre-wrap bg-yellow-50 p-2">
              {newsPosts[1].text}
            </div>
          </div>
        ) : (
          <></>
        )}
        {newsPosts.length > 2 ? (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex justify-end bg-blue-100 pr-4 text-lg">
                <div className={"pr-4"}>Äldre nyheter</div>
              </AccordionTrigger>
              <AccordionContent>
                {newsPosts.slice(2).map((newsPost) => {
                  return (
                    <div
                      key={newsPost.id}
                      className="my-2 w-full rounded-md bg-gray-300 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className={"text-xl"}>{newsPost.title}</div>
                        <div className="text-xs text-red-600">
                          {timeAgo.format(newsPost.createdAt)}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap bg-yellow-50 p-2">
                        {newsPost.text}
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );
}
