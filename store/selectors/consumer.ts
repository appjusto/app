import { State } from "..";
import { ConsumerState, Consumer } from "../types/consumer";

export const getConsumerState = (state: State): ConsumerState => {
  return state.consumer;
}
export const getConsumer = (state:State):Consumer => getConsumerState(state).consumer;
export const getConsumerLocation = (state: State) => {
  const consumer = getConsumer(state);
  if (!consumer) return null;
  return consumer.location;
}