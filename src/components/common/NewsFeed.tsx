import TimeAgo from "javascript-time-ago";
import sv from "javascript-time-ago/locale/sv";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { db } from "~/lib/db";
import { news } from "~/lib/db/schema";
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
      <Card className="shadow-xl border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <h2 className="text-3xl font-bold text-center tracking-wide drop-shadow-lg relative z-10">
            📰 Nyheter 📰
          </h2>
          <div className="absolute top-2 left-4 text-2xl opacity-50">⚡</div>
          <div className="absolute top-2 right-4 text-2xl opacity-50">⚡</div>
        </CardHeader>
        <CardContent className="pt-6 bg-gradient-to-br from-white to-blue-50">
        {newsPosts[0] ? (
          <div className="my-4 w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 p-4 shadow-lg border-2 border-yellow-400 relative overflow-hidden">
            {/* Racing stripe effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></div>
            
            <div className="mb-3 flex items-start justify-between gap-3 relative z-10">
              <div className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2 flex-1">
                <span>🔥</span>
                {newsPosts[0].title}
              </div>
              <div className="text-xs text-yellow-200 font-semibold bg-black/20 px-3 py-2 rounded-full text-center max-w-[100px] leading-tight">
                {timeAgo.format(newsPosts[0].createdAt)}
              </div>
            </div>
            <div className="whitespace-pre-wrap bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-lg border-2 border-yellow-300 relative z-10">
              {newsPosts[0].text}
            </div>
          </div>
        ) : (
          <></>
        )}
        {newsPosts[1] ? (
          <div className="my-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 p-4 shadow-lg border-2 border-red-400 relative overflow-hidden">
            {/* Racing stripe effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-red-400"></div>
            
            <div className="mb-3 flex items-start justify-between gap-3 relative z-10">
              <div className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2 flex-1">
                <span>⭐</span>
                {newsPosts[1].title}
              </div>
              <div className="text-xs text-red-200 font-semibold bg-black/20 px-3 py-2 rounded-full text-center max-w-[100px] leading-tight">
                {timeAgo.format(newsPosts[1].createdAt)}
              </div>
            </div>
            <div className="whitespace-pre-wrap bg-gradient-to-br from-red-100 to-yellow-100 p-3 rounded-lg border-2 border-red-300 relative z-10">
              {newsPosts[1].text}
            </div>
          </div>
        ) : (
          <></>
        )}
        {newsPosts.length > 2 ? (
          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="older-news" className="border-2 border-slate-400 rounded-xl bg-gradient-to-r from-slate-300 to-gray-300 overflow-hidden">
                <AccordionTrigger className="flex justify-between items-center bg-gradient-to-r from-slate-500 to-gray-600 text-white px-6 py-4 hover:from-slate-600 hover:to-gray-700 transition-all duration-300 hover:no-underline">
                  <div className="flex items-center gap-3 font-bold text-lg">
                    <span className="text-2xl">📅</span>
                    <span>Äldre nyheter</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-4 pb-2 bg-gradient-to-br from-slate-100 to-gray-100">
                  <div className="space-y-3">
                    {newsPosts.slice(2).map((newsPost, index) => {
                      const gradients = [
                        "from-purple-400 to-pink-400 border-purple-500",
                        "from-green-400 to-blue-400 border-green-500",
                        "from-yellow-400 to-red-400 border-yellow-500",
                        "from-indigo-400 to-purple-400 border-indigo-500",
                        "from-pink-400 to-red-400 border-pink-500",
                      ];
                      const gradient = gradients[index % gradients.length];
                      
                      return (
                        <div
                          key={newsPost.id}
                          className={`w-full rounded-lg bg-gradient-to-r ${gradient} p-3 shadow-md border-2 relative overflow-hidden`}
                        >
                          {/* Racing stripe effect */}
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-white/30"></div>
                          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/30"></div>
                          
                          <div className="mb-2 flex items-start justify-between gap-3 relative z-10">
                            <div className="text-lg font-bold text-white drop-shadow-md flex items-center gap-2 flex-1">
                              <span>🏆</span>
                              {newsPost.title}
                            </div>
                            <div className="text-xs text-white/80 font-semibold bg-black/20 px-3 py-2 rounded-full text-center max-w-[100px] leading-tight">
                              {timeAgo.format(newsPost.createdAt)}
                            </div>
                          </div>
                          <div className="whitespace-pre-wrap bg-white/90 p-3 rounded-md border border-white/50 text-gray-800 relative z-10">
                            {newsPost.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          <></>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
