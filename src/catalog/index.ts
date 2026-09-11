import { SUBJECTS } from './subjects';
import { Subject, TopicMeta, CatalogIndex } from './types';

const catalog: CatalogIndex = {
  subjects: SUBJECTS,

  getSubjects(): Subject[] {
    return SUBJECTS;
  },

  getSubject(id: string): Subject | undefined {
    return SUBJECTS.find(s => s.id === id);
  },

  getTopicsBySubject(subjectId: string): TopicMeta[] {
    const subject = catalog.getSubject(subjectId);
    return subject?.topics ?? [];
  },

  getTopic(subjectId: string, topicId: string): TopicMeta | undefined {
    const topics = catalog.getTopicsBySubject(subjectId);
    return topics.find(t => t.id === topicId);
  },

  getAllTopics(): TopicMeta[] {
    return SUBJECTS.flatMap(s => s.topics);
  },

  searchTopics(query: string): TopicMeta[] {
    const lowerQuery = query.toLowerCase();
    return catalog.getAllTopics().filter(
      t => t.title.toLowerCase().includes(lowerQuery) ||
           t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
};

export { catalog };
export type { Subject, TopicMeta, CatalogIndex };
export { SUBJECTS };
