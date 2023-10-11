import { Flavor, OrderConsumerReview, Review, ReviewTag, WithId } from '@appjusto/types';
import { doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { OrderReview } from '../../../../../types';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { documentsAs } from '../types';

export default class ReviewsApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  // firestore
  async setOrderConsumerReview(review: Partial<OrderConsumerReview> | WithId<OrderConsumerReview>) {
    const reviewRef =
      'id' in review
        ? doc(this.firestoreRefs.getReviewsRef(), review.id)
        : doc(this.firestoreRefs.getReviewsRef());
    await setDoc(reviewRef, { ...review, reviewedOn: serverTimestamp() }, { merge: true });
    return reviewRef;
  }
  async fetchOrderReview(orderId: string, consumerId: string) {
    const snapshot = await getDocs(
      query(this.firestoreRefs.getReviewsRef(), where('orderId', '==', orderId))
    );
    if (snapshot.empty) return null;
    const reviews = documentsAs<OrderReview>(snapshot.docs);
    let review = reviews.find((review) => review.createdBy?.id === consumerId);
    if (review) return review;
    review = reviews.find((review) => review.consumer?.id === consumerId && !review.createdBy);
    return review;
  }

  async fetchReviewTags(agent: Flavor, type: string) {
    const querySnapshot = await getDocs(
      query(
        this.firestoreRefs.getReviewTagsRef(),
        where('agent', '==', agent),
        where('type', '==', type)
      )
    );
    return documentsAs<ReviewTag>(querySnapshot.docs);
  }

  async fetchCourierReviews(courierId: string) {
    const snapshot = await getDocs(
      query(this.firestoreRefs.getReviewsRef(), where('courier.id', '==', courierId))
    );
    if (snapshot.empty) return [];
    return documentsAs<Review>(snapshot.docs);
  }
}
