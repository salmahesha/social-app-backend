import z from "zod";
import { createPostSchema, findPostSchema, updatePostSchema } from "./post.validation";

export type PostSchemaDto = z.infer<typeof createPostSchema.body>
export type FindSchemaDto = z.infer<typeof findPostSchema.query>
export type updateSchemaDto = z.infer<typeof updatePostSchema.body>