// custom-validator.ts

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CreateArticleDto } from '../dto/create-article.dto';

@ValidatorConstraint({ name: 'contentToNoIsActive', async: false })
export class ContentToNoIsActiveValidator implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const { object } = args;
    const content = (object as CreateArticleDto)['content']; // Получаем значение поля name из объекта
    const isArticle = (object as CreateArticleDto)['isArticle']; // Получаем значение поля name из объекта

    return isArticle ? !!content : !content; // Проверяем, что address содержит значение из name
  }
}
