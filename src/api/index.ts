import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { brand } from "ponder:schema";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.get("/brands", async (c: any) => {
  const brands = await db.select().from(brand);

  return c.json(brands);
});

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
