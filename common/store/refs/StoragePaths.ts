export class StoragePaths {
  getCourierSelfiePath = (courierId: string, size?: string) =>
    `couriers/${courierId}/selfie${size ? `_${size}` : ''}.jpg`;
  getCourierDocumentPath = (courierId: string, size?: string) =>
    `couriers/${courierId}/document${size ? `_${size}` : ''}.jpg`;

  // consumer
  getConsumerStoragePath = (consumerId: string) => `consumers/${consumerId}`;
  getConsumerSelfieStoragePath = (consumerId: string, size?: string) =>
    `consumers/${consumerId}/selfie${size ? `_${size}` : ''}.jpg`;
  getConsumerDocumentStoragePath = (consumerId: string, size?: string) =>
    `consumers/${consumerId}/document${size ? `_${size}` : ''}.jpg`;

  // orders
  getOrderPODPackagePath = (orderId: string, courierId: string) =>
    `orders/${orderId}/${courierId}/package.jpg`;
  getOrderPODFrontPath = (orderId: string, courierId: string) =>
    `orders/${orderId}/${courierId}/front.jpg`;

  // business
  getBusinessStoragePath = (businessId: string) => `businesses/${businessId}`;
  getBusinessLogoUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo.jpg`;
  getBusinessLogoStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/logo_240x240.jpg`;
  getBusinessCoverUploadStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover.jpg`;
  getBusinessCoverStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/cover_1008x360.jpg`;
  getProductsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/products`;
  getProductImageStoragePath = (businessId: string, productId: string, size: string) =>
    `${this.getProductsStoragePath(businessId)}/${productId}_${size}.jpg`;
  getComplementsStoragePath = (businessId: string) =>
    `${this.getBusinessStoragePath(businessId)}/complements`;
  getComplementUploadStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
  getComplementImageStoragePath = (businessId: string, complementId: string) =>
    `${this.getComplementsStoragePath(businessId)}/${complementId}_288x288.jpg`;
}
