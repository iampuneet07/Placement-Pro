// Client-Side Demo Data Store for PlacementPro
// Provides offline-first / Vercel standalone preview fallback with localStorage persistence

const STORAGE_KEY = 'placementpro_demo_store_v1';

const INITIAL_STUDENT = {
  _id: 'demo',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@college.edu',
  college: 'National Institute of Technology (NIT)',
  degreeBranch: 'B.Tech Computer Science & Engineering',
  graduationYear: 2025,
  cgpa: 8.65,
  skills: [
    'Data Structures & Algorithms',
    'JavaScript (ES6+)',
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB & Mongoose',
    'SQL & Relational DBs',
    'C++',
    'Git & GitHub',
    'RESTful APIs',
  ],
  preferredRole: 'Full Stack Software Engineer',
  preferredCompanies: ['TCS', 'Infosys', 'Accenture', 'Microsoft', 'Cognizant', 'Capgemini'],
  resumeUrl: 'https://drive.google.com/file/d/demo-rahul-sharma-resume/view',
  githubUrl: 'https://github.com/rahulsharma-cse',
  linkedinUrl: 'https://linkedin.com/in/rahulsharma-dev',
  bio: 'Final year CSE undergraduate enthusiastic about scalable web systems, clean architecture, and problem-solving through DSA.',
  isDemo: true,
};

