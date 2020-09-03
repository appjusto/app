import firebase from 'firebase';

export default class FilesApi {
  constructor(private storage: firebase.storage.Storage) {}

  // https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  private blobFromUri(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response as Blob); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed')); // error occurred, rejecting
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });
  }

  async upload(path: string, uri: string) {
    const blob = await this.blobFromUri(uri);

    const ref = this.storage.ref().child(path);
    const task = ref.put(blob);
    task.on('state_changed', null, null, () => {
      blob.close();
    });
    return { task };
  }
}
