class Session {
  static int? userId;
  static String? name;
  static String? email;
  static String? department;
  static String role = 'Student';
  static int year = 1;
  static int points = 0;
  static int streakDays = 0;
  static List<String> badges = [];

  static bool get isLoggedIn => userId != null;
  static bool get isTeacher => role == 'Teacher';

  static void setUser(Map<String, dynamic> u) {
    userId = u['id'];
    name = u['name'];
    email = u['email'];
    role = u['role'] ?? 'Student';
    department = u['department'] ?? 'CSE';
    year = u['year'] ?? 1;
    points = u['points'] ?? 0;
    streakDays = u['streak_days'] ?? 0;
  }

  static void clear() {
    userId = null;
    name = null;
    email = null;
    department = null;
    role = 'Student';
    year = 1;
    points = 0;
    streakDays = 0;
    badges = [];
  }
}
