import type { Topic } from '../types/game';

interface TopicIndex {
  id: string;
  file: string;
  emoji: string;
}

export async function loadTopics(): Promise<Topic[]> {
  const indexRes = await fetch('/topics/index.json');
  const index: TopicIndex[] = await indexRes.json();

  const topics: Topic[] = await Promise.all(
    index.map(async (entry) => {
      const res = await fetch(entry.file);
      return res.json() as Promise<Topic>;
    })
  );

  return topics;
}
