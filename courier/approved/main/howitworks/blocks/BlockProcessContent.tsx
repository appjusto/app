import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { Accordion } from '../../../../../common/components/views/accordion/Accordion';
import { biggerPadding, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

interface Props {
  variant: 'how-it-works' | 'blocked';
}

export const BlockProcessContent = ({ variant }: Props) => {
  // state
  const [selectedItemTitle, setSelectedItemTitle] = React.useState('');
  // UI
  return (
    <PaddedView>
      {variant === 'how-it-works' ? (
        <View>
          <Text
            style={{
              ...texts.x2l,
              marginBottom: halfPadding,
            }}
          >
            {t('Por que o AppJusto tem bloqueios?')}
          </Text>
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              marginBottom: padding,
            }}
          >
            {t(
              'O AppJusto oferece suporte ao vivo para o entregador ou entregadora resolver problemas operacionais.'
            )}
          </Text>
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              marginBottom: biggerPadding,
            }}
          >
            {t(
              'Se os problemas apresentados não são resolvidos, a restrição de acesso poderá ser aplicada pelo controle operacional.'
            )}
          </Text>
        </View>
      ) : null}
      <Text
        style={[
          variant === 'how-it-works'
            ? {
                ...texts.x2l,
              }
            : { ...texts.lg },
          {
            marginBottom: padding,
          },
        ]}
      >
        {t('Entenda mais sobre os bloqueios')}
      </Text>
      <Accordion
        items={[
          {
            title: 'Quais são as formas de bloqueio?',
            body: [
              {
                title: 'Cadastro inativo',
                text: 'Nesse modo, o usuário pode acessar normalmente as telas do AppJusto. Pode, inclusive, transferir valores de corridas para o banco. Porém, não pode receber novas corridas no app.',
              },
              {
                title: 'Cadastro bloqueado',
                text: 'Quando o cadastro é bloqueado, o entregador terá acesso apenas ao botão de contato com o suporte.',
              },
            ],
            children: <View />,
          },
          {
            title: 'Quais são os principais motivos de bloqueio?',
            body: [
              {
                title: 'Extravio de produtos',
                text: 'Quando o pedido não é entregue para o consumidor, e também não é devolvido para a empresa ou pessoa física que solicitou a entrega, o pedido é classificado como extraviado.',
              },
              {
                title: 'Revisão do Perfil Operacional (RPO)',
                text: 'Este processo foi criado com o objetivo de ajudar entregadores a melhorarem sua conduta operacional, para evitarem uma futura restrição de acesso.',
              },
            ],
            children: <View />,
          },
          {
            title: 'Como somos avisados sobre o bloqueio?',
            body: [
              {
                title: 'Contato direto',
                text: 'Nosso time sempre tenta o contato por WhatsApp ou telefone antes de aplicar a restrição. É importante sempre atender ou retornar nosso contato durante as corridas.',
              },
              {
                title: 'Alerta na tela e mensagem por e-mail',
                text: 'Após o bloqueio, o aplicativo exibirá uma tela  específica de bloqueio e também enviamos uma mensagem para o e-mail cadastrado.',
              },
            ],
            children: <View />,
          },
          {
            title: 'Depois do bloqueio, é possível voltar a ter acesso à plataforma?',
            body: [
              {
                text: 'Sim! Já temos casos de retorno. Para voltar a ter acesso ao AppJusto, será preciso entrar em contato com o suporte, e seguir as instruções para resolver o problema.',
              },
              {
                text: 'Se o problema for resolvido, a pessoa será convidada a participar de uma Revisão de Perfil Operacional (RPO), para que as regras de qualidade da plataforma sejam firmadas, antes do acesso ser reestabelecido.',
              },
            ],
            children: <View />,
          },
          {
            title: 'Existe restrição de acesso sem retorno?',
            body: [
              {
                text: 'Sim! Já temos casos de retorno de usuários. Para voltar a ter acesso ao AppJusto, será preciso entrar em contato com o suporte, e seguir as instruções para resolver o problema.',
              },
              {
                text: 'Se o problema for resolvido, a pessoa será convidado a participar de uma Revisão de Perfil Operacional (RPO), para que as regras de qualidade da plataforma sejam firmadas, antes do acesso ser reestabelecido.',
              },
            ],
            children: <View />,
          },
        ]}
        selectedItemTitle={selectedItemTitle}
        onSelectItem={(title) => {
          setSelectedItemTitle((current) => (title !== current ? title : ''));
        }}
      />
    </PaddedView>
  );
};
