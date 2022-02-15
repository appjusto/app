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
  buttonTitle: string;
  screen: 'DeliveredOrderDetail' | 'OngoingOrderFeedback';
}

export const ReviewBox = ({ order, children, onCompleteReview, buttonTitle, screen }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // props
  const { courier, type } = order;
  // state
  const existingReview = useOrderReview(order.id);
  const [orderConsumerReview, setOrderConsumerReview] = React.useState<OrderConsumerReview>();
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
        await api.reviews().setOrderConsumerReview(orderConsumerReview);
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
  // UI
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      <View>
        <SingleHeader title={t('Qual a probabilidade de indicar o AppJusto?')} />
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          {/* NPS */}
          <NPSSelector
            selected={orderConsumerReview?.nps}
            onSelect={(value) => {
              setOrderConsumerReview({ ...orderConsumerReview, orderId: order.id, nps: value });
            }}
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
      </View>
      <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
      <SingleHeader title={t('Avalie sua experiência')} />
      {courier?.id ? (
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
              courier: { ...orderConsumerReview!.courier, id: courier ? courier.id : null, tags },
            });
          }}
        />
      ) : null}
      {type === 'food' ? (
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
                orderId: order.id,
                ...orderConsumerReview,
                business: {
                  ...orderConsumerReview?.business,
                  id: order.business ? order.business.id : null,
                  rating: type,
                },
              });
            }}
            onTagsChange={(tags) => {
              setOrderConsumerReview({
                ...orderConsumerReview,
                business: {
                  ...orderConsumerReview?.business,
                  id: order.business ? order.business.id : null,
                  tags,
                },
              });
            }}
          />
        </View>
      ) : null}
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
            platform: { ...orderConsumerReview?.platform, tags },
          });
        }}
      />
      <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
      <View>
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
              setOrderConsumerReview({ ...orderConsumerReview, orderId: order.id, comment: text });
            }}
            style={{ height: 80 }}
          />
        </View>
      </View>
      <View>
        <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
        <PaddedView>
          <DefaultButton
            title={buttonTitle}
            activityIndicator={isLoading}
            disabled={
              screen === 'OngoingOrderFeedback'
                ? isLoading
                : isLoading || existingReview === orderConsumerReview
            }
            onPress={createReviewHandler}
          />
          <View style={{ paddingTop: padding }}>{children}</View>
        </PaddedView>
      </View>
    </View>
  );
};
