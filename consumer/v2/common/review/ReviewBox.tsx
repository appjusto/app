import { Order, OrderConsumerReview, WithId } from '@appjusto/types';
import React, { ReactNode } from 'react';
import { Keyboard, Text, View, ViewProps } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { useOrderReview } from '../../../../common/store/api/order/reviews/useOrderReview';
import { useReviewTags } from '../../../../common/store/api/order/reviews/useReviewTags';
import { track } from '../../../../common/store/api/track';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { NPSSelector } from './NPSSelector';
import { ThumbSelector } from './ThumbSelector';

interface Props extends ViewProps {
  order: WithId<Order>;
  children?: ReactNode | ReactNode[];
  onCompleteReview?: () => void;
  screen: 'DeliveredOrderDetail' | 'OngoingOrderFeedback';
}

export const ReviewBox = ({ order, children, onCompleteReview, screen }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // props
  const { courier, type } = order;
  // state
  const existingReview = useOrderReview(order.id);
  const [orderConsumerReview, setOrderConsumerReview] =
    React.useState<Partial<OrderConsumerReview>>();
  const [isLoading, setLoading] = React.useState(false);
  const courierPositiveTags = useReviewTags('courier', 'positive');
  const courierNegativeTags = useReviewTags('courier', 'negative');
  const businessPositiveTags = useReviewTags('business', 'positive');
  const businessNegativeTags = useReviewTags('business', 'negative');
  const platformPositiveTags = useReviewTags('platform', 'positive');
  const platformNegativeTags = useReviewTags('platform', 'negative');
  // handlers
  const createReviewHandler = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (orderConsumerReview) {
        await api.reviews().setOrderConsumerReview({
          ...orderConsumerReview,
          orderId: order.id,
          consumer: { id: order.consumer.id },
        });
        dispatch(showToast(t('Avaliação enviada'), 'success'));
        track('review sent');
      }
      if (onCompleteReview) onCompleteReview();
    } catch (error: any) {
      dispatch(showToast(t('Não foi possível enviar a avaliação'), 'error'));
    }
    setLoading(false);
  };
  // side-effects
  React.useEffect(() => {
    if (existingReview) setOrderConsumerReview(existingReview);
  }, [existingReview]);
  // helpers
  const shouldNpsSelectorShow = () => {
    if (screen === 'DeliveredOrderDetail') {
      if (existingReview && !existingReview.nps) return false;
      else return true;
    } else return true;
  };
  const shouldCourierSelectorShow = () => {
    if (courier?.id) {
      if (screen === 'DeliveredOrderDetail') {
        if (existingReview && !existingReview.courier) return false;
        else return true;
      } else return true;
    } else return false;
  };
  const shouldBusinessSelectorShow = () => {
    if (type === 'food') {
      if (screen === 'DeliveredOrderDetail') {
        if (existingReview && !existingReview.business) return false;
        else return true;
      } else return true;
    } else return false;
  };
  const shouldPlatformSelectorShow = () => {
    if (screen === 'DeliveredOrderDetail') {
      if (existingReview && !existingReview.platform) return false;
      else return true;
    } else return true;
  };
  const shouldCommentShow = () => {
    if (screen === 'DeliveredOrderDetail') {
      if (existingReview && !existingReview.comment) return false;
      else return true;
    } else return true;
  };
  const title = () => {
    if (screen === 'DeliveredOrderDetail') {
      if (existingReview) return t('Avaliação enviada');
      else return t('Enviar');
    } else return t('Finalizar');
  };
  // UI
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {shouldNpsSelectorShow() ? (
        <View>
          <SingleHeader title={t('Qual a probabilidade de indicar o AppJusto?')} />
          <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
            {/* NPS */}
            <NPSSelector
              selected={orderConsumerReview?.nps}
              onSelect={(value) => {
                setOrderConsumerReview({ ...orderConsumerReview, orderId: order.id, nps: value });
              }}
              disabled={!!existingReview}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: padding,
              }}
            >
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Pouco provável')}</Text>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Muito provável')}</Text>
            </View>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Clique para compartilhar o movimento nas suas redes"
            />
          </View>
          <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
        </View>
      ) : null}
      <SingleHeader title={t('Avalie sua experiência')} />
      {shouldCourierSelectorShow() ? (
        <ThumbSelector
          title="Entregador"
          iconUnicode={0x1f6f5}
          review={orderConsumerReview?.courier?.rating}
          tags={
            orderConsumerReview?.courier?.rating === 'negative'
              ? courierNegativeTags
              : courierPositiveTags
          }
          selectedTags={orderConsumerReview?.courier?.tags ?? []}
          onReviewChange={(type) => {
            setOrderConsumerReview({
              orderId: order.id,
              ...orderConsumerReview,
              courier: {
                ...orderConsumerReview?.courier,
                id: courier ? courier.id : null,
                rating: type,
              },
            });
          }}
          onTagsChange={(tags) => {
            setOrderConsumerReview({
              ...orderConsumerReview,
              courier: {
                id: courier ? courier.id : null,
                rating: orderConsumerReview?.courier?.rating!,
                tags,
              },
            });
          }}
          disabled={!!existingReview}
        />
      ) : null}
      {shouldBusinessSelectorShow() ? (
        <View>
          <ThumbSelector
            title="Restaurante"
            iconUnicode={0x1f373}
            review={orderConsumerReview?.business?.rating}
            tags={
              orderConsumerReview?.business?.rating === 'negative'
                ? businessNegativeTags
                : businessPositiveTags
            }
            selectedTags={orderConsumerReview?.business?.tags ?? []}
            onReviewChange={(type) => {
              setOrderConsumerReview({
                ...orderConsumerReview,
                business: {
                  id: order.business ? order.business.id : null,
                  rating: type,
                  tags: orderConsumerReview?.business?.tags,
                },
              });
            }}
            onTagsChange={(tags) => {
              setOrderConsumerReview({
                ...orderConsumerReview,
                business: {
                  id: order.business ? order.business.id : null,
                  rating: orderConsumerReview?.business?.rating!,
                  tags,
                },
              });
            }}
            disabled={!!existingReview}
          />
        </View>
      ) : null}
      {shouldPlatformSelectorShow() ? (
        <ThumbSelector
          title="AppJusto"
          iconUnicode={0x1f4f1}
          review={orderConsumerReview?.platform?.rating}
          tags={
            orderConsumerReview?.platform?.rating === 'negative'
              ? platformNegativeTags
              : platformPositiveTags
          }
          selectedTags={orderConsumerReview?.platform?.tags ?? []}
          onReviewChange={(type) => {
            setOrderConsumerReview({
              orderId: order.id,
              ...orderConsumerReview,
              platform: { ...orderConsumerReview?.platform, rating: type },
            });
          }}
          onTagsChange={(tags) => {
            setOrderConsumerReview({
              orderId: order.id,
              ...orderConsumerReview,
              platform: { rating: orderConsumerReview?.platform?.rating!, tags },
            });
          }}
          disabled={!!existingReview}
        />
      ) : null}
      {shouldCommentShow() ? (
        <View>
          <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
          <SingleHeader title={t('Deixe um comentário')} />
          <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
            <Text style={{ ...texts.md, color: colors.grey700, paddingVertical: halfPadding }}>
              {t('Se preferir, descreva a sua experiência de forma anônima.')}
            </Text>
            <DefaultInput
              placeholder={t('Escreva sua mensagem')}
              multiline
              numberOfLines={6}
              value={orderConsumerReview?.comment}
              onChangeText={(text) => {
                setOrderConsumerReview({
                  ...orderConsumerReview,
                  orderId: order.id,
                  comment: text,
                });
              }}
              style={{ height: 80 }}
              editable={!existingReview}
            />
          </View>
        </View>
      ) : null}
      <View>
        <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
        <PaddedView>
          <DefaultButton
            title={title()}
            activityIndicator={isLoading}
            disabled={isLoading || !!existingReview}
            onPress={createReviewHandler}
          />
          <View style={{ paddingTop: padding }}>{children}</View>
        </PaddedView>
      </View>
    </View>
  );
};
