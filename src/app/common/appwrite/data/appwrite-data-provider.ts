import { Databases, Storage, Query, ID, Client } from 'appwrite';
import { Observable, defer, forkJoin, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  RepositoryProvider,
  Slide,
  UploadProgress,
  DownloadBlob,
} from '../../data/repository/provider/repository-provider.interface';
import { Acl } from '@common/data/acl/acl.model';

export class AppwriteProvider<T extends { id?: string }, F = any> implements RepositoryProvider<T, F> {
  constructor(
    private readonly client: Client,
    private readonly database: Databases,
    private readonly storage: Storage,
    private readonly databaseId: string,
    private readonly collectionId: string,
    private readonly bucketId: string,
    private readonly idName: string,
    private readonly aclResolver: () => Observable<Acl>,
    private readonly filterResolver: (filter: F) => Observable<string[]>, // lista de Queries
    private readonly dataReader: (register: any) => T,
    private readonly dataNormalizer: (register: T) => Observable<T>,
  ) {}

  acl(key: string | null): Observable<Acl> {
    return this.aclResolver();
  }

  list(queryParams: F): Observable<Slide<T>> {
    const qp = queryParams as any;
    return this.filterResolver(qp).pipe(
      mergeMap((filters) => {
        const queries = [...filters];
        if (qp.limit) {
          queries.push(Query.limit(qp.limit));
        }
        if (qp.cursor) {
          queries.push(Query.cursorAfter(qp.cursor));
        }
        return from(this.database.listDocuments(this.databaseId, this.collectionId, queries)).pipe(
          map((response) => {
            const docs = response.documents.map((doc) => this.dataReader(doc));
            const next = (docs[docs.length - 1] as any)?.$id;
            return {
              content: docs,
              hasNext: !!next,
              next: { ...qp, cursor: next },
            };
          }),
        );
      }),
    ) as any;
  }

  retrieve(key: string): Observable<T> {
    return this.findDoc(key).pipe(map((doc) => this.dataReader(doc)));
  }

  add(item: T): Observable<T> {
    if (this.dataNormalizer) {
      return this.dataNormalizer(item).pipe(
        mergeMap((normalized) =>
          from(this.database.createDocument(this.databaseId, this.collectionId, ID.unique(), normalized)).pipe(
            map((doc) => this.dataReader({ ...doc, id: doc.$id }) as any),
          ),
        ),
      );
    } else {
      return from(this.database.createDocument(this.databaseId, this.collectionId, ID.unique(), item)).pipe(
        map((doc) => this.dataReader({ ...doc, id: doc.$id } as any)),
      );
    }
  }

  update(key: string, item: T): Observable<T> {
    if (this.dataNormalizer) {
      return this.dataNormalizer(item).pipe(
        mergeMap((normalized) =>
          this.findDoc(key).pipe(
            mergeMap((original) =>
              from(
                this.database.updateDocument(this.databaseId, this.collectionId, (original as any).$id, normalized),
              ).pipe(map((doc) => this.dataReader({ ...doc, id: doc.$id } as any))),
            ),
          ),
        ),
      );
    } else {
      return this.findDoc(key).pipe(
        mergeMap((original) =>
          from(this.database.updateDocument(this.databaseId, this.collectionId, (original as any).$id, item)).pipe(
            map((doc) => this.dataReader({ ...doc, id: doc.$id } as any)),
          ),
        ),
      );
    }
  }

  patch(keyUrl: string, data: Partial<T>): Observable<T> {
    const key = keyUrl.split('/')[0];
    return this.findDoc(key).pipe(
      mergeMap((original) => {
        const values = {} as any;
        Object.entries(original).forEach(([key, value]) => {
          if (key[0] != '$') {
            values[key] = value;
          }
        });
        const modified = { ...values, ...data } as any;
        if (this.dataNormalizer) {
          return this.dataNormalizer(modified).pipe(mergeMap(normalized => 
            from(
              this.database.updateDocument(this.databaseId, this.collectionId, (original as any).$id, normalized),
            ).pipe(map((doc) => this.dataReader({ ...doc, id: doc.$id }) as any))
          ));
        } else {
          return from(
            this.database.updateDocument(this.databaseId, this.collectionId, (original as any).$id, modified),
          ).pipe(map((doc) => this.dataReader({ ...doc, id: doc.$id }) as any));
        }
      }),
    );
  }

  delete(key: string): Observable<void> {
    return this.findDoc(key).pipe(
      mergeMap((original) => {
        return from(this.database.deleteDocument(this.databaseId, this.collectionId, (original as any).$id)).pipe(
          map(() => void 0),
        );
      }),
    );
  }

  storeFile(endpoint: string, name: string, file: File): Observable<UploadProgress> {
    const fileId = ID.unique();
    return new Observable<UploadProgress>((observer) => {
      this.storage.createFile(this.bucketId, fileId, file).then(
        (uploadedFile) => {
          const fileUrl = this.storage.getFileView(this.bucketId, uploadedFile.$id);
          observer.next(new UploadProgress().innerData(fileUrl.toString()));
          observer.complete();
        },
        (error) => observer.error(error),
      );
    });
  }

  old_downloadFile(endpoint: string): Observable<DownloadBlob> {
    return from(this.storage.getFileDownload(this.bucketId, endpoint)) as any;
  }

  downloadFile(base: string): Observable<DownloadBlob> {
    const fileId = this.extractFileId(base);
    if (!fileId) {
      throw new Error('Wrong Path');
    }
    const url = this.client.config.endpoint + `/storage/buckets/${this.bucketId}/files/${fileId}/download`;
    const headers = {
      'X-Appwrite-Project': this.client.config.project,
    };
    return forkJoin({
      metadata: from(this.storage.getFile(this.bucketId, fileId)),
      blob: from(
        fetch(url, { method: 'GET', credentials: 'include', headers: headers }).then(async (res) => res.blob()),
      ),
    }).pipe(map(({ metadata, blob }) => new DownloadBlob(blob, metadata.name)));
  }

  private findDoc(key: string): Observable<T> {
    const queries = [Query.equal(this.idName, key)];
    return defer(() => from(this.database.listDocuments(this.databaseId, this.collectionId, queries))).pipe(
      map((docs) => docs.documents[0] as any),
    );
  }

  private extractFileId(url: string): string | null {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const fileIndex = parts.indexOf('files');
    return fileIndex !== -1 && parts.length > fileIndex + 1 ? parts[fileIndex + 1] : null;
  }
}
