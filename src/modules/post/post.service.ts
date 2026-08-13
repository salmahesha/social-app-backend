import { Types } from "mongoose";
import { FindSchemaDto, updateSchemaDto } from "./post.dto";
import PostRepo from "../../common/DB/Repo/post.repo";
import { badRequestException } from "../../common/Exceptions/domain.exceptions";
import redisService from "../../common/redis/redis.service";
import notificationService from "../../common/notifecation/notification.service";
import { IHPost } from "../../common/DB/models/post.model";
import UserRepo from "../../common/DB/Repo/user.repo";
import { PostPrivacyEnum } from "../../common/Enums/post.enum";
import { IHUser } from "../../common/DB/models/user.model";
import { uploadToCloudinary } from "../../common/multer/multer.config";
import { deleteFromCloudinary } from "../../config/cloudinary";

class PostService {
    private _PostRepo = new PostRepo();
    private _userRepo = new UserRepo();
    private _redisService = redisService;
    private _notificationService = notificationService;

    async createPost(
        bodyData: IHPost,
        userId: Types.ObjectId | string,
        files?: Express.Multer.File[]
    ) {
        const { tags } = bodyData;

        if (tags?.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: { $in: tags }
                }
            });

            if (mentionedUsers.length !== tags.length) {
                throw new badRequestException(
                    "failed to find some tagged users"
                );
            }

            for (const tag of tags) {
                const tokens = await this._redisService.getSetMembers(tag);

                if (tokens.length) {
                    await this._notificationService.sendNotifications({
                        tokens,
                        data: {
                            title: "post tagged",
                            body: "you have been tagged on post"
                        }
                    });
                }
            }
        }

        if (files?.length) {
            const uploadedFiles = await Promise.all(
                files.map((file) =>
                    uploadToCloudinary(
                        file.buffer,
                        "posts"
                    )
                )
            );

            bodyData.attachments = uploadedFiles.map(
                (file) => file.secure_url
            );
        }

        bodyData.createdBy = userId as Types.ObjectId;

        return this._PostRepo.create({
            data: bodyData
        });
    }

    async findPost(
        user: IHUser,
        queryData: FindSchemaDto
    ) {
        const searchQuery = queryData.search?.length
            ? {
                content: {
                    $regex: queryData.search,
                    $options: "i"
                }
            }
            : {};

        return await this._PostRepo.paginate({
            filter: {
                $or: [
                    {
                        privacy: PostPrivacyEnum.PUBLIC
                    },
                    {
                        createdBy: {
                            $in: user.friends
                        }
                    },
                    {
                        tags: {
                            $in: [user._id]
                        }
                    },
                    {
                        createdBy: user._id
                    }
                ],
                ...searchQuery
            },
            page: queryData.page as number,
            size: queryData.size as number
        });
    }

    async updatePost(
        userId: Types.ObjectId | string,
        postId: Types.ObjectId | string,
        data: updateSchemaDto,
        files?: Express.Multer.File[]
    ) {
        const post = await this._PostRepo.findOne({
            filter: {
                createdBy: userId,
                _id: postId
            }
        });

        if (!post) {
            throw new badRequestException("Post Not Found");
        }

        if (
            !post.content &&
            !data.content &&
            !files?.length &&
            post.attachments?.length &&
            post.attachments.length === data.removeFiles?.length
        ) {
            throw new badRequestException(
                "cannot leave post empty"
            );
        }

        if (data.tags?.length) {
            const mentionedUsers = await this._userRepo.find({
                filter: {
                    _id: {
                        $in: data.tags
                    }
                }
            });

            if (mentionedUsers.length !== data.tags.length) {
                throw new badRequestException(
                    "failed to find some tagged users"
                );
            }

            for (const tag of data.tags) {
                const tokens =
                    await this._redisService.getSetMembers(tag);

                if (tokens.length) {
                    await this._notificationService.sendNotifications({
                        tokens,
                        data: {
                            title: "post tagged",
                            body: "you have been tagged on post"
                        }
                    });
                }
            }
        }

        if (files?.length) {
            const uploadedFiles = await Promise.all(
                files.map((file) =>
                    uploadToCloudinary(
                        file.buffer,
                        "posts"
                    )
                )
            );

            data.files = uploadedFiles.map(
                (file) => file.secure_url
            );
        }

        if (data.removeFiles?.length) {
            await Promise.all(
                data.removeFiles.map((path) =>
                    deleteFromCloudinary(path)
                )
            );
        }

        return await this._PostRepo.findOneAndUpdate({
            filter: {
                _id: postId
            },

            update: [
                {
                    $set: {
                        content: data.content ?? post.content,

                        privacy:
                            data.privacy ??
                            post.privacy,

                        tags: {
                            $setUnion: [
                                {
                                    $setDifference: [
                                        "$tags",
                                        data.removeTags ?? []
                                    ]
                                },
                                data.tags ?? []
                            ]
                        },

                        attachments: {
                            $setUnion: [
                                {
                                    $setDifference: [
                                        "$attachments",
                                        data.removeFiles ?? []
                                    ]
                                },
                                data.files ?? []
                            ]
                        }
                    }
                }
            ],

            options: {
                updatePipeline: true,
                returnDocument:"after"
            }
        });
    }
}

export default new PostService();