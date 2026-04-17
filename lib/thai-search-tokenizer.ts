type Tokenizer = {
  language: string;
  normalizationCache: Map<string, string>;
  tokenize: (raw: string, language?: string, prop?: string, withCache?: boolean) => string[];
};

const thaiSegmenter = new Intl.Segmenter('th', { granularity: 'word' });
const latinSegmenter = new Intl.Segmenter('en', { granularity: 'word' });
const thaiCharPattern = /\p{Script=Thai}/u;
const latinNumberPattern = /[\p{Letter}\p{Number}]/u;

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

function segmentPart(part: string): string[] {
  const isThai = thaiCharPattern.test(part);
  const segmenter = isThai ? thaiSegmenter : latinSegmenter;

  return Array.from(segmenter.segment(part))
    .filter((entry) => entry.isWordLike)
    .map((entry) => normalizeToken(entry.segment))
    .filter(Boolean);
}

export function createThaiSearchTokenizer(): Tokenizer {
  return {
    language: 'thai-custom',
    normalizationCache: new Map(),
    tokenize(raw) {
      if (typeof raw !== 'string') return [];

      const normalized = raw.normalize('NFC');
      const parts = normalized.match(/[\p{Script=Thai}]+|[\p{Letter}\p{Number}]+/gu) ?? [];
      const tokens = parts.flatMap((part) => {
        if (thaiCharPattern.test(part)) return segmentPart(part);
        if (latinNumberPattern.test(part)) return [normalizeToken(part)];
        return [];
      });

      return Array.from(new Set(tokens));
    },
  };
}
