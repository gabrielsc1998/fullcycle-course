import { Sequelize, ModelCtor } from "sequelize-typescript";

export class DBSequelizeConnection {
  private client: Sequelize;

  constructor() {}

  async initialize(models: Array<ModelCtor>): Promise<void> {
    this.client = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    this.client.addModels(models);
    await this.client.sync();
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
