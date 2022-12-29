const appImages = [
  {
    imageName: "forgotPassword",
    imageHeight: 632.16225,
    imageWidth: 951.23547,
  },
  { imageName: "order", imageHeight: 557.51874, imageWidth: 885.55805 },
  { imageName: "signIn", imageHeight: 500.35625, imageWidth: 832.206004 },
  { imageName: "welcomeAlt", imageHeight: 629.61397, imageWidth: 731.07696 },
  { imageName: "welcomeCats", imageHeight: 459.37952, imageWidth: 889.07556 },
];

export const lookupImageSize = (
  imageName: "forgotPassword" | "order" | "signIn" | "welcomeCats"
) => {
  const targetImage = appImages.find((image) => image.imageName === imageName)!;

  return targetImage;
};
