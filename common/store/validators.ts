export const isPhoneValid = (phone: string) => phone.replace(/[^0-9]/g, '').length === 11;
