import React, { useState } from "react";
import {
  ImageInputWrapper,
  ImageInputLabel,
  StyledImageInput,
  ImageSelectButton,
  SelectedImage,
} from "./styles"; // Certifique-se de ajustar o caminho correto

const ImageInput = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <ImageInputWrapper>
      <ImageInputLabel>Selecionar Imagem:</ImageInputLabel>
      <StyledImageInput
        id="image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <ImageSelectButton htmlFor="image-input">
        Selecionar Imagem
      </ImageSelectButton>
      {selectedImage && <SelectedImage src={selectedImage} alt="Selected" />}
    </ImageInputWrapper>
  );
};

export default ImageInput;
