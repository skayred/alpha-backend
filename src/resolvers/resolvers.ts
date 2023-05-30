import { resolvers as postResolvers } from "./post_resolver";
import { resolvers as commentResolvers } from "./comment_resolver";
import { resolvers as userResolvers } from "./user_resolver";

const MAX_LIMIT = 10;

export const resolvers = (_userRepo: any, postRepo: any, commentRepo: any) => ({
  ...postResolvers(commentRepo),
  ...userResolvers(postRepo),
  ...commentResolvers,
  Query: {
    posts: async (_: any, args: any) => {
      const { cursor, limit } = args;

      let query = postRepo
        .createQueryBuilder("posts")
        .limit(Math.min(limit, MAX_LIMIT));

      if (!!cursor) {
        query = query.where("id > :id", { id: cursor });
      }

      return query.getMany();
    },
    postByID: async (_: any, args: any) => {
      const { id } = args;

      return postRepo.findOne({ where: { id } });
    },
    postsByAuthor: async (_: any, args: any) => {
      const { authorID, cursor, limit } = args;

      let query = postRepo
        .createQueryBuilder("posts")
        .where("author_id = :authorID", { authorID: authorID })
        .orderBy("posts.id", "ASC")
        .limit(Math.min(limit, MAX_LIMIT));

      if (!!cursor) {
        query = query.andWhere("id > :id", { id: cursor });
      }

      return query.getMany();
    },
  },
});
