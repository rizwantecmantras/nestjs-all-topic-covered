import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    // private readonly jwtService: JwtService,
  ) {}

  //   posts = [
  //     {
  //       id: 1,
  //       title: 'First Post',
  //       content: 'This is the content of the first post.',
  //       authorId: 1,
  //     },
  //     {
  //       id: 2,
  //       title: 'Second Post',
  //       content: 'This is the content of the second post.',
  //       authorId: 2,
  //     },
  //     {
  //       id: 3,
  //       title: 'Third Post',
  //       content: 'This is the content of the third post.',
  //       authorId: 1,
  //     },
  //     {
  //       id: 4,
  //       title: 'Fourth Post',
  //       content: 'This is the content of the fourth post.',
  //       authorId: 3,
  //     },
  //     {
  //       id: 5,
  //       title: 'Fifth Post',
  //       content: 'This is the content of the fifth post.',
  //       authorId: 2,
  //     },
  //   ];

  findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  findById(id: number) {
    return this.postModel.findById(id);
  }
  async create(postData: { title: string; content: string; authorId: number }) {
    const newPost = new this.postModel({
      ...postData,
    });
    await newPost.save();
  }

  async update(
    id: number,
    postData: { title?: string; content?: string; authorId?: number },
  ) {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      { $set: postData },
      { new: true },
    );
    return updatedPost;
  }

  delete(id: number) {
    return this.postModel.findByIdAndDelete(id);
  }
}
