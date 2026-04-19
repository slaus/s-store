import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import styles from "./modal.module.css";
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
    <div className={styles._}>
      <h3 className={styles.header}>{t('agree')}</h3>
      <div className={styles.desc}>{t('agree_desc')}</div>
      <div className={styles.footer}>
        <Button className={styles.btn} onClick={onConfirm}>
          {t('yes')}
        </Button>
      </div>
    </div>
  );
};

export default ModalAlert;