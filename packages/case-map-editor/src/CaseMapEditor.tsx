import { useTranslation } from 'react-i18next';

function CaseMapEditor() {
  const { t } = useTranslation();
  return <h1>{t('editor.title')}</h1>;
}

export default CaseMapEditor;
