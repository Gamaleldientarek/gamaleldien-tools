import { Composition } from "remotion";
import { PromoV3 } from "./PromoV3";
import { PromoV4 } from "./PromoV4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoV3"
        component={PromoV3}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PromoV4"
        component={PromoV4}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
