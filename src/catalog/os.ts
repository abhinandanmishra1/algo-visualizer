import { TopicMeta } from './types';

export const osTopics: TopicMeta[] = [
  {
    id: 'process-scheduling',
    title: 'Process Scheduling',
    subtitle: 'FCFS, RR, SJF, priority queues',
    tags: ['scheduling', 'cpu', 'processes'],
    difficulty: 'beginner',
    status: 'coming-soon',
    loadConfig: () => { throw new Error('Process Scheduling not yet implemented'); },
  },
  {
    id: 'deadlock-detection',
    title: 'Deadlock Detection & Recovery',
    subtitle: 'Resource allocation graph & prevention',
    tags: ['concurrency', 'deadlock', 'synchronization'],
    difficulty: 'intermediate',
    status: 'coming-soon',
    loadConfig: () => { throw new Error('Deadlock Detection not yet implemented'); },
  },
  {
    id: 'virtual-memory',
    title: 'Virtual Memory & Paging',
    subtitle: 'Page replacement, TLB, memory management',
    tags: ['memory', 'paging', 'virtual-memory'],
    difficulty: 'intermediate',
    status: 'coming-soon',
    loadConfig: () => { throw new Error('Virtual Memory not yet implemented'); },
  },
  {
    id: 'producer-consumer',
    title: 'Producer-Consumer Problem',
    subtitle: 'Bounded buffer & synchronization',
    tags: ['concurrency', 'synchronization', 'mutex'],
    difficulty: 'intermediate',
    status: 'coming-soon',
    loadConfig: () => { throw new Error('Producer-Consumer not yet implemented'); },
  },
  {
    id: 'semaphore-mutex',
    title: 'Semaphores & Mutexes',
    subtitle: 'Binary semaphores, counting semaphores',
    tags: ['synchronization', 'concurrency', 'locking'],
    difficulty: 'intermediate',
    status: 'coming-soon',
    loadConfig: () => { throw new Error('Semaphore-Mutex not yet implemented'); },
  },
];
