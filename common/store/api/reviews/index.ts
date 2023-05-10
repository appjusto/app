import { Flavor, OrderConsumerReview, Review, ReviewTag, WithId } from '@appjusto/types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { documentAs, documentsAs } from '../types';
export default class ReviewsApi {
  constructor(private firestoreRefs: FirestoreRefs) {}

  // firestore
  async setOrderConsumerReview(review: Partial<OrderConsumerReview> | WithId<OrderConsumerReview>) {
    const reviewRef =
      'id' in review
        ? this.firestoreRefs.getReviewsRef().doc(review.id)
        : this.firestoreRefs.getReviewsRef().doc();
    await reviewRef.set(
      {
        ...review,
        reviewedOn:
          FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      },
      { merge: true }
    );
    return reviewRef;
  }
  async fetchOrderReview(orderId: string) {
    const snapshot = await this.firestoreRefs
      .getReviewsRef()
      .where('orderId', '==', orderId)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return documentAs<OrderConsumerReview>(snapshot.docs.find(() => true)!);
  }

  async fetchReviewTags(agent: Flavor, type: string) {
    const querySnapshot = await this.firestoreRefs
      .getReviewTagsRef()
      .where('agent', '==', agent)
      .where('type', '==', type)
      .get();

    return documentsAs<ReviewTag>(querySnapshot.docs);
  }

  async fetchCourierReviews(courierId: string) {
    const snapshot = await this.firestoreRefs
      .getReviewsRef()
      .where('courier.id', '==', courierId)
      .get();
    if (snapshot.empty) return [];
    return documentsAs<Review>(snapshot.docs);
  }
}
