import { FirebaseError } from 'firebase/app';
import { t } from '../../../strings';

export const getFirebaseAuthErrorMessages = (error: unknown) => {
  if (!error) return t('Não foi possível acessar o servidor. Por favor, tente novamente.');
  else if ((error as FirebaseError).code === 'auth/account-exists-with-different-credential')
    return t(
      'Já existe um número de telefone associado à essa conta. Por favor, entre em contato com o suporte '
    );
  else if ((error as FirebaseError).code === 'auth/invalid-credential')
    return t('Credencial expirada ou inválida. Faça login novamente e tente outra vez.');
  else if ((error as FirebaseError).code === 'auth/operation-not-allowed')
    return t('Operação não permitida para o seu usuário');
  else if ((error as FirebaseError).code === 'auth/user-disabled')
    return t('Este usuário foi desabilitado.');
  else if ((error as FirebaseError).code === 'auth/user-not-found')
    return t('Usuário não encontrado');
  else if ((error as FirebaseError).code === 'auth/wrong-password')
    return t('Senha incorreta. Tente novamente.');
  else if ((error as FirebaseError).code === 'auth/too-many-requests')
    return t(
      'O acesso a esta conta, via senha, foi temporariamente desativado devido a muitas tentativas de login. Por favor, entre em contato com o suporte.'
    );
  else if ((error as FirebaseError).code === 'auth/invalid-verification-code')
    return t('O código não é valido. Clique em "Enviar novamente" e tente de novo.');
  else if ((error as FirebaseError).code === 'auth/invalid-verification-id')
    return t('O código não é valido. Clique em "Enviar novamente" e tente de novo.');
  else if ((error as FirebaseError).code === 'auth/invalid-verification-id')
    return t('Id de verificação incorreto. Operação não processada');
  else if ((error as FirebaseError).code === 'auth/provider-already-linked')
    return t(
      'Esse número já está associado à uma outra conta. Edite seu perfil e tente novamente.'
    );
  else if ((error as FirebaseError).code === 'auth/code-expired')
    return t('O código expirou. Clique em "Enviar novamente" e tente de novo.');
  else if ((error as FirebaseError).code === 'permission-denied') return t('Permissão negada');
  else if ((error as FirebaseError).code === 'deadline-exceeded')
    return t('Tempo de execução excedido');
  else return (error as FirebaseError).message;
};
