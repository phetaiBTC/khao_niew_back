import { Image } from "../entities/image.entity";

export function mapImage(image: Image) : Image {
  
  const mappedImage = Object.assign(new Image(), {
    id: image.id,
    url: image.url,
    key: image.key,
    createdAt: image.created_At,
    updatedAt: image.updated_At,
  });
  return mappedImage;
}
