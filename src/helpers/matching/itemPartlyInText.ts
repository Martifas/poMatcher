export function itemPartlyInText(description: string, text: string): boolean {
  if (!description) return false;

  const stopwords = ['sales', 'manager', 'order', 'dear', 'regards', 'team', 'best', 'contact'];

  const keywords = description
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !stopwords.includes(w));
  const bodyLower = text.toLowerCase();

  let matchCount = 0;
  keywords.forEach((kw) => {
    if (bodyLower.includes(kw)) matchCount++;
  });

  return matchCount >= 2;
}
