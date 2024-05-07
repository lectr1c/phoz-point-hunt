// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { eq, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgMaterializedView,
  pgTable,
  pgTableCreator,
  pgView,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import * as querystring from "node:querystring";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `phoz-point-hunt_${name}`);

export const coupons = createTable("coupons", {
  id: serial("id").primaryKey(),
  couponCode: text("coupon_code").unique().notNull(),
  couponWorth: integer("coupon_worth"),
  exported: boolean("exported").default(false),
});

export const roleEnum = pgEnum("role", ["nollan", "fadder", "phoz"]);

export const users = createTable("users", {
  id: text("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  username: text("user_name"),
  role: roleEnum("role").default("nollan"),
});

export const news = createTable("news", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  title: varchar("title", { length: 256 }),
  text: varchar("text", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const comments = createTable("news", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  text: varchar("text", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const teams = createTable("teams", {
  id: serial("id").primaryKey(),
  teamName: text("team_name").notNull(),
  mainColor: text("main_color").notNull(),
  secondaryColor: text("secondary_color").notNull(),
});

export const points = createTable(
  "points",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    couponId: integer("coupon_id").references(() => coupons.id),
    addedAt: timestamp("added_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    addedAtIndex: index("added_at_idx").on(table.addedAt),
  }),
);

export const pointsByDateView = pgView("points_by_date", {
  viewDate: date("view_date").notNull(),
  teamId: integer("team_id").notNull(),
  totalPointsByDate: integer("total_points_up_to_date").notNull(),
}).existing();

// // export const userView = pgMaterializedView("user_view").as((qb) => qb.select().from(users));
//
// export const pointsByDateView = pgView("points_by_date")
//         .as(qb => qb.select().from(sql`
//                 SELECT
//                   dates.d AS view_date,
//                   u.team_id,
//                   COALESCE(SUM(c.coupon_worth), 0) AS total_points_up_to_date
//                 FROM
//                   (
//                     SELECT
//                       GENERATE_SERIES(
//                         (
//                           SELECT
//                             MIN(added_at)
//                           FROM
//                             "phoz-point-hunt_points"
//                         ),
//                         (
//                           SELECT
//                             CURRENT_DATE + INTERVAL '1 day'
//                         ),
//                         '1 day'::INTERVAL
//                       )::timestamp AS d
//                   ) dates
//                   CROSS JOIN "phoz-point-hunt_users" u
//                   LEFT JOIN "phoz-point-hunt_points" p ON p.user_id = u.id
//                   LEFT JOIN "phoz-point-hunt_coupons" c ON c.id = p.coupon_id
//                   AND p.added_at <= dates.d
//                 GROUP BY
//                   dates.d,
//                   u.team_id
//                 ORDER BY
//                   dates.d,
//                   u.team_id;
//   `));
//
