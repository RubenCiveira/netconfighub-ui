import { Client, Account, Databases, Storage, Functions } from 'appwrite';

export class AppwriteClientService {
  public readonly client: Client;
  public readonly account: Account;
  public readonly database: Databases;
  public readonly storage: Storage;
  public readonly functions: Functions;

  constructor(conf: any) {
    console.log(conf);
    this.client = new Client().setEndpoint(conf.endpoint).setProject(conf.project);
    //      'https://appwrite.civeira.net/v1').setProject('681e83ff002daf8fc8a5');

    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.functions = new Functions(this.client);
  }
}
