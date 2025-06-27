import { ponder } from "ponder:registry";
import { llama } from "ponder:schema";

ponder.on("LlamaCore:AccountCreated", async ({ event, context }) => {
  console.log(
    `Handling ActionCreated event from LlamaCore @ ${event.log.address}`
  );

  await context.db.insert(llama).values({
    id: event.log.logIndex.toString(),
  });
});

ponder.on("LlamaPolicy:Initialized", async ({ event, context }) => {
  console.log(
    `Handling Initialized event from LlamaPolicy @ ${event.log.address}`
  );

  await context.db.insert(llama).values({
    id: event.log.logIndex.toString(),
  });
});
