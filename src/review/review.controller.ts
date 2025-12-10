import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/createReviewDto';
import { Roles } from '../common/decorators/roles.decorator';
import { SessionInfo } from '../common/decorators/session-info.decorator';
import type { Session } from '../common/types/types';
import { Role } from '../common/const/const';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('/create')
  @Public()
  async createReview(@Body() body: CreateReviewDto) {
    return this.reviewService.createReview(body.profileId, body.text);
  }

  @Delete('/delete/:reviewId')
  @Roles(Role.MODEL)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @SessionInfo() session: Session,
  ) {
    return this.reviewService.deleteReview(reviewId, session.id);
  }

  @Patch('/published/:reviewId')
  @Roles(Role.MODEL)
  async publishedReview(
    @Param('reviewId') reviewId: string,
    @SessionInfo() session: Session,
  ) {
    return this.reviewService.publishedReview(reviewId, session.id);
  }

  @Patch('/recovery/:reviewId')
  @Roles(Role.MODEL)
  async recoveryReview(
    @Param('reviewId') reviewId: string,
    @SessionInfo() session: Session,
  ) {
    return this.reviewService.recoveryReview(reviewId, session.id);
  }

  @Get('/all')
  @Roles(Role.MODEL)
  async getAllReviews(@SessionInfo() session: Session) {
    return this.reviewService.getAllReviews(session.id);
  }

  @Get('/active')
  @Roles(Role.MODEL)
  async getActiveReviews(@SessionInfo() session: Session) {
    return this.reviewService.getActiveReviews(session.id, 0);
  }

  @Get('/moderation')
  @Roles(Role.MODEL)
  async getModerationReviews(
    @SessionInfo() session: Session,
    @Query('skip') skip: number,
  ) {
    return this.reviewService.getModerationReviews(session.id, +skip);
  }

  @Get('/deleted')
  @Roles(Role.MODEL)
  async getDeletedReviews(@SessionInfo() session: Session) {
    return this.reviewService.getDeletedReviews(session.id, 0);
  }
}
