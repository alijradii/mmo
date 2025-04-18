import { BuilderPageComponent } from "@/components/character-builder/builder-page";
import { Provider } from "jotai";

export const BuilderPage: React.FC = () => {
  return (
    <Provider>
      <BuilderPageComponent />;
    </Provider>
  );
};
