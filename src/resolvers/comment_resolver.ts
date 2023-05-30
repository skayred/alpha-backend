import { Comment } from "../entity/Comment";

export const resolvers = {
    Comment: {
      author: async (comment: Comment, _args: any, ctx: any) => {
        return ctx.dataSources.users.getUserByID(comment.authorID);
      },
      post: async (comment: Comment, _args: any, ctx: any) => {
        return ctx.dataSources.posts.getPostByID(comment.postID);
      },
    },
  };
  