const INITIAL_DSA_QUESTIONS = [
  {
    _id: 'dsa-1',
    title: 'Two Sum',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    companyTags: ['Amazon', 'Google', 'TCS Digital', 'Infosys'],
    practiceUrl: 'https://leetcode.com/problems/two-sum/',
    status: 'Solved',
    notes: 'Used Hash Map for O(n) time and O(n) space complexity.',
  },
  {
    _id: 'dsa-2',
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Arrays',
    difficulty: 'Easy',
    description: 'Find maximum profit you can achieve from one purchase and one sale of stock.',
    companyTags: ['Amazon', 'Accenture', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    status: 'Solved',
    notes: 'Single pass track minimum price so far and maximum difference.',
  },
  {
    _id: 'dsa-3',
    title: 'Maximum Subarray (Kadane’s Algorithm)',
    topic: 'Arrays',
    difficulty: 'Medium',
    description: 'Find the subarray with the largest sum and return its sum.',
    companyTags: ['Microsoft', 'Capgemini', 'Wipro'],
    practiceUrl: 'https://leetcode.com/problems/maximum-subarray/',
    status: 'Solved',
    notes: 'Classic Kadanes algorithm with O(n) time and O(1) space.',
  },
  {
    _id: 'dsa-4',
    title: 'Trapping Rain Water',
    topic: 'Arrays',
    difficulty: 'Hard',
    description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    companyTags: ['Amazon', 'Google', 'TCS Prime'],
    practiceUrl: 'https://leetcode.com/problems/trapping-rain-water/',
    status: 'In Progress',
    notes: 'Exploring Two Pointer approach vs prefix max arrays.',
  },
  {
    _id: 'dsa-5',
    title: 'Valid Palindrome',
    topic: 'Strings',
    difficulty: 'Easy',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.',
    companyTags: ['TCS', 'Infosys', 'Wipro'],
    practiceUrl: 'https://leetcode.com/problems/valid-palindrome/',
    status: 'Solved',
    notes: 'Two pointers moving inward skipping non-alphanumeric chars.',
  },
  {
    _id: 'dsa-6',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Strings',
    difficulty: 'Medium',
    description: 'Given a string s, find the length of the longest substring without duplicate characters.',
    companyTags: ['Amazon', 'Accenture', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    status: 'Solved',
    notes: 'Sliding window technique using a Set/Map.',
  },
  {
    _id: 'dsa-7',
    title: 'Reverse a Linked List',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    companyTags: ['TCS', 'Infosys', 'Capgemini', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    status: 'Solved',
    notes: 'Iterative approach with prev, curr, and next pointers.',
  },
  {
    _id: 'dsa-8',
    title: 'Detect Cycle in a Linked List (Floyd’s Cycle)',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    description: 'Determine if the linked list has a cycle in it using two pointers.',
    companyTags: ['Amazon', 'TCS Digital', 'Wipro'],
    practiceUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    status: 'Solved',
    notes: 'Slow and fast pointer (tortoise and hare).',
  },
  {
    _id: 'dsa-9',
    title: 'LRU Cache',
    topic: 'Linked Lists',
    difficulty: 'Medium',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    companyTags: ['Google', 'Microsoft', 'Amazon'],
    practiceUrl: 'https://leetcode.com/problems/lru-cache/',
    status: 'Not Started',
    notes: 'Need doubly linked list combined with hash map.',
  },
  {
    _id: 'dsa-10',
    title: 'Valid Parentheses',
    topic: 'Stacks and Queues',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters (), {}, [], determine if the input string is valid.',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Capgemini'],
    practiceUrl: 'https://leetcode.com/problems/valid-parentheses/',
    status: 'Solved',
    notes: 'Stack push opening brackets and pop matching closings.',
  },
  {
    _id: 'dsa-11',
    title: 'Implement Queue using Stacks',
    topic: 'Stacks and Queues',
    difficulty: 'Easy',
    description: 'Implement a first-in-first-out (FIFO) queue using only two stacks.',
    companyTags: ['Cognizant', 'Wipro', 'TCS'],
    practiceUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/',
    status: 'Solved',
    notes: 'Two stacks: inStack and outStack amortized O(1).',
  },
  {
    _id: 'dsa-12',
    title: 'Search in Rotated Sorted Array',
    topic: 'Searching and Sorting',
    difficulty: 'Medium',
    description: 'Given the array nums after possible rotation and an integer target, return the index of target if it is in nums.',
    companyTags: ['Amazon', 'Microsoft', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    status: 'In Progress',
    notes: 'Identify which half is sorted first.',
  },
  {
    _id: 'dsa-13',
    title: 'Merge Sort Implementation',
    topic: 'Searching and Sorting',
    difficulty: 'Medium',
    description: 'Implement merge sort algorithm and analyze its divide-and-conquer time complexity.',
    companyTags: ['TCS Digital', 'Accenture', 'Capgemini'],
    practiceUrl: 'https://www.geeksforgeeks.org/merge-sort/',
    status: 'Solved',
    notes: 'Recursive divide and merge, O(n log n) time and O(n) auxiliary space.',
  },
  {
    _id: 'dsa-14',
    title: 'Maximum Depth of Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, return its maximum depth.',
    companyTags: ['TCS', 'Infosys', 'Accenture'],
    practiceUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    status: 'Solved',
    notes: '1 + max(leftDepth, rightDepth) base case root == null return 0.',
  },
  {
    _id: 'dsa-15',
    title: 'Invert / Mirror Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    companyTags: ['Google', 'Capgemini', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    status: 'Solved',
    notes: 'Swap left and right children recursively.',
  },
  {
    _id: 'dsa-16',
    title: 'Lowest Common Ancestor of a Binary Tree',
    topic: 'Binary Trees',
    difficulty: 'Medium',
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
    companyTags: ['Amazon', 'Microsoft', 'TCS Prime'],
    practiceUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
    status: 'In Progress',
    notes: 'Traverse left and right; if both non-null, root is LCA.',
  },
  {
    _id: 'dsa-17',
    title: 'Number of Islands (BFS / DFS)',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: 'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    companyTags: ['Amazon', 'Google', 'Accenture'],
    practiceUrl: 'https://leetcode.com/problems/number-of-islands/',
    status: 'Solved',
    notes: 'Grid traversal using DFS/BFS marking visited cells to 0.',
  },
  {
    _id: 'dsa-18',
    title: 'Course Schedule (Detect Cycle in Graph)',
    topic: 'Graphs',
    difficulty: 'Medium',
    description: 'Determine if it is possible to finish all courses given prerequisite dependencies (Topological Sort / Kahn’s Algo).',
    companyTags: ['Microsoft', 'Amazon', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/course-schedule/',
    status: 'Not Started',
    notes: 'Use Kahn’s algorithm with in-degree array.',
  },
  {
    _id: 'dsa-19',
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    companyTags: ['TCS', 'Infosys', 'Capgemini', 'Wipro'],
    practiceUrl: 'https://leetcode.com/problems/climbing-stairs/',
    status: 'Solved',
    notes: 'Fibonacci recurrence dp[i] = dp[i-1] + dp[i-2].',
  },
  {
    _id: 'dsa-20',
    title: 'Coin Change Problem',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: 'Find fewest number of coins that you need to make up a given amount using available denominations.',
    companyTags: ['Amazon', 'TCS Digital', 'Cognizant'],
    practiceUrl: 'https://leetcode.com/problems/coin-change/',
    status: 'In Progress',
    notes: 'Unbounded knapsack style 1D DP initialized to infinity.',
  },
  {
    _id: 'dsa-21',
    title: 'Longest Increasing Subsequence (LIS)',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    companyTags: ['Microsoft', 'Google', 'Accenture'],
    practiceUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    status: 'Not Started',
    notes: 'O(n^2) DP or O(n log n) with patience sorting / binary search.',
  },
];

const INITIAL_COMPANIES = [
  {
    _id: 'comp-1',
    companyName: 'TCS',
    slug: 'tcs',
    logoText: 'TATA CONSULTANCY SERVICES',
    badgeColor: '#1e3a8a',
    overview: 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions. Recruits through TCS NQT across Ninja, Digital, and Prime tiers.',
    hiringTiers: ['TCS Ninja (3.36 - 3.6 LPA)', 'TCS Digital (7.0 - 7.5 LPA)', 'TCS Prime (9.0 - 11.5 LPA)'],
    recruitmentPattern: [
      { roundNumber: 1, roundName: 'TCS NQT Cognitive Test', details: 'Numerical Ability (80 min), Verbal Ability (25 min), Reasoning Ability (25 min)' },
      { roundNumber: 2, roundName: 'NQT Technical & Coding', details: 'Hands-on programming: 2 questions (1 easy-medium, 1 advanced)' },
      { roundNumber: 3, roundName: 'Technical Interview', details: 'Core CS topics (OOPS, DBMS, SQL, DSA), Final year project walkthrough' },
      { roundNumber: 4, roundName: 'Managerial & HR Round', details: 'Situational questions, relocation preferences, company background' },
    ],
    aptitudeTopics: [
      { id: 'tcs-apt-1', topic: 'Time, Speed & Distance & Work', category: 'Quantitative', completed: true },
      { id: 'tcs-apt-2', topic: 'Percentages, Profit & Loss, Ratios', category: 'Quantitative', completed: true },
      { id: 'tcs-apt-3', topic: 'Coding-Decoding & Blood Relations', category: 'Logical', completed: true },
      { id: 'tcs-apt-4', topic: 'Syllogisms & Data Sufficiency', category: 'Logical', completed: false },
      { id: 'tcs-apt-5', topic: 'Reading Comprehension & Para Jumbles', category: 'Verbal', completed: true },
    ],
    codingTopics: [
      { id: 'tcs-code-1', topic: 'Array manipulation and prefix sum', difficulty: 'Easy', completed: true },
      { id: 'tcs-code-2', topic: 'String anagrams and frequency maps', difficulty: 'Easy', completed: true },
      { id: 'tcs-code-3', topic: 'Matrix rotations and spiral traversal', difficulty: 'Medium', completed: false },
      { id: 'tcs-code-4', topic: 'Dynamic programming memoization', difficulty: 'Medium', completed: false },
    ],
    technicalTopics: [
      { id: 'tcs-tech-1', topic: 'OOPS Concepts: Polymorphism, Inheritance, Encapsulation', completed: true },
      { id: 'tcs-tech-2', topic: 'DBMS: Normalization (1NF, 2NF, 3NF, BCNF) & ACID Properties', completed: true },
      { id: 'tcs-tech-3', topic: 'SQL Queries: Joins, Group By, Having, Subqueries', completed: true },
      { id: 'tcs-tech-4', topic: 'Operating Systems: Process vs Thread, Deadlock Conditions', completed: false },
      { id: 'tcs-tech-5', topic: 'B.Tech Final Year Project Architecture Explanation', completed: true },
    ],
    hrQuestions: [
      { id: 'tcs-hr-1', question: 'Tell me about yourself and your academic journey.', tip: 'Structure as: Current education -> key technical projects -> why TCS matches your aspirations.', completed: true },
      { id: 'tcs-hr-2', question: 'Why do you want to join TCS over other IT service firms?', tip: 'Highlight TCS scale, research innovation (Tata Research), stability, and learning ecosystem.', completed: true },
      { id: 'tcs-hr-3', question: 'Are you comfortable working in night shifts or relocating anywhere in India?', tip: 'Demonstrate adaptability, positive attitude, and willingness to learn in diverse project environments.', completed: false },
    ],
    studentNotes: 'Focus extra on TCS NQT quantitative section time management. Prepare detailed explanation of my MERN stack placement project.',
  },
  {
    _id: 'comp-2',
    companyName: 'Infosys',
    slug: 'infosys',
    logoText: 'INFOSYS',
    badgeColor: '#0284c7',
    overview: 'Infosys is a global leader in next-generation digital services and consulting. Recruits through InfyTQ, HackWithInfy, and campus drives.',
    hiringTiers: ['System Engineer (3.6 LPA)', 'Digital Specialist Engineer - DSE (6.25 LPA)', 'Specialist Programmer - SP (9.5 LPA)'],
    recruitmentPattern: [
      { roundNumber: 1, roundName: 'Online Assessment', details: 'Reasoning Ability (15 Qs), Mathematical Ability (10 Qs), Verbal (20 Qs), Pseudocode (5 Qs), Puzzle Solving (4 Qs)' },
      { roundNumber: 2, roundName: 'Technical Round', details: 'Core Java/Python/C++, Data Structures, DBMS, Web Development fundamentals' },
      { roundNumber: 3, roundName: 'HR Round', details: 'Behavioral assessment, communication skills, learning readiness' },
    ],
    aptitudeTopics: [
      { id: 'infy-apt-1', topic: 'Cryptarithmetic & Sudoku-style Puzzles', category: 'Logical', completed: true },
      { id: 'infy-apt-2', topic: 'Permutations, Combinations & Probability', category: 'Quantitative', completed: true },
      { id: 'infy-apt-3', topic: 'Critical Reasoning & Statement Assumptions', category: 'Logical', completed: false },
      { id: 'infy-apt-4', topic: 'Sentence Correction & Vocabulary in Context', category: 'Verbal', completed: true },
    ],
    codingTopics: [
      { id: 'infy-code-1', topic: 'Pseudocode dry-running and debugging', difficulty: 'Easy', completed: true },
      { id: 'infy-code-2', topic: 'Two pointer problems on sorted arrays', difficulty: 'Easy', completed: true },
      { id: 'infy-code-3', topic: 'Binary search variations', difficulty: 'Medium', completed: false },
    ],
    technicalTopics: [
      { id: 'infy-tech-1', topic: 'Method Overloading vs Overriding with code snippets', completed: true },
      { id: 'infy-tech-2', topic: 'Primary Key vs Unique Key vs Foreign Key constraints', completed: true },
      { id: 'infy-tech-3', topic: 'Computer Networks: OSI Layers and TCP vs UDP differences', completed: false },
    ],
    hrQuestions: [
      { id: 'infy-hr-1', question: 'Where do you see yourself in 3 years at Infosys?', tip: 'Mention achieving specialized certifications in Cloud/Fullstack and taking up module lead responsibilities.', completed: true },
      { id: 'infy-hr-2', question: 'How do you handle strict deadlines when multiple tasks pile up?', tip: 'Describe your prioritization matrix and communication with team members.', completed: false },
    ],
    studentNotes: 'Practice Infosys-specific cryptarithmetic puzzle questions and pseudocode loops.',
  },
  {
    _id: 'comp-3',
    companyName: 'Accenture',
    slug: 'accenture',
    logoText: 'ACCENTURE',
    badgeColor: '#7c3aed',
    overview: 'Accenture is a Fortune Global 500 company providing strategy, consulting, technology, and operations services.',
    hiringTiers: ['Associate Software Engineer - ASE (4.5 LPA)', 'Advanced Associate Software Engineer - AASE (6.5 LPA)'],
    recruitmentPattern: [
      { roundNumber: 1, roundName: 'Cognitive & Technical Assessment', details: 'Critical Thinking, English Ability, Abstract Reasoning, Common Application & MS Office, Cloud Fundamentals' },
      { roundNumber: 2, roundName: 'Coding Assessment', details: '2 Hands-on Coding questions (C/C++/Java/Python)' },
      { roundNumber: 3, roundName: 'Communication Assessment', details: 'Automated AI test measuring reading, listening, and speaking fluency' },
      { roundNumber: 4, roundName: 'Virtual Interview', details: 'Combined Technical and HR interview based on resume projects' },
    ],
    aptitudeTopics: [
      { id: 'acc-apt-1', topic: 'Abstract Reasoning & Pattern Completion', category: 'Logical', completed: true },
      { id: 'acc-apt-2', topic: 'Common Applications and MS Office basics', category: 'Technical Aptitude', completed: true },
      { id: 'acc-apt-3', topic: 'Networking, Security & Cloud Fundamentals', category: 'Technical Aptitude', completed: true },
    ],
    codingTopics: [
      { id: 'acc-code-1', topic: 'String transformation and palindrome checks', difficulty: 'Easy', completed: true },
      { id: 'acc-code-2', topic: 'Array difference and frequency count', difficulty: 'Easy', completed: true },
    ],
    technicalTopics: [
      { id: 'acc-tech-1', topic: 'SDLC methodologies: Agile vs Waterfall differences', completed: true },
      { id: 'acc-tech-2', topic: 'Cloud service models: IaaS, PaaS, SaaS explanations', completed: true },
      { id: 'acc-tech-3', topic: 'Basic Git commands and version control flow', completed: true },
    ],
    hrQuestions: [
      { id: 'acc-hr-1', question: 'Describe a challenging project where you overcame a major bug.', tip: 'Use STAR method (Situation, Task, Action, Result).', completed: true },
    ],
    studentNotes: 'Communication assessment requires a quiet room and clear pronunciation. Accent is evaluated by automated voice AI.',
  },
  {
    _id: 'comp-4',
    companyName: 'Microsoft',
    slug: 'microsoft',
    logoText: 'MICROSOFT',
    badgeColor: '#00a4ef',
    overview: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, and personal computers.',
    hiringTiers: ['Software Development Engineer - SDE (14.0 - 45.0 LPA)'],
    recruitmentPattern: [
      { roundNumber: 1, roundName: 'Online Coding Test', details: '3 Algorithmic problems on Codility platform (90 min)' },
      { roundNumber: 2, roundName: 'Technical Round 1', details: 'Deep dive into DSA, complexity analysis, and live coding' },
      { roundNumber: 3, roundName: 'Technical Round 2', details: 'Low-Level Design (LLD), Tree/Graph problem solving, OS & concurrency' },
      { roundNumber: 4, roundName: 'Managerial / AA (As Appropriate) Round', details: 'System design overview, cultural alignment, leadership values' },
    ],
    aptitudeTopics: [
      { id: 'ms-apt-1', topic: 'Logical deduction and discrete mathematics', category: 'Logical', completed: true },
    ],
    codingTopics: [
      { id: 'ms-code-1', topic: 'Binary Trees and Lowest Common Ancestor', difficulty: 'Medium', completed: true },
      { id: 'ms-code-2', topic: 'Graph DFS/BFS & Topological Sorting', difficulty: 'Medium', completed: false },
      { id: 'ms-code-3', topic: 'Dynamic Programming on Grids and Subsequences', difficulty: 'Hard', completed: false },
    ],
    technicalTopics: [
      { id: 'ms-tech-1', topic: 'Virtual Memory, Paging, and Thread Synchronization', completed: false },
      { id: 'ms-tech-2', topic: 'Design Patterns: Singleton, Factory, and Observer', completed: true },
      { id: 'ms-tech-3', topic: 'Database Indexing mechanisms (B-Tree vs Hash Indexing)', completed: true },
    ],
    hrQuestions: [
      { id: 'ms-hr-1', question: 'How do you exemplify Microsoft’s "Growth Mindset" culture?', tip: 'Give a concrete example of learning from a failure or receiving critical feedback.', completed: true },
    ],
    studentNotes: 'High emphasis on clean code structure, modular functions, and edge case handling.',
  },
];

const INITIAL_APPLICATIONS = [
  {
    _id: 'app-1',
    company: 'TCS',
    role: 'Digital Specialist Trainee',
    type: 'Full-time',
    location: 'Pan India / Pune',
    salaryPackage: '7.2 LPA',
    applicationDate: '2025-01-10',
    deadline: '2025-01-28',
    status: 'Online Assessment',
    jobUrl: 'https://www.tcs.com/careers',
    recruiterNotes: 'NQT score 84th percentile. Received link for TCS Digital interview scheduling.',
    interviewDate: '2025-02-18',
    notes: 'Re-read TCS company prep notes on Advanced Coding and DBMS ACID properties.',
  },
  {
    _id: 'app-2',
    company: 'Infosys',
    role: 'Digital Specialist Engineer (DSE)',
    type: 'Full-time',
    location: 'Bangalore / Mysore',
    salaryPackage: '6.25 LPA',
    applicationDate: '2025-01-05',
    deadline: '2025-01-20',
    status: 'Interview',
    jobUrl: 'https://www.infosys.com/careers',
    recruiterNotes: 'Cleared technical round. Final HR and technical discussion scheduled.',
    interviewDate: '2025-02-22',
    notes: 'Brush up on OOPs concept differences in Java/C++ and puzzle questions.',
  },
  {
    _id: 'app-3',
    company: 'Accenture',
    role: 'Advanced Associate Software Engineer',
    type: 'Full-time',
    location: 'Hyderabad / Gurgaon',
    salaryPackage: '6.5 LPA',
    applicationDate: '2024-12-18',
    deadline: '2025-01-10',
    status: 'Offer',
    jobUrl: 'https://accenture.com/careers',
    recruiterNotes: 'Letter of Intent (LOI) issued! Onboarding July 2025.',
    interviewDate: '2025-01-15',
    notes: 'Review offer details and submit final semester marksheets.',
  },
  {
    _id: 'app-4',
    company: 'Cognizant',
    role: 'GenC Next Programmer',
    type: 'Full-time',
    location: 'Chennai / Coimbatore',
    salaryPackage: '6.75 LPA',
    applicationDate: '2025-01-12',
    deadline: '2025-02-05',
    status: 'Applied',
    jobUrl: 'https://careers.cognizant.com',
    recruiterNotes: 'Application submitted via campus portal. Under review.',
    interviewDate: '',
    notes: 'Check college placement cell notifications daily.',
  },
  {
    _id: 'app-5',
    company: 'Capgemini',
    role: 'Senior Analyst - Cloud & Web',
    type: 'Full-time',
    location: 'Mumbai / Pune',
    salaryPackage: '5.75 LPA',
    applicationDate: '2025-01-08',
    deadline: '2025-01-25',
    status: 'Interview',
    jobUrl: 'https://capgemini.com/careers',
    recruiterNotes: 'HR round scheduled for upcoming week.',
    interviewDate: '2025-02-26',
    notes: 'Prepare leadership and conflict resolution STAR answers.',
  },
  {
    _id: 'app-6',
    company: 'Microsoft',
    role: 'Software Development Engineer (Intern)',
    type: 'Intern + PPO',
    location: 'Hyderabad / Bangalore',
    salaryPackage: '18.0 LPA',
    applicationDate: '2025-01-02',
    deadline: '2025-01-15',
    status: 'Wishlist',
    jobUrl: 'https://careers.microsoft.com',
    recruiterNotes: 'Preparing resume and referral request through alumni.',
    interviewDate: '',
    notes: 'Focus on Graphs and Dynamic Programming before applying.',
  },
];

const INITIAL_MOCK_QUESTIONS = [
  {
    _id: 'mock-1',
    category: 'DSA',
    questionType: 'subjective',
    questionText: 'Explain the difference between an Array and a Linked List in terms of memory allocation, insertion, and lookup time complexity.',
    keyAnswerPoints: ['contiguous', 'pointer', 'O(1) lookup', 'O(n) search', 'dynamic sizing'],
    sampleAnswer: 'Arrays store elements in contiguous memory allowing O(1) random access by index, but have fixed size and O(n) insertions/deletions. Linked lists use node pointers with dynamic memory allocation, allowing O(1) insertion at head/tail but O(n) lookup because sequential traversal is required.',
    difficulty: 'Easy',
  },
  {
    _id: 'mock-2',
    category: 'DSA',
    questionType: 'mcq',
    questionText: 'What is the worst-case time complexity of QuickSort when a bad pivot is consistently chosen?',
    options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
    correctAnswerIndex: 1,
    sampleAnswer: 'In the worst case (e.g., already sorted array and choosing the first/last element as pivot), QuickSort degrades to O(n^2) because each partition only reduces problem size by 1.',
    difficulty: 'Easy',
  },
  {
    _id: 'mock-3',
    category: 'DBMS',
    questionType: 'subjective',
    questionText: 'What are ACID properties in a Relational Database Management System? Explain each briefly.',
    keyAnswerPoints: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    sampleAnswer: 'ACID stands for: Atomicity (all operations in a transaction succeed or all roll back), Consistency (database transitions from one valid state to another maintaining constraints), Isolation (concurrent transactions execute independently without interference), and Durability (committed changes persist even during system crashes).',
    difficulty: 'Easy',
  },
  {
    _id: 'mock-4',
    category: 'OOPS',
    questionType: 'subjective',
    questionText: 'Explain Compile-time Polymorphism vs Run-time Polymorphism with real-world examples.',
    keyAnswerPoints: ['method overloading', 'method overriding', 'static binding', 'dynamic binding', 'virtual functions'],
    sampleAnswer: 'Compile-time polymorphism (Static Binding) is achieved through Method Overloading where methods share the same name with different parameters, resolved by compiler. Run-time polymorphism (Dynamic Binding) is achieved through Method Overriding where a subclass provides a specific implementation of a method defined in its superclass, resolved at runtime.',
    difficulty: 'Medium',
  },
  {
    _id: 'mock-5',
    category: 'HR',
    questionType: 'subjective',
    questionText: 'Tell me about a situation where you had a conflict with a team member during a college project and how you resolved it.',
    keyAnswerPoints: ['communication', 'listen', 'focus on project goal', 'compromise', 'positive outcome'],
    sampleAnswer: 'In our 3rd-year web project, my teammate and I disagreed on database choice (SQL vs MongoDB). Rather than arguing, I scheduled a technical review meeting where we evaluated read/write requirements, schema flexibility, and team familiarity. We objectively chose MongoDB and delivered the project 3 days ahead of deadline.',
    difficulty: 'Medium',
  },
];

class DemoStore {
  constructor() {
    this.data = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read demo storage:', e);
    }

    const defaultData = {
      student: INITIAL_STUDENT,
      dsaQuestions: INITIAL_DSA_QUESTIONS,
      companies: INITIAL_COMPANIES,
      applications: INITIAL_APPLICATIONS,
      mockQuestions: INITIAL_MOCK_QUESTIONS,
      mockHistory: [
        {
          _id: 'hist-1',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          category: 'DSA & Technical',
          score: 85,
          totalQuestions: 5,
          summary: 'Strong performance on time complexities and data structure operations.',
        },
      ],
      studyHours: [
        { day: 'Mon', hours: 3.5 },
        { day: 'Tue', hours: 4.0 },
        { day: 'Wed', hours: 2.5 },
        { day: 'Thu', hours: 5.0 },
        { day: 'Fri', hours: 3.0 },
        { day: 'Sat', hours: 6.0 },
        { day: 'Sun', hours: 4.5 },
      ],
    };

    this.saveToStorage(defaultData);
    return defaultData;
  }

  saveToStorage(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save demo storage:', e);
    }
  }

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.loadFromStorage();
    return this.data;
  }

  // Student
  getStudent() {
    return { success: true, data: this.data.student };
  }

  updateStudent(payload) {
    this.data.student = { ...this.data.student, ...payload };
    this.saveToStorage();
    return { success: true, data: this.data.student, message: 'Profile updated in offline demo store' };
  }

  // DSA
  getDsaQuestions(params = {}) {
    let list = [...this.data.dsaQuestions];
    if (params.topic && params.topic !== 'All') {
      list = list.filter((q) => q.topic === params.topic);
    }
    if (params.difficulty && params.difficulty !== 'All') {
      list = list.filter((q) => q.difficulty === params.difficulty);
    }
    if (params.status && params.status !== 'All') {
      list = list.filter((q) => q.status === params.status);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter((q) => q.title.toLowerCase().includes(s) || (q.companyTags || []).some((t) => t.toLowerCase().includes(s)));
    }

    const total = this.data.dsaQuestions.length;
    const solved = this.data.dsaQuestions.filter((q) => q.status === 'Solved').length;
    const inProgress = this.data.dsaQuestions.filter((q) => q.status === 'In Progress').length;
    const notStarted = this.data.dsaQuestions.filter((q) => q.status === 'Not Started').length;

    return {
      success: true,
      data: list,
      stats: { total, solved, inProgress, notStarted },
    };
  }

  updateDsaQuestion(id, payload) {
    const idx = this.data.dsaQuestions.findIndex((q) => q._id === id);
    if (idx !== -1) {
      this.data.dsaQuestions[idx] = { ...this.data.dsaQuestions[idx], ...payload };
      this.saveToStorage();
      return { success: true, data: this.data.dsaQuestions[idx] };
    }
    return { success: false, message: 'Question not found' };
  }

  createDsaQuestion(payload) {
    const newQ = {
      _id: 'dsa-' + Date.now(),
      status: 'Not Started',
      ...payload,
    };
    this.data.dsaQuestions.unshift(newQ);
    this.saveToStorage();
    return { success: true, data: newQ };
  }

  deleteDsaQuestion(id) {
    this.data.dsaQuestions = this.data.dsaQuestions.filter((q) => q._id !== id);
    this.saveToStorage();
    return { success: true, message: 'Question removed from demo store' };
  }

  getDsaTopicStats() {
    const topicsMap = {};
    for (const q of this.data.dsaQuestions) {
      if (!topicsMap[q.topic]) topicsMap[q.topic] = { topic: q.topic, total: 0, solved: 0 };
      topicsMap[q.topic].total += 1;
      if (q.status === 'Solved') topicsMap[q.topic].solved += 1;
    }
    return { success: true, data: Object.values(topicsMap) };
  }

  // Companies
  getCompanies() {
    return { success: true, data: this.data.companies };
  }

  getCompanyById(id) {
    const comp = this.data.companies.find((c) => c._id === id || c.slug === id);
    return { success: !!comp, data: comp };
  }

  toggleCompanyTopic(companyId, section, itemId, completed) {
    const comp = this.data.companies.find((c) => c._id === companyId || c.slug === companyId);
    if (comp && comp[section]) {
      const item = comp[section].find((it) => (it._id || it.id) === itemId);
      if (item) {
        item.completed = completed;
        this.saveToStorage();
        return { success: true, data: comp };
      }
    }
    return { success: false, message: 'Item not found' };
  }

  // Applications
  getApplications(params = {}) {
    let list = [...this.data.applications];
    if (params.status && params.status !== 'All') {
      list = list.filter((a) => a.status === params.status);
    }
    if (params.type && params.type !== 'All') {
      list = list.filter((a) => a.type === params.type);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter((a) => a.company.toLowerCase().includes(s) || a.role.toLowerCase().includes(s));
    }

    const counts = {};
    for (const a of this.data.applications) {
      counts[a.status] = (counts[a.status] || 0) + 1;
    }

    return {
      success: true,
      data: list,
      stats: { total: this.data.applications.length, statusCounts: counts },
    };
  }

  createApplication(payload) {
    const newApp = {
      _id: 'app-' + Date.now(),
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      ...payload,
    };
    this.data.applications.unshift(newApp);
    this.saveToStorage();
    return { success: true, data: newApp };
  }

  updateApplication(id, payload) {
    const idx = this.data.applications.findIndex((a) => a._id === id);
    if (idx !== -1) {
      this.data.applications[idx] = { ...this.data.applications[idx], ...payload };
      this.saveToStorage();
      return { success: true, data: this.data.applications[idx] };
    }
    return { success: false, message: 'Application not found' };
  }

  deleteApplication(id) {
    this.data.applications = this.data.applications.filter((a) => a._id !== id);
    this.saveToStorage();
    return { success: true, message: 'Application removed' };
  }

  // Mock Interviews
  getMockQuestions(category = 'All', limit = 5) {
    let list = [...this.data.mockQuestions];
    if (category && category !== 'All') {
      list = list.filter((q) => q.category === category);
    }
    return { success: true, data: list.slice(0, Number(limit) || 5) };
  }

  evaluateMockInterview(payload) {
    const record = {
      _id: 'mock-eval-' + Date.now(),
      date: new Date().toISOString(),
      category: payload.category || 'General Assessment',
      score: payload.score || 80,
      totalQuestions: payload.totalQuestions || 5,
      summary: payload.summary || 'Mock interview completed successfully.',
    };
    this.data.mockHistory.unshift(record);
    this.saveToStorage();
    return { success: true, data: record };
  }

  getMockInterviewHistory() {
    return { success: true, data: this.data.mockHistory };
  }

  // Dashboard Analytics
  getDashboardAnalytics() {
    const totalDsa = this.data.dsaQuestions.length;
    const solvedDsa = this.data.dsaQuestions.filter((q) => q.status === 'Solved').length;
    const totalApplications = this.data.applications.length;
    const interviewsScheduled = this.data.applications.filter((a) => a.status === 'Interview').length;
    const offers = this.data.applications.filter((a) => a.status === 'Offer').length;

    const dsaWeight = totalDsa > 0 ? (solvedDsa / totalDsa) * 60 : 0;
    const appWeight = totalApplications > 0 ? Math.min(totalApplications * 5, 25) : 0;
    const offerBonus = offers > 0 ? 15 : interviewsScheduled > 0 ? 10 : 0;
    const overallProgress = Math.min(100, Math.round(dsaWeight + appWeight + offerBonus));

    const statusCounts = {};
    for (const a of this.data.applications) {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    }
    const colorMap = {
      Wishlist: '#94a3b8',
      Applied: '#3b82f6',
      'Online Assessment': '#f59e0b',
      Interview: '#8b5cf6',
      Offer: '#10b981',
      Rejected: '#ef4444',
    };
    const applicationStatusDistribution = Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
      color: colorMap[key] || '#64748b',
    }));

    const topicStats = this.getDsaTopicStats().data;

    const upcomingInterviews = this.data.applications.filter(
      (a) => a.status === 'Interview' || a.status === 'Online Assessment'
    );

    return {
      success: true,
      data: {
        kpi: {
          totalDsa,
          solvedDsa,
          totalApplications,
          interviewsScheduled,
          overallProgress,
        },
        weeklyActivity: this.data.studyHours,
        dsaTopicProgress: topicStats,
        applicationStatusDistribution,
        upcomingInterviews,
        recentApplications: this.data.applications.slice(0, 5),
      },
    };
  }

  getHealth() {
    return {
      status: 'OK',
      project: 'PlacementPro (Offline / Demo Store Active)',
      database: {
        connected: false,
        mode: 'demo',
        name: 'placementpro (browser demo)',
        host: 'localhost',
        port: 27017,
      },
    };
  }
}

export const demoStore = new DemoStore();
export default demoStore;
