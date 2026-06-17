import 'package:flutter/material.dart';

/// In-memory content store. Seeded with rich default content and
/// MUTABLE so a teacher can add subjects, notes and quizzes at runtime.
/// Replace the seed + add* methods with ApiService calls when your
/// Flask backend is ready.
class CourseData {
  static const departments = ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  // Cycled through when a teacher creates a new subject.
  static final List<Color> _palette = const [
    Color(0xFF4F46E5), Color(0xFF06B6D4), Color(0xFF10B981),
    Color(0xFFF59E0B), Color(0xFFEF4444), Color(0xFF8B5CF6),
    Color(0xFF0EA5E9), Color(0xFFEC4899),
  ];
  static final List<IconData> _icons = const [
    Icons.menu_book, Icons.science, Icons.calculate, Icons.code,
    Icons.public, Icons.bolt, Icons.architecture, Icons.biotech,
  ];

  static Subject _s(String name, String code, IconData i, Color c) =>
      Subject(name, code, i, c);

  /// department -> subjects ('_common' is shown to everyone).
  static final Map<String, List<Subject>> _subjects = {
    '_common': [
      _s('Artificial Intelligence', 'AI', Icons.psychology_alt, Color(0xFF4F46E5)),
      _s('Machine Learning', 'ML', Icons.auto_graph, Color(0xFF06B6D4)),
      _s('Python Programming', 'PY', Icons.code, Color(0xFF10B981)),
      _s('Aptitude & Reasoning', 'APT', Icons.extension, Color(0xFFEC4899)),
    ],
    'CSE': [
      _s('Data Structures', 'DS', Icons.account_tree, Color(0xFF10B981)),
      _s('Operating Systems', 'OS', Icons.memory, Color(0xFFF59E0B)),
      _s('DBMS', 'DBMS', Icons.storage, Color(0xFFEF4444)),
      _s('Computer Networks', 'CN', Icons.lan, Color(0xFF8B5CF6)),
      _s('Software Engineering', 'SE', Icons.engineering, Color(0xFF0EA5E9)),
      _s('Web Development', 'WEB', Icons.web, Color(0xFFEC4899)),
    ],
    'ECE': [
      _s('Digital Electronics', 'DE', Icons.developer_board, Color(0xFF10B981)),
      _s('Signals & Systems', 'SS', Icons.graphic_eq, Color(0xFFF59E0B)),
      _s('Embedded Systems', 'ES', Icons.dns, Color(0xFFEF4444)),
      _s('Microprocessors', 'MP', Icons.memory, Color(0xFF8B5CF6)),
      _s('Communication Systems', 'CMS', Icons.cell_tower, Color(0xFF0EA5E9)),
    ],
    'MECH': [
      _s('Thermodynamics', 'THERMO', Icons.local_fire_department, Color(0xFF10B981)),
      _s('Fluid Mechanics', 'FM', Icons.water_drop, Color(0xFFF59E0B)),
      _s('Machine Design', 'MD', Icons.precision_manufacturing, Color(0xFFEF4444)),
      _s('Manufacturing', 'MFG', Icons.factory, Color(0xFF8B5CF6)),
      _s('Strength of Materials', 'SOM', Icons.fitness_center, Color(0xFF0EA5E9)),
    ],
    'EEE': [
      _s('Power Systems', 'PS', Icons.bolt, Color(0xFF10B981)),
      _s('Control Systems', 'CS', Icons.tune, Color(0xFFF59E0B)),
      _s('Electric Machines', 'EM', Icons.electric_bolt, Color(0xFFEF4444)),
      _s('Power Electronics', 'PE', Icons.power, Color(0xFF8B5CF6)),
      _s('Circuit Theory', 'CT', Icons.electrical_services, Color(0xFF0EA5E9)),
    ],
    'CIVIL': [
      _s('Structural Analysis', 'SA', Icons.architecture, Color(0xFF10B981)),
      _s('Surveying', 'SV', Icons.terrain, Color(0xFFF59E0B)),
      _s('Geotechnical Engg', 'GE', Icons.landscape, Color(0xFFEF4444)),
      _s('Concrete Technology', 'CTECH', Icons.foundation, Color(0xFF8B5CF6)),
      _s('Transportation Engg', 'TE', Icons.directions_car, Color(0xFF0EA5E9)),
    ],
  };

