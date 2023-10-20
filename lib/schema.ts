import { int, text, mysqlTable} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});

export type User = typeof users.$inferSelect;
