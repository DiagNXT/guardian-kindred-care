import { Composition } from "remotion";
import { AuraCareAd } from "./AuraCareAd";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AuraCareAd"
        component={AuraCareAd}
        durationInFrames={1800} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};