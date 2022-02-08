import { Flavor, OrderConsumerReview, Review, ReviewTag, WithId } from '@appjusto/types';
import firebase from 'firebase';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

export default class ReviewsApi {
  constructor(private refs: FirebaseRefs, private firestore: firebase.firestore.Firestore) {}

  // firestore
  async setOrderConsumerReview(review: OrderConsumerReview | WithId<OrderConsumerReview>) {
    const doc =
      'id' in review ? this.refs.getReviewRef(review.id) : this.refs.getReviewsRef().doc();
    await doc.set(
      { ...review, reviewedOn: firebase.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    return doc;
  }
  async fetchOrderReview(orderId: string) {
    const snapshot = await this.refs.getReviewsRef().where('orderId', '==', orderId).limit(1).get();
    if (snapshot.empty) return null;
    return documentAs<OrderConsumerReview>(snapshot.docs.find(() => true)!);
  }
  // async fetchReview(courierId: string, orderId: string) {
  //   const query = this.refs
  //     .getCourierReviewsRef(courierId)
  //     .where('orderId', '==', orderId)
  //     .limit(1);
  //   const docs = (await query.get()).docs;
  //   return documentsAs<Review>(docs).find(() => true);
  // }

  async fetchReviewTags(agent: Flavor, type: string) {
    const query = this.refs
      .getReviewTagsRef()
      .where('agent', '==', agent)
      .where('type', '==', type);
    const docs = (await query.get()).docs;
    return documentsAs<ReviewTag>(docs);
  }
  async fetchCourierReviews(courierId: string) {
    const snapshot = await this.refs.getReviewsRef().where('courier.id', '==', courierId).get();
    if (snapshot.empty) return [];
    return documentsAs<Review>(snapshot.docs);
  }
}
