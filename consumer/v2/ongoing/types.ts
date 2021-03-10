export type OngoingOrderNavigatorParamList = {
  OrderConfirming: {
    orderId: string;
  };
  OrderNoMatch: {
    orderId: string;
  };
  OngoingOrder: {
    orderId: string;
    newMessage?: boolean;
  };
  // CourierDetail: {
  //   orderId: string;
  // };
  // ReportIssueOngoingOrder: {
  //   issueType: IssueType;
  //   orderId: string;
  // };
  // ConfirmCancelOrder: {
  //   orderId: string;
  // };
  // CancelOrder: {
  //   orderId: string;
  // };
  // OrderDeliveredFeedback: {
  //   orderId: string;
  // };
  // // Home: undefined;
};
// } & ChatParamList;
