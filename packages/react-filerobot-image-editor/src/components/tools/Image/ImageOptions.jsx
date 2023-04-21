/** External Dependencies */
import React, { useRef, useState } from 'react';
import Button from '@scaleflex/ui/core/button';

/** Internal Dependencies */
import { useAnnotation, usePhoneScreen, useStore } from 'hooks';
import { FEEDBACK_STATUSES, TOOLS_IDS } from 'utils/constants';
import { SET_FEEDBACK } from 'actions';
import HiddenUploadInput from 'components/common/HiddenUploadInput';
import ImageControls from './ImageControls';
import ImageGallery from './ImageGallery';
import { StyledImageOptionWrapper, StyledImageWrapper } from './Image.styled';

const ImageOptions = () => {
  const [isLoading, setIsLoading] = useState();
  const uploadImgsInput = useRef();
  const {
    shownImageDimensions,
    config,
    dispatch,
    adjustments: { crop = {} },
    t,
  } = useStore();
  const [image, saveImage, addNewImage] = useAnnotation(
    {
      name: TOOLS_IDS.IMAGE,
      opacity: 1,
    },
    false,
  );

  const isPhoneScreen = usePhoneScreen();

  const layerWidth = crop.width || shownImageDimensions.width;
  const layerHeight = crop.height || shownImageDimensions.height;

  const layerCropX = crop.x || 0;
  const layerCropY = crop.y || 0;

  const requestedImgsCount = useRef(0);

  const imageConfig = config[TOOLS_IDS.IMAGE];
  const imageScalingRatio = imageConfig.imageScalingRatio || 0.15;

  const addImgScaled = (loadedImg) => {
    const imgRatio = loadedImg.width / loadedImg.height;
    const newImgDimensions = {};
    if (layerHeight > layerWidth) {
      const newImgScale = (layerHeight * imageScalingRatio) / loadedImg.height;
      newImgDimensions.height = loadedImg.height * newImgScale;
      newImgDimensions.width = newImgDimensions.height * imgRatio;
    } else {
      const newImgScale = (layerWidth * imageScalingRatio) / loadedImg.width;
      newImgDimensions.width = loadedImg.width * newImgScale;
      newImgDimensions.height = newImgDimensions.width / imgRatio;
    }

    addNewImage({
      ...newImgDimensions,
      padding: 1,
      image: loadedImg,
      x: layerCropX + layerWidth / 2 - newImgDimensions.width / 2,
      y: layerCropY + layerHeight / 2 - newImgDimensions.height / 2,
    });
  };

  const hideLoaderAfterDone = (filesLength) => {
    requestedImgsCount.current += 1;
    if (requestedImgsCount.current === filesLength) {
      requestedImgsCount.current = 0;
      setIsLoading(false);
    }
  };

  const setFeedback = (msg) => {
    dispatch({
      type: SET_FEEDBACK,
      payload: {
        feedback: {
          message: msg,
          status: FEEDBACK_STATUSES.WARNING,
        },
      },
    });
  };

  const importImages = (e) => {
    if (e.target.files) {
      setIsLoading(true);

      const wrongFilesNames = [];

      const filesArray = Array.from(e.target.files);
      const filesLength = filesArray.length;
      filesArray.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            addImgScaled(img);
            URL.revokeObjectURL(file);
            hideLoaderAfterDone(filesLength);
          };
          img.onerror = () => {
            setFeedback(t('uploadImageError'));
            hideLoaderAfterDone(filesLength);
          };
          img.src = URL.createObjectURL(file);
        } else {
          wrongFilesNames.push(file.name);
          hideLoaderAfterDone(filesLength);
        }
      });

      if (wrongFilesNames.length > 0) {
        const errorLabel =
          wrongFilesNames.length > 1 ? t('areNotImages') : t('isNotImage');
        setFeedback(
          `${wrongFilesNames.join(', ')} ${errorLabel} ${t('toBeUploaded')}.`,
        );
      }
    }

    e.target.value = '';
  };

  const triggerUploadInput = () => {
    if (uploadImgsInput.current) {
      uploadImgsInput.current.click();
    }
  };

  return (
    <StyledImageOptionWrapper>
      <ImageControls image={image} saveImage={saveImage} t={t} />
      <StyledImageWrapper className="FIE_image-add-wrapper">
        <Button
          className="FIE_image-tool-add-option"
          color="secondary"
          onClick={isLoading ? undefined : triggerUploadInput}
          disabled={isLoading}
          size="sm"
          style={{ maxHeight: 24 }}
        >
          {isLoading ? t('importing') : t('addImage')}
        </Button>
        <ImageGallery
          selectImage={addImgScaled}
          style={isPhoneScreen ? { width: '55%' } : undefined}
        />
        <HiddenUploadInput
          ref={uploadImgsInput}
          onChange={isLoading ? undefined : importImages}
          disabled={isLoading}
          multiple
        />
      </StyledImageWrapper>
    </StyledImageOptionWrapper>
  );
};

export default ImageOptions;
