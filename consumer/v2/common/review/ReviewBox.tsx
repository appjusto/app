import { Order, OrderConsumerReview, WithId } from '@appjusto/types';
import { isEmpty } from 'lodash';
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
import { track } from '../../../../common/store/api/track';
import { showToast } from '../../../../common/store/ui/actions';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { NPSSelector } from './NPSSelector';
import { ThumbSelector } from './ThumbSelector';

interface Props extends ViewProps {
  order: WithId<Order>;
  children?: ReactNode | ReactNode[];
  onCompleteReview: () => void;
}

export const ReviewBox = ({ order, children, onCompleteReview }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // props
  const { courier, type } = order;
  // state
  const existingReview = useOrderReview(order.id);
  const [orderConsumerReview, setOrderConsumerReview] = React.useState<OrderConsumerReview>();
  const [isLoading, setLoading] = React.useState(false);
  // handlers
  const createReviewHandler = async () => {
    if (!orderConsumerReview) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      await api.order().createOrderConsumerReview(orderConsumerReview);
      track('review sent');
      onCompleteReview();
    } catch (error: any) {
      dispatch(showToast(t('Não foi possível enviar a avaliação'), 'error'));
    }
    setLoading(false);
  };
  // effect
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
      <SingleHeader title={t('Avalie sua experiência')} />
      <ThumbSelector
        title="Entregador"
        iconUnicode={0x1f6f5}
        review={orderConsumerReview?.courier?.rating}
        disabled={!isEmpty(existingReview?.courier?.rating)}
        onReviewChange={(type) =>
          setOrderConsumerReview({
            ...orderConsumerReview,
            orderId: order.id,
            courier: { id: courier?.id ?? null, rating: type },
          })
        }
      />
      {type === 'food' ? (
        <ThumbSelector
          title="Restaurante"
          iconUnicode={0x1f373}
          review={orderConsumerReview?.business?.rating}
          disabled={!isEmpty(existingReview?.business?.rating)}
          onReviewChange={(type) =>
            setOrderConsumerReview({
              ...orderConsumerReview,
              orderId: order.id,
              business: { id: order.business?.id ?? null, rating: type },
            })
          }
        />
      ) : null}
      <ThumbSelector
        title="AppJusto"
        iconUnicode={0x1f4f1}
        review={orderConsumerReview?.platform?.rating}
        disabled={!isEmpty(existingReview?.platform?.rating)}
        onReviewChange={(type) =>
          setOrderConsumerReview({
            ...orderConsumerReview,
            orderId: order.id,
            platform: { rating: type },
          })
        }
      />
      <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
      <View>
        <SingleHeader title={t('Deixe um comentário')} />
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          <Text style={{ ...texts.md, color: colors.grey700, paddingVertical: halfPadding }}>
            {t('Se preferir, descreva a sua experiência de forma anônima.')}
          </Text>
          <DefaultInput
            editable={isEmpty(existingReview?.comment)}
            placeholder={t('Escreva sua mensagem')}
            multiline
            numberOfLines={6}
            value={existingReview?.comment}
            onChangeText={(value) =>
              setOrderConsumerReview({
                ...orderConsumerReview,
                orderId: order.id,
                comment: value,
              })
            }
            style={{ height: 80 }}
          />
        </View>
      </View>
      <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
      <View>
        <SingleHeader title={t('Qual a probabilidade de indicar o AppJusto?')} />
        <View style={{ paddingHorizontal: padding, paddingBottom: padding }}>
          {/* NPS */}
          <NPSSelector
            selected={orderConsumerReview?.nps}
            onSelect={(value) =>
              setOrderConsumerReview({
                ...orderConsumerReview,
                orderId: order.id,
                nps: value,
              })
            }
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
      <View>
        <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
        <PaddedView>
          <DefaultButton
            title={t('Enviar')}
            activityIndicator={isLoading}
            disabled={isLoading}
            onPress={createReviewHandler}
          />
          <View style={{ paddingTop: padding }}>{children}</View>
        </PaddedView>
      </View>
    </View>
  );
};
