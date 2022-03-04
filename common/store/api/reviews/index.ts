import { Flavor, OrderConsumerReview, Review, ReviewTag, WithId } from '@appjusto/types';
import {
  doc,
  Firestore,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import FirebaseRefs from '../FirebaseRefs';
import { documentAs, documentsAs } from '../types';

export default class ReviewsApi {
  constructor(private refs: FirebaseRefs, private firestore: Firestore) {}

  // firestore
  async setOrderConsumerReview(review: Partial<OrderConsumerReview> | WithId<OrderConsumerReview>) {
    const reviewRef =
      'id' in review ? doc(this.refs.getReviewsRef(), review.id) : doc(this.refs.getReviewsRef());
    await setDoc(reviewRef, { ...review, reviewedOn: serverTimestamp() }, { merge: true });
    return reviewRef;
  }
  async fetchOrderReview(orderId: string) {
    const snapshot = await getDocs(
      query(this.refs.getReviewsRef(), where('orderId', '==', orderId), limit(1))
    );
    if (snapshot.empty) return null;
    return documentAs<OrderConsumerReview>(snapshot.docs.find(() => true)!);
  }

  async fetchReviewTags(agent: Flavor, type: string) {
    const querySnapshot = await getDocs(
      query(this.refs.getReviewTagsRef(), where('agent', '==', agent), where('type', '==', type))
    );
    return documentsAs<ReviewTag>(querySnapshot.docs);
  }

  async fetchCourierReviews(courierId: string) {
    const snapshot = await getDocs(
      query(this.refs.getReviewsRef(), where('courier.id', '==', courierId))
    );
    if (snapshot.empty) return [];
    return documentsAs<Review>(snapshot.docs);
  }
}
