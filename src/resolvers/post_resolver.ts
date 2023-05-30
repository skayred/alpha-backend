import { Post } from "../entity/Post";

const MAX_LIMIT = 5;

export const resolvers = (commentsRepo: any) => ({
  Post: {
    author: async (post: Post, _args: any, ctx: any) => {
      return ctx.dataSources.users.getUserByID(post.authorID);
    },
    comments: async (post: Post, args: any) => {
      const { cursor, limit } = args;

      let query = commentsRepo
        .createQueryBuilder("comments")
        .where("post_id = :postID", { postID: post.id })
        .limit(Math.min(limit, MAX_LIMIT));

      if (!!cursor) {
        query = query.andWhere("id > :id", { id: cursor });
      }

      return query.getMany();
    },
  },
});
