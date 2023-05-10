import storage from '@react-native-firebase/storage';

export default class FilesApi {
  // constructor(private storage: FirebaseStorage) {}

  // https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  private blobFromUri(uri: string, progressHandler?: (progress: number) => void): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onprogress = (ev) => {
        if (progressHandler) progressHandler(0);
      };
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

  async upload(path: string, uri: string, progressHandler?: (progress: number) => void) {
    return new Promise<boolean>(async (resolve, reject) => {
      const blob = await this.blobFromUri(uri);
      const fileRef = storage().ref(path);
      const task = fileRef.put(blob);
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressHandler) progressHandler(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          // @ts-ignore
          blob.close();
          resolve(true);
        }
      );
    });
  }

  async getDownloadURL(path: string): Promise<string | null> {
    const fileRef = storage().ref(path);
    try {
      const uri = await fileRef.getDownloadURL();
      return uri;
    } catch (error) {
      return null;
    }
  }

  async download(path: string, progressHandler?: (progress: number) => void) {
    try {
      const uri = await this.getDownloadURL(path);
      if (!uri) return null;
      const blob = await this.blobFromUri(uri, progressHandler);
      return blob;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