  static List<Subject> subjectsFor(String? department) {
    return [...(_subjects['_common'] ?? []), ...(_subjects[department] ?? [])];
  }

  /// All subjects across departments (for teacher pickers).
  static List<Subject> allSubjects() =>
      _subjects.values.expand((e) => e).toList();

  static int get totalSubjects => allSubjects().length;

  // ---------------- TEACHER: add content ----------------
  static Subject addSubject(String department, String name) {
    final code = _makeCode(name);
    final idx = totalSubjects;
    final subject = Subject(
        name, code, _icons[idx % _icons.length], _palette[idx % _palette.length]);
    _subjects.putIfAbsent(department, () => []);
    _subjects[department]!.add(subject);
    _notes.putIfAbsent(code, () => []);
    _quizzes.putIfAbsent(code, () => []);
    return subject;
  }

  static void addNote(String code, NoteSection note) {
    _notes.putIfAbsent(code, () => []);
    _notes[code]!.add(note);
  }

  static void addQuestion(String code, QuizQuestion q) {
    _quizzes.putIfAbsent(code, () => []);
    _quizzes[code]!.add(q);
  }

  static String _makeCode(String name) {
    final base = name
        .toUpperCase()
        .replaceAll(RegExp(r'[^A-Z0-9 ]'), '')
        .split(' ')
        .where((w) => w.isNotEmpty)
        .map((w) => w[0])
        .join();
    var code = base.isEmpty ? 'SUB' : base;
    var c = code;
    var n = 1;
    while (_notes.containsKey(c) || _quizzes.containsKey(c)) {
      c = '$code$n';
      n++;
    }
    return c;
  }

  // ---------------- NOTES ----------------
  static List<NoteSection> notesFor(String code) {
    return _notes[code] ?? _generic();
  }

  static List<NoteSection> _generic() => const [
        NoteSection('Introduction',
            'Core notes for this subject. A teacher can add detailed content from the Teacher panel, or connect the backend to load full chapters.'),
        NoteSection('Key Concepts',
            'Definitions, formulas and diagrams will appear here once content is added.'),
        NoteSection('Summary',
            'Review the key points, then test yourself in the Quizzes section to earn reward points.'),
      ];

