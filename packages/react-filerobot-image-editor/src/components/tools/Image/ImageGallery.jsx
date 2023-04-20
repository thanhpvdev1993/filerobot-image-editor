/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';

/** Internal Dependencies */
import { useStore } from 'hooks';
import { TOOLS_IDS } from 'utils/constants';
import Carousel from 'components/common/Carousel';
import { StyledImageGalleryItem } from './Image.styled';

const ImageGallery = ({ selectImage, style }) => {
  const { config } = useStore();

  const getImgAndSelect = (e) => {
    selectImage(e.currentTarget.children[0]);
  };

  const { gallery = [] } = config[TOOLS_IDS.IMAGE] || {};

  if (gallery.length === 0) {
    return null;
  }

  return (
    <Carousel className="FIE_image-gallery" style={style}>
      {gallery.map((imageUrl) => (
        <StyledImageGalleryItem
          className="FIE_image-selected-item"
          onClick={getImgAndSelect}
          key={imageUrl}
        >
          <img
            src={imageUrl}
            alt={imageUrl}
            crossOrigin="Anonymous"
            draggable={false}
          />
        </StyledImageGalleryItem>
      ))}
    </Carousel>
  );
};

ImageGallery.defaultProps = {
  style: undefined,
};

ImageGallery.propTypes = {
  selectImage: PropTypes.func.isRequired,
  style: PropTypes.instanceOf(Object),
};

export default ImageGallery;
