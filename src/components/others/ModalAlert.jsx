import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import modalAlert from "@styles/ModalAlert.module.css";
import { sendTelegramOrder } from '../../utils/helpers';
import { useOrderDetails, useReset } from '@/context/AppContext';

const ModalAlert = ({ setModal }) => {
  const t = useTranslations('checkout');
  const router = useRouter();
  const locale = useLocale();
  const orderData = useOrderDetails();
  const reset = useReset();

  const onConfirm = async () => {
    // const WSP_URL = getWspUrl(orderData);
    // window.open(WSP_URL, "_blank");
    await sendTelegramOrder(orderData);
    setModal(false);
    reset();
    router.push(`/${locale}`);
  };

  return (
    <div className={modalAlert._}>
      <h3 className={modalAlert.header}>{t('agree')}</h3>
      <div className={modalAlert.desc}>{t('agree_desc')}</div>
      <div className={modalAlert.footer}>
        <Button className={modalAlert.btn} onClick={onConfirm}>
          {t('yes')}
        </Button>
      </div>
    </div>
  );
};

export default ModalAlert;