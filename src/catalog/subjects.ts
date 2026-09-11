import { Subject } from './types';
import { dsaTopics } from './dsa';
import { lldTopics } from './lld';
import { hldTopics } from './hld';
import { networkingTopics } from './networking';
import { osTopics } from './os';

export const SUBJECTS: Subject[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental DS and classic algorithms',
    color: 'from-blue-500 to-blue-700',
    icon: '📊',
    topics: dsaTopics,
  },
  {
    id: 'lld',
    title: 'Low-Level Design (LLD)',
    description: 'Design patterns and system components',
    color: 'from-purple-500 to-purple-700',
    icon: '⚙️',
    topics: lldTopics,
  },
  {
    id: 'hld',
    title: 'High-Level Design (HLD)',
    description: 'Scalable system architecture',
    color: 'from-pink-500 to-pink-700',
    icon: '🏗️',
    topics: hldTopics,
  },
  {
    id: 'networking',
    title: 'Networking & Protocols',
    description: 'TCP/IP, DNS, HTTP, OSI layers',
    color: 'from-green-500 to-green-700',
    icon: '🌐',
    topics: networkingTopics,
  },
  {
    id: 'os',
    title: 'Operating Systems',
    description: 'Process scheduling, memory, concurrency',
    color: 'from-orange-500 to-orange-700',
    icon: '⚡',
    topics: osTopics,
  },
];
