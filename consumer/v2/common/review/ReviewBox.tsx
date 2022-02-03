import { Order, OrderConsumerReview, ReviewTag, ReviewType, WithId } from '@appjusto/types';
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
  const [courierRating, setCourierRating] = React.useState<ReviewType | undefined>(
    existingReview?.courier?.rating ?? undefined
  );
  const [businessRating, setBusinessRating] = React.useState<ReviewType | undefined>(
    existingReview?.business?.rating ?? undefined
  );
  const [platformRating, setPlatformRating] = React.useState<ReviewType | undefined>(
    existingReview?.platform?.rating ?? undefined
  );
  const [selectedCourierTags, setSelectedCourierTags] = React.useState<ReviewTag[]>(
    orderConsumerReview?.courier?.tags ?? []
  );
  const [selectedBusinessTags, setSelectedBusinessTags] = React.useState<ReviewTag[]>(
    orderConsumerReview?.business?.tags ?? []
  );
  const [selectedPlatformTags, setSelectedPlatformTags] = React.useState<ReviewTag[]>(
    orderConsumerReview?.platform?.tags ?? []
  );
  const [nps, setNps] = React.useState<number>();
  const [comment, setComment] = React.useState<string>();
  const courierPositiveTags = useReviewTags('courier', 'positive');
  const courierNegativeTags = useReviewTags('courier', 'negative');
  const businessPositiveTags = useReviewTags('business', 'positive');
  const businessNegativeTags = useReviewTags('business', 'negative');
  const platformPositiveTags = useReviewTags('platform', 'positive');
  const platformNegativeTags = useReviewTags('platform', 'negative');

  // handlers
  const createReviewHandler = async () => {
    if (!orderConsumerReview) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      await api.reviews().createOrderConsumerReview(orderConsumerReview);
      track('review sent');
      if (onCompleteReview) onCompleteReview();
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
        tags={courierRating === 'negative' ? courierNegativeTags : courierPositiveTags}
        selectedTags={selectedCourierTags}
        onReviewChange={(type) => setCourierRating(type)}
        onTagsChange={(tags) => setSelectedCourierTags(tags)}
      />

      {type === 'food' ? (
        <View>
          <ThumbSelector
            title="Restaurante"
            iconUnicode={0x1f373}
            review={orderConsumerReview?.business?.rating}
            disabled={!isEmpty(existingReview?.business?.rating)}
            tags={businessRating === 'negative' ? businessNegativeTags : businessPositiveTags}
            selectedTags={selectedBusinessTags}
            onReviewChange={(type) => setBusinessRating(type)}
            onTagsChange={(tags) => setSelectedBusinessTags(tags)}
          />
        </View>
      ) : null}
      <ThumbSelector
        title="AppJusto"
        iconUnicode={0x1f4f1}
        review={orderConsumerReview?.platform?.rating}
        disabled={!isEmpty(existingReview?.platform?.rating)}
        tags={platformRating === 'negative' ? platformNegativeTags : platformPositiveTags}
        selectedTags={selectedPlatformTags}
        onReviewChange={(type) => setPlatformRating(type)}
        onTagsChange={(tags) => setSelectedPlatformTags(tags)}
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
            value={comment}
            onChangeText={(text) => setComment(text)}
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
            disabled={!isEmpty(orderConsumerReview?.nps)}
            selected={nps}
            onSelect={(value) => setNps(value)}
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
            title={existingReview ? t('Avaliação enviada') : t('Enviar')}
            activityIndicator={isLoading}
            disabled={isLoading || !!existingReview || !orderConsumerReview}
            onPress={createReviewHandler}
          />
          <View style={{ paddingTop: padding }}>{children}</View>
        </PaddedView>
      </View>
    </View>
  );
};
