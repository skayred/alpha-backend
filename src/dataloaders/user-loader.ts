import * as DataLoader from "dataloader";
import { Repository } from "typeorm";

import { User } from "../entity/User";

export class UserLoader {
  userRepo: Repository<User>;

  constructor(userRepo: Repository<User>) {
    this.userRepo = userRepo;
  }

  private batchUsers = new DataLoader(async (ids: readonly number[]) => {
    const users = await this.userRepo
      .createQueryBuilder("user")
      .where("user.id IN (:...ids)", { ids })
      .getMany();
    
    return ids.map((id: number) => users.find((user: User) => user.id === id));
  });

  async getUserByID(id: number) {
    return this.batchUsers.load(id);
  }
}
