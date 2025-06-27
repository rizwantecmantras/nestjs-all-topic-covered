import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findById(id);
  }

  @Post()
  createPost(
    @Body() postData: { title: string; content: string; authorId: number },
  ) {
    return this.postsService.create(postData);
  }

  @Put(':id')
  updatePost(
    @Param('id') id,
    @Body() postData: { title?: string; content?: string; authorId?: number },
  ) {
    return this.postsService.update(id, postData);
  }

  @Delete(':id')
  deletePost(@Param('id') id) {
    return this.postsService.delete(id);
  }
}
