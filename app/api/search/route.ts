import { guideSource } from '@/lib/source';
import { createThaiSearchTokenizer } from '@/lib/thai-search-tokenizer';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(guideSource, {
  tokenizer: createThaiSearchTokenizer(),
});
