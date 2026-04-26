'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import loading from "@styles/Loading.module.css";

const Loading = () => {
  const t = useTranslations('common');

  return <div className={loading._}>{t('loading')}</div>;
};

export default Loading;