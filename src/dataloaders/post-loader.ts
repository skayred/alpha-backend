import * as DataLoader from "dataloader";
import { Repository } from "typeorm";

import { Post } from "../entity/Post";

export class PostLoader {
  postRepo: Repository<Post>;

  constructor(postRepo: Repository<Post>) {
    this.postRepo = postRepo;
  }

  private batchPosts = new DataLoader(async (ids: readonly number[]) => {
    const posts = await this.postRepo
      .createQueryBuilder("post")
      .where("post.id IN (:...ids)", { ids })
      .getMany();
    
    return ids.map((id: number) => posts.find((post: Post) => post.id === id));
  });

  async getPostByID(id: number) {
    return this.batchPosts.load(id);
  }
}
