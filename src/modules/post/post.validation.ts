import z from "zod";
import { PostPrivacyEnum } from "../../common/Enums/post.enum";
import { Types } from "mongoose";
import { commonValidation } from "../../Middlewares/validatioin.middleware";

export const createPostSchema = {
    body: z.object({
        content: z.string().min(3).max(1000).optional(),
        tags: z.array(z.string()).optional(),
        privacy: z.coerce.number().default(PostPrivacyEnum.PUBLIC),
        files: z.any().optional()
    }).superRefine((args, ctx) => {

        if (args.files?.length && !args.content) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "You should add content at least or upload one attachment"
            });
        }

        if (args.tags?.length) {

            for (const tag of args.tags) {
                if (!Types.ObjectId.isValid(tag)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["tags"],
                        message: `invalid tag object id ${tag}`
                    });
                }
            }

            const uniqueTags = [...new Set(args.tags)];

            if (uniqueTags.length !== args.tags.length) {
                ctx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: "Duplicated values"
                });
            }
        }
    })
};

export const updatePostSchema = {
    body: z.object({
        content: z.string().min(3).max(1000).optional(),
        tags: z.array(commonValidation.id).optional(),
        privacy: z.coerce.number().optional(),
        files: z.array(z.string()).optional(),
        removeTags: z.array(commonValidation.id).optional(),
        removeFiles: z.array(z.string()).optional()
    }).superRefine((args, ctx) => {

        if (args.tags?.length) {

            for (const tag of args.tags) {
                if (!Types.ObjectId.isValid(tag)) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["tags"],
                        message: `invalid tag object id ${tag}`
                    });
                }
            }

            const uniqueTags = [...new Set(args.tags)];

            if (uniqueTags.length !== args.tags.length) {
                ctx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: "Duplicated values"
                });
            }
        }
    }),

    params: z.object({
        postId: commonValidation.id
    })
};

export const findPostSchema = {
    query: z.object({
        page: z.coerce.number().optional(),
        size: z.coerce.number().optional(),
        search: z.string().optional()
    })
};