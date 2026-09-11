import { AlgoConfig } from '../types/algo';

export type CodeLanguage = 'python' | 'java' | 'cpp' | 'typescript';

export interface TopicMeta {
  id: string;                                                         // unique slug within subject (e.g. 'binary-search')
  title: string;
  subtitle?: string;
  tags: string[];                                                     // e.g. ['array', 'binary-search']
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'ready' | 'coming-soon';
  loadConfig: () => Promise<AlgoConfig> | AlgoConfig;               // lazy-load thunk
}

export interface Subject {
  id: 'dsa' | 'lld' | 'hld' | 'networking' | 'os';
  title: string;
  description: string;
  color: string;                                                      // Tailwind color class for cards (e.g. 'from-blue-500 to-blue-700')
  icon: string;                                                       // icon name or emoji
  topics: TopicMeta[];
}

export interface CatalogIndex {
  subjects: Subject[];
  getSubjects(): Subject[];
  getSubject(id: string): Subject | undefined;
  getTopicsBySubject(subjectId: string): TopicMeta[];
  getTopic(subjectId: string, topicId: string): TopicMeta | undefined;
  getAllTopics(): TopicMeta[];
  searchTopics(query: string): TopicMeta[];
}
