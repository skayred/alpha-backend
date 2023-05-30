import { DataSource } from "typeorm";

const { ApolloServer } = require("apollo-server-express");

const { schema } = require("../src/schema");
const { resolvers } = require("../src/resolvers/resolvers");

const { User } = require("../src/entity/User");
const { Post } = require("../src/entity/Post");
const { Comment } = require("../src/entity/Comment");

const { UserLoader } = require("../src/dataloaders/user-loader");
const { PostLoader } = require("../src/dataloaders/post-loader");

const users = [
  { id: 1, name: "Lonnie.Hirthe", email: "Lonnie.Hirthe88@hotmail.com" },
];
const posts = [
  {
    id: 1,
    title: "Title 1",
    content: "Content 1",
    authorID: 1,
  },
  {
    id: 2,
    title: "Title 2",
    content: "Content 2",
    authorID: 1,
  },
  {
    id: 3,
    title: "Title 3",
    content: "Content 3",
    authorID: 1,
  },
];
const comments = [
  {
    id: 1,
    content: `Comment 1`,
    postID: 1,
    authorID: 1,
  },
  {
    id: 2,
    content: `Comment 2`,
    postID: 1,
    authorID: 1,
  },
  {
    id: 3,
    content: `Comment 3`,
    postID: 1,
    authorID: 1,
  },
];

describe("E2E tests", () => {
  let con: any;
  let userRepo: any;
  let postRepo: any;
  let commentRepo: any;

  let testServer: any;

  beforeAll(async () => {
    con = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [User, Post, Comment],
      synchronize: true,
      logging: false,
    });

    await con.initialize();

    userRepo = con.getRepository(User);
    postRepo = con.getRepository(Post);
    commentRepo = con.getRepository(Comment);

    await con.transaction(async (transactionalEntityManager: any) => {
      await Promise.all(users.map(async (user: any) => {
        const candidate = new User();
        return await transactionalEntityManager.save(Object.assign(candidate, user));
      }));

      await Promise.all(posts.map(async (post: any) => {
        const candidate = new Post();
        return await transactionalEntityManager.save(Object.assign(candidate, post));
      }));

      await Promise.all(comments.map(async (comment: any) => {
        const candidate = new Comment();
        return await transactionalEntityManager.save(Object.assign(candidate, comment));
      }));
    });

    testServer = new ApolloServer({
      typeDefs: schema,
      resolvers: resolvers(userRepo, postRepo, commentRepo),
      context: async () => {
        return {
          dataSources: {
            users: new UserLoader(userRepo),
            posts: new PostLoader(postRepo),
          },
        };
      },
    });
  });

  afterAll(async () => {
    await con.close();
  });

  test("Returns full list of posts", async () => {
    const response = await testServer.executeOperation({
      query: "{ posts(limit: 50) { id title content } }",
    });

    expect(response.data.posts.length).toBe(3);
    expect(response.data.posts[0].id).toBe("1");
    expect(response.data.posts[0].title).toBe("Title 1");
  });

  test("Returns limited list of posts", async () => {
    const response = await testServer.executeOperation({
      query: "{ posts(limit: 1) { id title content } }",
    });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].id).toBe("1");
    expect(response.data.posts[0].title).toBe("Title 1");
  });

  test("Returns limited paginated list of posts", async () => {
    const response = await testServer.executeOperation({
      query: "{ posts(cursor: 1, limit: 2) { id title content } }",
    });

    expect(response.data.posts.length).toBe(2);
    expect(response.data.posts[0].id).toBe("2");
    expect(response.data.posts[0].title).toBe("Title 2");
  });

  test("Returns empty list for the cursor out of boundaries", async () => {
    const response = await testServer.executeOperation({
      query: "{ posts(cursor: 3, limit: 2) { id title content } }",
    });

    expect(response.data.posts.length).toBe(0);
  });

  test("Returns post by ID", async () => {
    const response = await testServer.executeOperation({
      query: "{ postByID(id: 1) { id title } }",
    });

    expect(response.data.postByID.id).toBe("1");
  });

  test("Returns post details by ID", async () => {
    const response = await testServer.executeOperation({
      query: "{ postByID(id: 1) { id title content author { id email } comments(limit: 5) { id content } } }",
    });

    expect(response.data.postByID.id).toBe("1");
    expect(response.data.postByID.author.id).toBe("1");
    expect(response.data.postByID.author.email).toBe("Lonnie.Hirthe88@hotmail.com");
    expect(response.data.postByID.comments.length).toBe(3);
    expect(response.data.postByID.comments[0].id).toBe("1");
  });

  test("Returns post comments to be empty", async () => {
    const response = await testServer.executeOperation({
      query: "{ postByID(id: 2) { id title content author { id email } comments(limit: 5) { id content } } }",
    });

    expect(response.data.postByID.id).toBe("2");
    expect(response.data.postByID.author.id).toBe("1");
    expect(response.data.postByID.comments.length).toBe(0);
  });
});
