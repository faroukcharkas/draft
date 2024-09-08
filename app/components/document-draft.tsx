import { TitleField } from "./title-field";
import { DraftBody } from "./draft-body";

export default function DocumentDraft() {
  return (
    <div className="flex max-w-[850px] flex-1 pt-20">
      <div className="flex flex-1 flex-col gap-4 overflow-scroll px-20">
        <TitleField />
        <DraftBody />
      </div>
    </div>
  );
}