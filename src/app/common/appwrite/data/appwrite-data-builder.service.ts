import { Injectable } from '@angular/core';
import { Acl } from '@common/data/acl/acl.model';
import { RepositoryProvider } from '@common/data/repository/provider/repository-provider.interface';
import { Observable } from 'rxjs';
import { AppwriteProvider } from './appwrite-data-provider';
import { AppwriteClientService } from '../appwrite-client-service';

@Injectable()
export class AppwriteDataBuilder {
  constructor(private readonly client: AppwriteClientService) {}

  public provider<T, F>(
    idField: string,
    database: string,
    collection: string,
    bucket: string,
    aclResolver: () => Observable<Acl>,
    filterResolver: (filter: F) => Observable<string[]>,
    dataReader: (register: any) => T,
    dataNormalizer: (register: T) => Observable<T>,
  ): RepositoryProvider<T, F> {
    return new AppwriteProvider(
      this.client.client,
      this.client.database,
      this.client.storage,
      database,
      collection,
      bucket,
      idField,
      aclResolver,
      filterResolver,
      dataReader as any,
      dataNormalizer as any,
    );
  }
}