  static final Map<String, List<NoteSection>> _notes = {
    'AI': const [
      NoteSection('What is Artificial Intelligence?',
          'AI is the branch of computer science focused on building machines that perform tasks needing human-like intelligence — reasoning, perception, learning and decision making.'),
      NoteSection('Types of AI',
          '1. Narrow AI – one task (spam filter, chess).\n2. General AI – human-level reasoning across tasks (still theoretical).\n3. Super AI – beyond human ability (hypothetical).'),
      NoteSection('Core Areas',
          '• Search & problem solving\n• Knowledge representation\n• Machine Learning\n• Natural Language Processing\n• Computer Vision\n• Robotics'),
      NoteSection('Search Techniques',
          'Uninformed search (BFS, DFS) explores blindly; informed search (A*, Greedy) uses heuristics to reach the goal faster.'),
      NoteSection('Real World Uses',
          'Voice assistants, recommendation systems, self-driving cars, medical diagnosis, fraud detection and chatbots.'),
    ],
    'ML': const [
      NoteSection('What is Machine Learning?',
          'ML is a subset of AI where systems learn patterns from data and improve with experience, without being explicitly programmed for every rule.'),
      NoteSection('Three Main Types',
          '1. Supervised – labelled data (classification, regression).\n2. Unsupervised – unlabelled data (clustering, dimensionality reduction).\n3. Reinforcement – learns by reward and penalty.'),
      NoteSection('Common Algorithms',
          'Linear & Logistic Regression, Decision Trees, Random Forest, KNN, K-Means, SVM and Neural Networks.'),
      NoteSection('Overfitting vs Underfitting',
          'Overfitting: model memorises training data, fails on new data. Underfitting: model too simple to capture patterns. Fix with more data, regularisation or right model complexity.'),
      NoteSection('Workflow',
          'Collect data → clean & prepare → split train/test → choose model → train → evaluate → tune → deploy.'),
    ],
    'PY': const [
      NoteSection('Why Python?',
          'Python is a high-level, readable language used in web, data science, AI, automation and scripting. It is interpreted and dynamically typed.'),
      NoteSection('Data Types',
          'int, float, str, bool, list, tuple, set, dict. Lists are mutable; tuples are immutable; dicts store key–value pairs.'),
      NoteSection('Control Flow',
          'if / elif / else for decisions; for and while for loops; break and continue to control iteration.'),
      NoteSection('Functions',
          'def name(args): ... Use return to send back values. Supports default args, *args and **kwargs.'),
      NoteSection('OOP Basics',
          'class defines a blueprint; objects are instances. Key ideas: inheritance, encapsulation, polymorphism and abstraction.'),
    ],
    'APT': const [
      NoteSection('Quantitative Aptitude',
          'Covers percentages, ratios, averages, time-speed-distance, profit & loss, and number systems. Practice mental shortcuts for speed.'),
      NoteSection('Logical Reasoning',
          'Series, coding-decoding, blood relations, syllogisms and seating arrangement. Read carefully and eliminate wrong options.'),
      NoteSection('Verbal Ability',
          'Synonyms/antonyms, sentence correction, reading comprehension. Build vocabulary daily.'),
    ],
    'DS': const [
      NoteSection('What are Data Structures?',
          'Ways to organise and store data for efficient access and modification. Choosing the right one affects speed and memory.'),
      NoteSection('Linear Structures',
          'Array (fixed/contiguous), Linked List (nodes + pointers), Stack (LIFO), Queue (FIFO).'),
      NoteSection('Non-Linear Structures',
          'Trees (hierarchical, e.g. BST, AVL, Heap) and Graphs (vertices + edges, directed/undirected).'),
      NoteSection('Time Complexity',
          'Big-O describes growth: O(1) constant, O(log n), O(n), O(n log n), O(n^2). Aim for lower order for large inputs.'),
    ],
    'OS': const [
      NoteSection('What is an OS?',
          'System software managing hardware and software resources, providing services to programs (memory, CPU, files, devices).'),
      NoteSection('Process & Thread',
          'A process is a program in execution; a thread is the smallest unit within a process. Processes have separate memory; threads share it.'),
      NoteSection('CPU Scheduling',
          'Algorithms decide which process runs next: FCFS, SJF, Round Robin, Priority. Goal: maximise CPU use, minimise waiting time.'),
      NoteSection('Deadlock',
          'Occurs when processes wait on each other forever. Four conditions: mutual exclusion, hold-and-wait, no preemption, circular wait.'),
    ],
    'DBMS': const [
      NoteSection('What is a DBMS?',
          'Software to store, retrieve and manage data efficiently with security, concurrency and integrity (e.g. MySQL, PostgreSQL).'),
      NoteSection('Keys',
          'Primary key uniquely identifies a row; foreign key links tables; candidate and composite keys also exist.'),
      NoteSection('Normalization',
          'Process to reduce redundancy: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency).'),
      NoteSection('SQL Basics',
          'SELECT, INSERT, UPDATE, DELETE for data; JOINs combine tables; WHERE filters; GROUP BY aggregates.'),
    ],
    'CN': const [
      NoteSection('What are Computer Networks?',
          'Interconnected devices that share data and resources using protocols over wired or wireless links.'),
      NoteSection('OSI Model',
          '7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Each has a defined role.'),
      NoteSection('TCP vs UDP',
          'TCP is connection-oriented and reliable (web, email). UDP is connectionless and fast (streaming, gaming).'),
      NoteSection('IP Addressing',
          'IPv4 is 32-bit (e.g. 192.168.1.1); IPv6 is 128-bit. Subnetting splits networks for efficient routing.'),
    ],
    'SE': const [
      NoteSection('Software Engineering',
          'Applying engineering principles to build reliable software systematically — from requirements to maintenance.'),
      NoteSection('SDLC Models',
          'Waterfall (sequential), Agile (iterative sprints), Spiral (risk-driven), V-Model (testing focused).'),
      NoteSection('Testing',
          'Unit, integration, system and acceptance testing. Black-box tests behaviour; white-box tests internal logic.'),
    ],
    'WEB': const [
      NoteSection('Web Basics',
          'HTML structures content, CSS styles it, JavaScript adds interactivity. Browsers render these for users.'),
      NoteSection('Frontend vs Backend',
          'Frontend = what users see (React, Flutter web). Backend = server logic & databases (Flask, Node). They talk via APIs.'),
      NoteSection('HTTP & REST',
          'HTTP methods: GET, POST, PUT, DELETE. REST APIs expose resources via URLs and return JSON.'),
    ],
    // ----- ECE -----
    'DE': const [
      NoteSection('Digital Electronics',
          'Deals with circuits using discrete values (0 and 1). Built from logic gates: AND, OR, NOT, NAND, NOR, XOR.'),
      NoteSection('Combinational vs Sequential',
          'Combinational output depends only on current input (adders, mux). Sequential also depends on past state (flip-flops, counters).'),
      NoteSection('Number Systems',
          'Binary, octal, decimal, hexadecimal. Conversions and binary arithmetic are fundamental.'),
    ],
    'SS': const [
      NoteSection('Signals & Systems',
          'A signal carries information vs time; a system processes signals. Signals can be continuous or discrete.'),
      NoteSection('Fourier Transform',
          'Converts a time-domain signal into its frequency components — essential for analysis and filtering.'),
    ],
    'ES': const [
      NoteSection('Embedded Systems',
          'Dedicated computing systems within larger devices (washing machines, cars). Combine hardware + firmware.'),
      NoteSection('Microcontrollers',
          'A single chip with CPU, memory and I/O (e.g. Arduino/AVR, ARM Cortex-M). Programmed in C/C++.'),
    ],
    'MP': const [
      NoteSection('Microprocessors',
          'CPU on a chip that fetches, decodes and executes instructions (e.g. 8085, 8086).'),
      NoteSection('Architecture',
          'Includes ALU, registers, control unit and buses (address, data, control).'),
    ],
    'CMS': const [
      NoteSection('Communication Systems',
          'Transmit information from source to destination through a channel using modulation.'),
      NoteSection('Modulation',
          'AM, FM and PM for analog; ASK, FSK, PSK for digital. Modulation lets signals travel efficiently.'),
    ],
    // ----- MECH -----
    'THERMO': const [
      NoteSection('Thermodynamics',
          'Study of energy, heat and work and their transformations. Governs engines, refrigerators and power plants.'),
      NoteSection('Laws',
          '1st law: energy is conserved. 2nd law: entropy of an isolated system increases; heat flows hot→cold.'),
    ],
    'FM': const [
      NoteSection('Fluid Mechanics',
          'Behaviour of liquids and gases at rest (statics) and in motion (dynamics).'),
      NoteSection('Key Equations',
          'Continuity (mass conservation) and Bernoulli (energy along a streamline) are central.'),
    ],
    'MD': const [
      NoteSection('Machine Design',
          'Designing components (shafts, gears, bearings) to safely carry loads within material limits.'),
      NoteSection('Factor of Safety',
          'Ratio of material strength to working stress; ensures reliability against failure.'),
    ],
    'MFG': const [
      NoteSection('Manufacturing',
          'Processes that convert raw material into products: casting, forming, machining, joining.'),
      NoteSection('CNC',
          'Computer Numerical Control machines automate precise cutting using programmed instructions.'),
    ],
    'SOM': const [
      NoteSection('Strength of Materials',
          'How solid bodies deform and fail under loads. Covers stress, strain and elasticity.'),
      NoteSection('Stress & Strain',
          "Stress = force/area; strain = deformation/original length. Hooke's law: stress ∝ strain in elastic range."),
    ],
    // ----- EEE -----
    'PS': const [
      NoteSection('Power Systems',
          'Generation, transmission and distribution of electrical power across the grid.'),
      NoteSection('Components',
          'Generators, transformers, transmission lines and protective relays keep the grid stable.'),
    ],
    'CS': const [
      NoteSection('Control Systems',
          'Manage the behaviour of dynamic systems using feedback to reach a desired output.'),
      NoteSection('Open vs Closed Loop',
          'Open loop has no feedback; closed loop uses feedback to correct errors automatically.'),
    ],
    'EM': const [
      NoteSection('Electric Machines',
          'Devices converting energy: motors (electrical→mechanical) and generators (mechanical→electrical).'),
      NoteSection('Transformers',
          'Transfer AC energy between circuits via electromagnetic induction, changing voltage levels.'),
    ],
    'PE': const [
      NoteSection('Power Electronics',
          'Uses semiconductor switches (diodes, thyristors, MOSFETs, IGBTs) to control electrical power.'),
      NoteSection('Converters',
          'Rectifier (AC→DC), Inverter (DC→AC), Chopper (DC→DC), Cycloconverter (AC→AC).'),
    ],
    'CT': const [
      NoteSection('Circuit Theory',
          'Analysis of electrical circuits using voltage, current and resistance relationships.'),
      NoteSection("Key Laws",
          "Ohm's law (V=IR) and Kirchhoff's current & voltage laws are the foundation of analysis."),
    ],
    // ----- CIVIL -----
    'SA': const [
      NoteSection('Structural Analysis',
          'Determining the effect of loads on physical structures and their components.'),
      NoteSection('Trusses & Beams',
          'Trusses carry axial forces; beams resist bending. Reactions found using equilibrium equations.'),
    ],
    'SV': const [
      NoteSection('Surveying',
          'Measuring distances, angles and elevations to map land and set out construction.'),
      NoteSection('Instruments',
          'Chain, theodolite, total station and GPS are used for accurate measurement.'),
    ],
    'GE': const [
      NoteSection('Geotechnical Engineering',
          'Studies soil and rock behaviour to design foundations, retaining walls and slopes.'),
      NoteSection('Soil Properties',
          'Permeability, shear strength and bearing capacity determine foundation design.'),
    ],
    'CTECH': const [
      NoteSection('Concrete Technology',
          'Study of concrete: ingredients, mix design, strength and durability.'),
      NoteSection('Mix',
          'Cement + fine aggregate + coarse aggregate + water (+ admixtures). Water–cement ratio controls strength.'),
    ],
    'TE': const [
      NoteSection('Transportation Engineering',
          'Planning, design and operation of roads, highways and traffic systems.'),
      NoteSection('Pavement',
          'Flexible (bituminous) vs rigid (concrete) pavements, designed for traffic load and life.'),
    ],
  };

