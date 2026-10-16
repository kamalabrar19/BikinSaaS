import { CompanyProfilePage } from "@/components/sections/CompanyProfilePage";
import { defaultLocale, getDictionary, isValidLocale } from "@/lib/i18n";
import { Locale } from "@/types";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang: Locale = isValidLocale(rawLang) ? rawLang : defaultLocale;
  const { dictionary } = getDictionary(lang);

  return <CompanyProfilePage dict={dictionary} lang={lang} />;
}
