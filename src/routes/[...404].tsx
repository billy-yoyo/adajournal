import { useTranslate } from "~/utils/translate";

export default function NotFound() {
  const { t } = useTranslate();
  
  return (
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-xl">{t('errors--not-found')}</h1>
    </main>
  );
}
