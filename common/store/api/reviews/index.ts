import { OrderConsumerReview, Review, ReviewTag, ReviewTagType } from '@appjusto/types';
import firebase from 'firebase';
import FirebaseRefs from '../FirebaseRefs';
import { documentsAs } from '../types';

export default class ReviewsApi {
  constructor(private refs: FirebaseRefs, private firestore: firebase.firestore.Firestore) {}

  // firestore
  async createOrderConsumerReview(review: OrderConsumerReview) {
    await this.refs.getReviewsRef().add({
      ...review,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
    } as OrderConsumerReview);
  }
  async fetchOrderReview(orderId: string) {
    const snapshot = await this.refs.getReviewsRef().where('orderId', '==', orderId).limit(1).get();
    if (snapshot.empty) return null;
    return snapshot.docs.find(() => true)!.data() as OrderConsumerReview;
  }
  // async fetchReview(courierId: string, orderId: string) {
  //   const query = this.refs
  //     .getCourierReviewsRef(courierId)
  //     .where('orderId', '==', orderId)
  //     .limit(1);
  //   const docs = (await query.get()).docs;
  //   return documentsAs<Review>(docs).find(() => true);
  // }

  async fetchReviewTags(type: ReviewTagType) {
    const query = this.refs.getReviewTagsRef().where('type', '==', type);
    const docs = (await query.get()).docs;
    return documentsAs<ReviewTag>(docs);
  }
  async fetchCourierReviews(courierId: string) {
    const snapshot = await this.refs.getReviewsRef().where('courier.id', '==', courierId).get();
    if (snapshot.empty) return [];
    return documentsAs<Review>(snapshot.docs);
  }
}
