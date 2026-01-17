import { DateTime } from 'luxon';
import { Testimonial } from '@app/domain/entities';

export interface TestimonialDto {
  id: string;
  name: string;
  position: string;
  photo: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class TestimonialMapper {
  public static fromDomaintoDto(testimonial: Partial<Testimonial>): Partial<TestimonialDto> {
    return {
      id: testimonial.id,
      name: testimonial.name,
      position: testimonial.position,
      photo: testimonial.photo,
      content: testimonial.content,
      created_at: testimonial.createdAt?.toISOString(),
      updated_at: testimonial.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(testimonialDto: TestimonialDto): Testimonial {
    return new Testimonial(
      testimonialDto.id,
      testimonialDto.name,
      testimonialDto.position,
      testimonialDto.photo,
      testimonialDto.content,
      DateTime.fromISO(testimonialDto.created_at).toJSDate(),
      DateTime.fromISO(testimonialDto.updated_at).toJSDate(),
    );
  }
}
