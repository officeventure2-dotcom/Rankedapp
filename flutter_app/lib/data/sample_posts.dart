class Post {
  const Post(this.author, this.handle, this.title, this.body, this.xp, this.likes, this.comments);
  final String author;
  final String handle;
  final String title;
  final String body;
  final int xp;
  final int likes;
  final int comments;
}

/// Local sample data until the Dart backend exists.
const samplePosts = [
  Post('Dr. Marcus', '@marcus_v', 'New paper published in Nature Physics',
      'Three years of validation across European accelerators. Added milestone: +25,000 XP.', 25000, 184, 28),
  Post('Elena Rostova', '@elena_r', 'Ultra-trail marathon 50km completed',
      'Finished in 6h 12m. Strava-verified run logged to Fitness.', 8000, 96, 11),
  Post('Sam Okafor', '@sam_o', 'Finished 30 days of Spanish',
      'Daily Language Lab streak reached 30. Next: B1 exam prep.', 3000, 61, 7),
];
