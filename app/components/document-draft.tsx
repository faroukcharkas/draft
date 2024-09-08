import { TitleField } from "./title-field";
import { BodyField } from "./body-field";
export default function DocumentDraft() {
  return (
    <div className="flex max-w-[850px] flex-1 px-10 pt-10">
      <div className="flex flex-1 flex-col gap-4 overflow-scroll">
        <TitleField />
        <BodyField />
      </div>
    </div>
  );
}