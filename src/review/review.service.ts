import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class ReviewService {
  constructor(private dbService: DbService) {}
  async createReview(profileId: string, text: string) {
    await this.dbService.review.create({
      data: {
        text,
        profileId,
      },
    });
  }

  async deleteReview(reviewId: string, userId: string) {
    await this.dbService.review.update({
      where: { id: reviewId, profile: { userId } },
      data: { isDeleted: true },
    });
  }

  async recoveryReview(reviewId: string, userId: string) {
    await this.dbService.review.update({
      where: { id: reviewId, profile: { userId } },
      data: { isDeleted: false },
    });
  }

  async publishedReview(reviewId: string, userId: string) {
    await this.dbService.review.update({
      where: { id: reviewId, profile: { userId } },
      data: { isPublished: true },
    });
  }
  async getPublishedReviews(profileId: string) {
    return this.dbService.review.findMany({
      where: { isPublished: true, profileId, isDeleted: false },
    });
  }
  async getAllReviews(userId: string) {
    const [active, moderation, deleted] = await this.dbService.$transaction([
      this.dbService.review.findMany({
        where: { isPublished: true, profile: { userId }, isDeleted: false },
      }),
      this.dbService.review.findMany({
        where: { isPublished: false, profile: { userId }, isDeleted: false },
      }),
      this.dbService.review.findMany({
        where: { isDeleted: true, profile: { userId } },
      }),
    ]);
    return { active, moderation, deleted };
  }

  async getActiveReviews(userId: string, skip: number) {
    const [active, count] = await this.dbService.$transaction([
      this.dbService.review.findMany({
        where: { isPublished: true, profile: { userId }, isDeleted: false },
        skip,
        take: 5,
      }),
      this.dbService.review.count({
        where: { isPublished: true, profile: { userId }, isDeleted: false },
      }),
    ]);
    const hasMore = count > active.length + skip;
    return { reviews: active, totalElements: count, hasMore };
  }
  async getModerationReviews(userId: string, skip: number) {
    const [moderation, count] = await this.dbService.$transaction([
      this.dbService.review.findMany({
        where: { isPublished: false, profile: { userId }, isDeleted: false },
        skip,
        take: 5,
      }),
      this.dbService.review.count({
        where: { isPublished: false, profile: { userId }, isDeleted: false },
      }),
    ]);
    const hasMore = count > moderation.length + skip;
    return { reviews: moderation, totalElements: count, hasMore };
  }
  async getDeletedReviews(userId: string, skip: number) {
    return this.dbService.review.findMany({
      where: { isDeleted: true, profile: { userId } },
      skip,
    });
  }
}
