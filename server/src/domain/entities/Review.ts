export interface Review {
  review_id: number;
  comic_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: Date;
}

export class ReviewEntity implements Review {
  constructor(
    public review_id: number,
    public comic_id: number,
    public user_id: number,
    public user_name: string,
    public rating: number,
    public review_text: string,
    public created_at: Date
  ) {}

  static create(
    comicId: number,
    userId: number,
    userName: string,
    rating: number,
    reviewText: string
  ): ReviewEntity {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (reviewText.trim().length === 0) {
      throw new Error('Review text cannot be empty');
    }

    return new ReviewEntity(
      0, // Will be set by database
      comicId,
      userId,
      userName,
      rating,
      reviewText.trim(),
      new Date()
    );
  }

  updateReview(rating: number, reviewText: string): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (reviewText.trim().length === 0) {
      throw new Error('Review text cannot be empty');
    }

    this.rating = rating;
    this.review_text = reviewText.trim();
  }
}