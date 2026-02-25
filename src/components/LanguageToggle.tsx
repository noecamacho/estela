import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      data-testid="language-toggle"
      onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
      className="cursor-pointer bg-transparent px-1.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-fg-subtle transition-colors hover:text-fg"
      aria-label={t.language.toggle}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
}
