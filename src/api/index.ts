import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { brand } from "ponder:schema";
import { PinataSDK } from "pinata";

interface Bindings {
  PINATA_JWT: string;
  GATEWAY_URL: string;
}


const app = new Hono<{ Bindings: Bindings }>();

app.use("/sql/*", client({ db, schema }));

app.get("/brands", async (c: any) => {
  const brands = await db.select().from(brand);

  return c.json(brands);
});


app.get('/presigned_url', async (c) => {

	// Handle Auth

  console.log(c.env.PINATA_JWT);

  

  const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNzFkOWEzZi1iNmJlLTQyZGItYjViNy1iYjg1YWRjM2M5ZGYiLCJlbWFpbCI6Imhkenp6enp6MDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImUyMDEzMWExZWI0YTBlZTNhZWJlIiwic2NvcGVkS2V5U2VjcmV0IjoiNzQ4MzFhYTNhNjllNGY0NjVjMjQ4NGE0OWFkM2IwZWYwMzhkNjJiZTE0ODk1NWFlOTEzNjM3N2Q3MTY2YzJhYSIsImV4cCI6MTc4MzE1Nzc3N30.JHrkuiGdEDoCTOqN1i8zvmtsxPPCXESksVBE2JFLTUA",
    pinataGateway: "https://copper-defeated-gopher-612.mypinata.cloud"
  })

  const url = await pinata.upload.public.createSignedURL({
    expires: 60 // Last for 60 seconds
  })

  return c.json({ url }, { status: 200 })
})


app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
