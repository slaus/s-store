import React, { useState, useEffect, useRef } from "react";
import styles from "@/components/checkout/checkout-form.module.css";
import {
  BiUser,
  BiPhone,
  BiMap,
  BiMapAlt,
  BiAnchor,
  BiMessage,
} from "react-icons/bi";
import SliderCheckbox from "@/components/ui/SliderCheckbox";
import {
  useDelivery,
  useFormState,
  useOrderDetails,
} from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { getFormValidations } from "../../helpers";
import ModalAlert from "@/components/others/ModalAlert";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import { useTranslations } from 'next-intl';

const CheckoutForm = () => {
  const t = useTranslations('checkout');
  const v = useTranslations('validation');
  const validations = getFormValidations(v);

  const { setFormState } = useFormState();
  const { cartItems } = useOrderDetails();
  const { delivery, setDelivery } = useDelivery();
  const [checked, setChecked] = useState(delivery);
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const phoneInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  register("phone", validations.phone);

  useEffect(() => {
    setChecked(delivery);
  }, [delivery]);

  const handlePhoneFocus = () => {
    if (!phoneDisplay || phoneDisplay === "+380") {
      setPhoneDisplay("+380");
      setValue("phone", "+380", { shouldValidate: false });
    }
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, "");
    
    if (digits.startsWith("380")) {
      digits = digits.slice(3);
    }
    if (digits.length > 9) digits = digits.slice(0, 9);
    
    const formatted = `+380${digits}`;
    setPhoneDisplay(formatted);
    setValue("phone", formatted, { shouldValidate: true });
    trigger("phone");
  };

  const handlePhoneBlur = () => {
    trigger("phone");
  };

  const [showModal, setModal] = useState(false);
  const toggleChecked = () => {
    if (cartItems.length === 0) return;
    setChecked(!checked);
    setDelivery(!delivery);
  };

  const onSubmit = (formState) => {
    setFormState(formState);
    setModal(true);
  };

  return (
    <>
      <div className={styles._}>
        <h3 className={styles.title}>{t('your_data')}</h3>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.delivery}>
            <div className={styles.label}>{t('is_delivery')}</div>
            <SliderCheckbox checked={checked} toggleChecked={toggleChecked} />
          </div>

          <div className={`${styles.group} ${errors?.name ? styles.err : ""} ${cartItems.length === 0 ? styles.disabled : ""}`}>
            <div className={styles.icon}>
              <BiUser size={20} />
            </div>
            <input
              type="text"
              placeholder={t('name')}
              className={styles.input}
              disabled={cartItems.length === 0}
              {...register("name", validations.name)}
            />
            {errors?.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>

          <div className={`${styles.group} ${errors?.phone ? styles.err : ""} ${cartItems.length === 0 ? styles.disabled : ""}`}>
            <div className={styles.icon}>
              <BiPhone size={20} />
            </div>
            <input
              type="tel"
              placeholder="+380XXXXXXXXX"
              className={styles.input}
              disabled={cartItems.length === 0}
              value={phoneDisplay}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
            />
            {errors?.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>

          {delivery && (
            <>
              <div className={`${styles.group} ${errors?.address ? styles.err : ""}`}>
                <div className={styles.icon}>
                  <BiMap size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('stock')}
                  className={styles.input}
                  {...register("address", validations.address)}
                />
                {errors?.address && <p className={styles.error}>{errors.address.message}</p>}
              </div>
              <div className={`${styles.group} ${errors?.city ? styles.err : ""}`}>
                <div className={styles.icon}>
                  <BiMapAlt size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('city')}
                  className={styles.input}
                  {...register("city", validations.city)}
                />
                {errors?.city && <p className={styles.error}>{errors.city.message}</p>}
              </div>
              <div className={`${styles.group} ${errors?.schedule ? styles.err : ""}`}>
                <div className={styles.icon}>
                  <BiAnchor size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('area')}
                  className={styles.input}
                  {...register("schedule", validations.schedule)}
                />
                {errors?.schedule && <p className={styles.error}>{errors.schedule.message}</p>}
              </div>
            </>
          )}

          <div className={`${styles.group} ${errors?.comment ? styles.err : ""} ${cartItems.length === 0 ? styles.disabled : ""}`}>
            <div className={styles.icon}>
              <BiMessage size={20} />
            </div>
            <input
              type="text"
              placeholder={t('comment')}
              className={styles.input}
              disabled={cartItems.length === 0}
              {...register("comment", validations.comment)}
            />
            {errors?.comment && <p className={styles.error}>{errors.comment.message}</p>}
          </div>

          <button type="submit" className={styles.confirm} disabled={cartItems.length === 0}>
            {t('checkout')}
          </button>
        </form>
      </div>

      {showModal && (
        <Overlay>
          <Modal setIsModalOpen={setModal}>
            <ModalAlert showModal={showModal} setModal={setModal} />
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default CheckoutForm;