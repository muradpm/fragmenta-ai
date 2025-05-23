import { Hono } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import { cors } from "hono/cors";

import { api } from "./_generated/api";

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

const app: HonoWithConvex<ActionCtx> = new Hono();

app.use("/api/*", cors());

app.post("/api/generate", async (c) => {
  const { prompt, formId } = await c.req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    maxTokens: 2000,
    prompt: `Generate a list of 5 questions based on the following input.
    
    Guidelines:
    - Return the result as a JSON array of question objects.
    - Each question object should have 'title', 'description', and 'type' properties.
    - The 'type' should be one of: 'Start screen', 'End screen', 'Short text', 'Long text', 'Yes/no choice', 'Single choice', 'Multiple choice', or 'Rating'.
    - Always include exactly one 'Start screen' and one 'End screen' question in the returned list.
    - Ensure the questions are relevant to the input and cover key aspects.
    - Keep the question titles concise and the descriptions clear and informative.
    - Do not include any markdown formatting or code block syntax in the response.
    
    Input: ${prompt}
    
    Output the result as a JSON array only, with no additional text.`,
    onFinish: async ({ text }) => {
      const parsed = JSON.parse(text);
      await c.env.runMutation(api.questions.generate, {
        questions: parsed,
        formId,
      });
    },
  });

  return result.toDataStreamResponse();
});

app.get("/.well-known/openid-configuration", async (c) => {
  return c.json(
    {
      issuer: process.env.CONVEX_SITE_URL,
      jwks_uri: process.env.CONVEX_SITE_URL + "/.well-known/jwks.json",
      authorization_endpoint: process.env.CONVEX_SITE_URL + "/oauth/authorize",
    },
    200,
    {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
    }
  );
});

app.get("/.well-known/jwks.json", async (c) => {
  if (process.env.JWKS === undefined) {
    throw new Error("Missing JWKS Convex environment variable");
  }
  return c.text(process.env.JWKS, 200, {
    "Content-Type": "application/json",
    "Cache-Control":
      "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
  });
});

export default new HttpRouterWithHono(app);
