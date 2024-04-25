// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
    boolean,
    index, integer, pgEnum,
    pgTableCreator,
    serial, text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

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
    claimed: boolean("claimed").default(false)
})

export const roleEnum = pgEnum('role', ['nollan', 'fadder', 'phoz']);

export const users = createTable("users", {
    id: text("id").primaryKey(),
    teamId: integer("team_id").references(() => teams.id),
    username: text("user_name"),
    role: roleEnum('role').default("nollan")
})

export const news = createTable("news", {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    title: varchar("title", { length: 256 }),
    text: varchar("text", { length: 256 }),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
})

export const comments = createTable("news", {
    id: serial("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    text: varchar("text", { length: 256 }),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()
})

export const teams = createTable("teams", {
    id: serial("id").primaryKey(),
    teamName: text("team_name").notNull(),
    totalPoints: integer("total_points").notNull(),
})

export const points = createTable(
    "points",
    {
        id: serial("id").primaryKey(),
        userId: text("user_id").references(() => users.id),
        couponId: integer("coupon_id").references(() => coupons.id),
        teamId: integer("team_id").references(() => teams.id),
        currTeamTotalPoints: integer("curr_team_total_points"),
        addedAt: timestamp("added_at")
            .default(sql`CURRENT_TIMESTAMP`)
    },
    (table) => ({
        addedAtIndex: index("added_at_idx").on(table.addedAt),
    })
);