  // ---------------- QUIZZES ----------------
  static List<QuizQuestion> quizFor(String code) {
    return _quizzes[code] ?? _genericQuiz();
  }

  static List<QuizQuestion> _genericQuiz() => const [
        QuizQuestion('Sample question 1 for this subject?',
            ['Option A', 'Option B', 'Option C'], 0),
        QuizQuestion('Sample question 2 for this subject?',
            ['Option A', 'Option B', 'Option C'], 2),
        QuizQuestion('Sample question 3 for this subject?',
            ['Option A', 'Option B', 'Option C'], 1),
      ];

  static final Map<String, List<QuizQuestion>> _quizzes = {
    'AI': const [
      QuizQuestion('AI that handles only one task is called…',
          ['General AI', 'Narrow AI', 'Super AI'], 1),
      QuizQuestion('Which is an application of AI?',
          ['Spreadsheet sum', 'Self-driving cars', 'Manual typing'], 1),
      QuizQuestion('A* search is a type of…',
          ['Uninformed search', 'Informed search', 'Sorting'], 1),
      QuizQuestion('NLP deals with…',
          ['Images', 'Human language', 'Circuits'], 1),
      QuizQuestion('Which is NOT a core area of AI?',
          ['Computer Vision', 'Robotics', 'Plumbing'], 2),
    ],
    'ML': const [
      QuizQuestion('Which learning type uses labelled data?',
          ['Unsupervised', 'Supervised', 'Reinforcement'], 1),
      QuizQuestion('K-Means is mainly used for…',
          ['Classification', 'Clustering', 'Regression'], 1),
      QuizQuestion('Which is NOT an ML algorithm?',
          ['Random Forest', 'Bubble Sort', 'SVM'], 1),
      QuizQuestion('Memorising training data and failing on new data is…',
          ['Underfitting', 'Overfitting', 'Tuning'], 1),
      QuizQuestion('Reinforcement learning learns by…',
          ['Labels', 'Reward and penalty', 'Clustering'], 1),
    ],
    'PY': const [
      QuizQuestion('Which is immutable in Python?',
          ['list', 'tuple', 'dict'], 1),
      QuizQuestion('How do you define a function?',
          ['func', 'def', 'function'], 1),
      QuizQuestion('Which stores key–value pairs?',
          ['set', 'list', 'dict'], 2),
      QuizQuestion('Output of 3 // 2 in Python?',
          ['1.5', '1', '2'], 1),
    ],
    'DS': const [
      QuizQuestion('A stack follows which order?',
          ['FIFO', 'LIFO', 'Random'], 1),
      QuizQuestion('A queue follows which order?',
          ['LIFO', 'FIFO', 'Sorted'], 1),
      QuizQuestion('Big-O of binary search?',
          ['O(n)', 'O(log n)', 'O(n^2)'], 1),
      QuizQuestion('Which is a non-linear structure?',
          ['Array', 'Tree', 'Stack'], 1),
    ],
    'OS': const [
      QuizQuestion('Smallest unit of execution is a…',
          ['Process', 'Thread', 'File'], 1),
      QuizQuestion('Which is a CPU scheduling algorithm?',
          ['Round Robin', 'Normalization', 'JOIN'], 0),
      QuizQuestion('Circular wait can cause…',
          ['Deadlock', 'Sorting', 'Caching'], 0),
    ],
    'DBMS': const [
      QuizQuestion('Which uniquely identifies a row?',
          ['Foreign key', 'Primary key', 'Index'], 1),
      QuizQuestion('1NF requires values to be…',
          ['Repeated', 'Atomic', 'Encrypted'], 1),
      QuizQuestion('Which SQL command reads data?',
          ['DELETE', 'SELECT', 'DROP'], 1),
    ],
    'CN': const [
      QuizQuestion('How many layers in the OSI model?',
          ['5', '7', '4'], 1),
      QuizQuestion('Which is connection-oriented?',
          ['UDP', 'TCP', 'IP'], 1),
      QuizQuestion('IPv4 address size is…',
          ['16-bit', '32-bit', '128-bit'], 1),
    ],
  };
}

class Subject {
  final String name;
  final String code;
  final IconData icon;
  final Color color;
  const Subject(this.name, this.code, this.icon, this.color);
}

class NoteSection {
  final String heading;
  final String body;
  const NoteSection(this.heading, this.body);
}

class QuizQuestion {
  final String question;
  final List<String> options;
  final int answerIndex;
  const QuizQuestion(this.question, this.options, this.answerIndex);
}
